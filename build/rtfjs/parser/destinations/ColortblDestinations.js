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
var ColortblDestination = /** @class */ (function (_super) {
    __extends(ColortblDestination, _super);
    function ColortblDestination(parser, inst) {
        var _this = _super.call(this, "colortbl") || this;
        _this._colors = [];
        _this._current = null;
        _this._autoIndex = null;
        _this.inst = inst;
        return _this;
    }
    ColortblDestination.prototype.appendText = function (text) {
        var len = text.length;
        for (var i = 0; i < len; i++) {
            if (text[i] !== ";") {
                throw new RTFJSError("Error parsing colortbl destination");
            }
            if (this._current == null) {
                if (this._autoIndex != null) {
                    throw new RTFJSError("colortbl cannot define more than one auto color");
                }
                this._autoIndex = this._colors.length;
                this._startNewColor();
            }
            else {
                if (this._current.tint < 255 && this._current.shade < 255) {
                    throw new RTFJSError("colortbl cannot define shade and tint at the same time");
                }
            }
            this._colors.push(this._current);
            this._current = null;
        }
    };
    ColortblDestination.prototype.handleKeyword = function (keyword, param) {
        if (this._current == null) {
            this._startNewColor();
        }
        switch (keyword) {
            case "red":
                this._current.r = this._validateColorValueRange(keyword, param);
                return true;
            case "green":
                this._current.g = this._validateColorValueRange(keyword, param);
                return true;
            case "blue":
                this._current.b = this._validateColorValueRange(keyword, param);
                return true;
            case "ctint":
                this._current.tint = this._validateColorValueRange(keyword, param);
                return true;
            case "cshade":
                this._current.shade = this._validateColorValueRange(keyword, param);
                return true;
            default:
                if (keyword[0] === "c") {
                    this._current.theme = Helper._mapColorTheme(keyword.slice(1));
                    return true;
                }
                break;
        }
        Helper.log("[colortbl] handleKeyword(): unhandled keyword: " + keyword);
        return false;
    };
    ColortblDestination.prototype.apply = function () {
        Helper.log("[colortbl] apply()");
        if (this._autoIndex == null) {
            this._autoIndex = 0;
        }
        if (this._autoIndex >= this._colors.length) {
            throw new RTFJSError("colortbl doesn't define auto color");
        }
        for (var idx in this._colors) {
            Helper.log("[colortbl] [" + idx + "] = "
                + this._colors[idx].r + "," + this._colors[idx].g + "," + this._colors[idx].b
                + " theme: " + this._colors[idx].theme);
        }
        this.inst._colors = this._colors;
        this.inst._autoColor = this._autoIndex;
        delete this._colors;
    };
    ColortblDestination.prototype._startNewColor = function () {
        this._current = {
            r: 0,
            g: 0,
            b: 0,
            tint: 255,
            shade: 255,
            theme: null,
        };
        return this._current;
    };
    ColortblDestination.prototype._validateColorValueRange = function (keyword, param) {
        if (param == null) {
            throw new RTFJSError(keyword + " has no param");
        }
        if (param < 0 || param > 255) {
            throw new RTFJSError(keyword + " has invalid param value");
        }
        return param;
    };
    return ColortblDestination;
}(DestinationBase));
export { ColortblDestination };
//# sourceMappingURL=ColortblDestinations.js.map