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
import { Blob } from "./Blob";
import { EMFRecords } from "./EMFRecords";
import { GDIContext } from "./GDIContext";
import { EMFJSError, Helper } from "./Helper";
var Renderer = /** @class */ (function () {
    function Renderer(blob) {
        this.parse(blob);
        Helper.log("EMFJS.Renderer instantiated");
    }
    Renderer.prototype.render = function (info) {
        var _this = this;
        var img = $("<div>").svg({
            onLoad: function (svg) {
                return _this._render(svg, info.mapMode, info.wExt, info.hExt, info.xExt, info.yExt);
            },
            settings: {
                viewBox: [0, 0, info.xExt, info.yExt].join(" "),
                preserveAspectRatio: "none",
            },
        });
        var svgContainer = $(img[0]).svg("get");
        return $(svgContainer.root()).attr("width", info.width).attr("height", info.height);
    };
    Renderer.prototype.parse = function (blob) {
        this._img = null;
        var reader = new Blob(blob);
        var type = reader.readUint32();
        if (type !== 0x00000001) {
            throw new EMFJSError("Not an EMF file");
        }
        var size = reader.readUint32();
        if (size % 4 !== 0) {
            throw new EMFJSError("Not an EMF file");
        }
        this._img = new EMF(reader, size);
        if (this._img == null) {
            throw new EMFJSError("Format not recognized");
        }
    };
    Renderer.prototype._render = function (svg, mapMode, w, h, xExt, yExt) {
        var gdi = new GDIContext(svg);
        gdi.setWindowExtEx(w, h);
        gdi.setViewportExtEx(xExt, yExt);
        gdi.setMapMode(mapMode);
        Helper.log("[EMF] BEGIN RENDERING --->");
        this._img.render(gdi);
        Helper.log("[EMF] <--- DONE RENDERING");
    };
    return Renderer;
}());
export { Renderer };
var EMF = /** @class */ (function () {
    function EMF(reader, hdrsize) {
        this._hdrsize = hdrsize;
        this._records = new EMFRecords(reader, this._hdrsize);
    }
    EMF.prototype.render = function (gdi) {
        this._records.play(gdi);
    };
    return EMF;
}());
export { EMF };
//# sourceMappingURL=Renderer.js.map