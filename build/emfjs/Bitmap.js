/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EMFJSError, Helper } from "./Helper";
var BitmapBase = /** @class */ (function () {
    function BitmapBase() {
    }
    BitmapBase.prototype.getWidth = function () {
        throw new EMFJSError("getWidth not implemented");
    };
    BitmapBase.prototype.getHeight = function () {
        throw new EMFJSError("getHeight not implemented");
    };
    return BitmapBase;
}());
export { BitmapBase };
var BitmapCoreHeader = /** @class */ (function () {
    function BitmapCoreHeader(reader, skipsize) {
        if (skipsize) {
            reader.skip(4);
        }
        this.width = reader.readUint16();
        this.height = reader.readUint16();
        this.planes = reader.readUint16();
        this.bitcount = reader.readUint16();
    }
    BitmapCoreHeader.prototype.colors = function () {
        return this.bitcount <= 8 ? 1 << this.bitcount : 0;
    };
    return BitmapCoreHeader;
}());
export { BitmapCoreHeader };
var BitmapInfoHeader = /** @class */ (function () {
    function BitmapInfoHeader(reader, skipsize) {
        if (skipsize) {
            reader.skip(4);
        }
        this.width = reader.readInt32();
        this.height = reader.readInt32();
        this.planes = reader.readUint16();
        this.bitcount = reader.readUint16();
        this.compression = reader.readUint32();
        this.sizeimage = reader.readUint32();
        this.xpelspermeter = reader.readInt32();
        this.ypelspermeter = reader.readInt32();
        this.clrused = reader.readUint32();
        this.clrimportant = reader.readUint32();
    }
    BitmapInfoHeader.prototype.colors = function () {
        if (this.clrused !== 0) {
            return this.clrused < 256 ? this.clrused : 256;
        }
        else {
            return this.bitcount > 8 ? 0 : 1 << this.bitcount;
        }
    };
    return BitmapInfoHeader;
}());
export { BitmapInfoHeader };
var BitmapInfo = /** @class */ (function (_super) {
    __extends(BitmapInfo, _super);
    function BitmapInfo(reader, usergb) {
        var _this = _super.call(this) || this;
        _this._usergb = usergb;
        var hdrsize = reader.readUint32();
        _this._infosize = hdrsize;
        if (hdrsize === Helper.GDI.BITMAPCOREHEADER_SIZE) {
            _this._header = new BitmapCoreHeader(reader, false);
            _this._infosize += _this._header.colors() * (usergb ? 3 : 2);
        }
        else {
            _this._header = new BitmapInfoHeader(reader, false);
            var masks = _this._header.compression
                === Helper.GDI.BitmapCompression.BI_BITFIELDS ? 3 : 0;
            if (hdrsize <= Helper.GDI.BITMAPINFOHEADER_SIZE + (masks * 4)) {
                _this._infosize = Helper.GDI.BITMAPINFOHEADER_SIZE + (masks * 4);
            }
            _this._infosize += _this._header.colors() * (usergb ? 4 : 2);
        }
        return _this;
    }
    BitmapInfo.prototype.getWidth = function () {
        return this._header.width;
    };
    BitmapInfo.prototype.getHeight = function () {
        return Math.abs(this._header.height);
    };
    BitmapInfo.prototype.infosize = function () {
        return this._infosize;
    };
    BitmapInfo.prototype.header = function () {
        return this._header;
    };
    return BitmapInfo;
}(BitmapBase));
export { BitmapInfo };
var DIBitmap = /** @class */ (function (_super) {
    __extends(DIBitmap, _super);
    function DIBitmap(reader, bitmapInfo) {
        var _this = _super.call(this) || this;
        _this._reader = reader;
        _this._offset = reader.pos;
        _this._location = bitmapInfo;
        _this._info = new BitmapInfo(reader, true);
        return _this;
    }
    DIBitmap.prototype.getWidth = function () {
        return this._info.getWidth();
    };
    DIBitmap.prototype.getHeight = function () {
        return this._info.getHeight();
    };
    DIBitmap.prototype.totalSize = function () {
        return this._location.header.size + this._location.data.size;
    };
    DIBitmap.prototype.makeBitmapFileHeader = function () {
        var buf = new ArrayBuffer(14);
        var view = new Uint8Array(buf);
        view[0] = 0x42;
        view[1] = 0x4d;
        Helper._writeUint32Val(view, 2, this.totalSize() + 14);
        Helper._writeUint32Val(view, 10, this._info.infosize() + 14);
        return Helper._blobToBinary(view);
    };
    DIBitmap.prototype.base64ref = function () {
        var prevpos = this._reader.pos;
        this._reader.seek(this._offset);
        var mime = "image/bmp";
        var header = this._info.header();
        var data;
        if (header instanceof BitmapInfoHeader && header.compression != null) {
            switch (header.compression) {
                case Helper.GDI.BitmapCompression.BI_JPEG:
                    mime = "data:image/jpeg";
                    break;
                case Helper.GDI.BitmapCompression.BI_PNG:
                    mime = "data:image/png";
                    break;
                default:
                    data = this.makeBitmapFileHeader();
                    break;
            }
        }
        else {
            data = this.makeBitmapFileHeader();
        }
        this._reader.seek(this._location.header.offset);
        if (data != null) {
            data += this._reader.readBinary(this._location.header.size);
        }
        else {
            data = this._reader.readBinary(this._location.header.size);
        }
        this._reader.seek(this._location.data.offset);
        data += this._reader.readBinary(this._location.data.size);
        var ref = "data:" + mime + ";base64," + btoa(data);
        this._reader.seek(prevpos);
        return ref;
    };
    return DIBitmap;
}(BitmapBase));
export { DIBitmap };
//# sourceMappingURL=Bitmap.js.map