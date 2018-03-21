/*

The MIT License (MIT)

Copyright (c) 2015 Thomas Bluemel

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
import { Helper, RTFJSError } from "../../Helper";
import { DestinationBase } from "./DestinationBase";
var FonttblDestinationSub = /** @class */ (function (_super) {
    __extends(FonttblDestinationSub, _super);
    function FonttblDestinationSub(fonttbl) {
        var _this = _super.call(this, "fonttbl:sub") || this;
        _this._fonttbl = fonttbl;
        _this.index = null;
        _this.fontname = null;
        _this.altfontname = null;
        _this.family = null;
        _this.pitch = Helper.FONTPITCH.DEFAULT;
        _this.bias = 0;
        _this.charset = null;
        return _this;
    }
    FonttblDestinationSub.prototype.handleKeyword = function (keyword, param) {
        switch (keyword) {
            case "f":
                this.index = param;
                return true;
            case "fnil":
                return true;
            case "froman":
            case "fswiss":
            case "fmodern":
            case "fscript":
            case "fdecor":
            case "ftech":
            case "fbidi":
            case "flomajor":
            case "fhimajor":
            case "fdbmajor":
            case "fbimajor":
            case "flominor":
            case "fhiminor":
            case "fdbminor":
            case "fbiminor":
                this.family = keyword.slice(1);
                return true;
            case "fprq":
                switch (param) {
                    case 0:
                        this.pitch = Helper.FONTPITCH.DEFAULT;
                        break;
                    case 1:
                        this.pitch = Helper.FONTPITCH.FIXED;
                        break;
                    case 2:
                        this.pitch = Helper.FONTPITCH.VARIABLE;
                        break;
                }
                return true;
            case "fbias":
                if (param != null) {
                    this.bias = param;
                }
                return true;
            case "fcharset":
                if (param != null) {
                    this.charset = Helper._mapCharset(param);
                    if (this.charset == null) {
                        Helper.log("Unknown font charset: " + param);
                    }
                }
                return true;
            case "cpg":
                if (param != null) {
                    this.charset = param;
                }
                return true;
        }
        return false;
    };
    FonttblDestinationSub.prototype.appendText = function (text) {
        if (this.fontname == null) {
            this.fontname = text;
        }
        else {
            this.fontname += text;
        }
    };
    FonttblDestinationSub.prototype.apply = function () {
        if (this.index == null) {
            throw new RTFJSError("No font index provided");
        }
        if (this.fontname == null) {
            throw new RTFJSError("No font name provided");
        }
        this._fonttbl.addSub(this);
        delete this._fonttbl;
    };
    FonttblDestinationSub.prototype.setAltFontName = function (name) {
        this.altfontname = name;
    };
    return FonttblDestinationSub;
}(DestinationBase));
export { FonttblDestinationSub };
var FonttblDestination = /** @class */ (function (_super) {
    __extends(FonttblDestination, _super);
    function FonttblDestination(parser, inst) {
        var _this = _super.call(this, "fonttbl") || this;
        _this._fonts = [];
        _this._sub = null;
        _this.inst = inst;
        return _this;
    }
    FonttblDestination.prototype.sub = function () {
        return new FonttblDestinationSub(this);
    };
    FonttblDestination.prototype.apply = function () {
        Helper.log("[fonttbl] apply()");
        for (var idx in this._fonts) {
            Helper.log("[fonttbl][" + idx + "] index = " + this._fonts[idx].fontname
                + " alternative: " + this._fonts[idx].altfontname);
        }
        this.inst._fonts = this._fonts;
        delete this._fonts;
    };
    FonttblDestination.prototype.appendText = function (text) {
        this._sub.appendText(text);
        this._sub.apply();
    };
    FonttblDestination.prototype.handleKeyword = function (keyword, param) {
        if (keyword === "f") {
            this._sub = this.sub();
        }
        this._sub.handleKeyword(keyword, param);
    };
    FonttblDestination.prototype.addSub = function (sub) {
        this._fonts[sub.index] = sub;
    };
    return FonttblDestination;
}(DestinationBase));
export { FonttblDestination };
//# sourceMappingURL=FonttblDestinations.js.map