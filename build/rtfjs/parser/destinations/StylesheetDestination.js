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
import { Helper } from "../../Helper";
import { DestinationBase } from "./DestinationBase";
var StylesheetDestinationSub = /** @class */ (function (_super) {
    __extends(StylesheetDestinationSub, _super);
    function StylesheetDestinationSub(stylesheet) {
        var _this = _super.call(this, "stylesheet:sub") || this;
        _this._stylesheet = stylesheet;
        _this.index = 0;
        _this.name = null;
        _this.handler = _this._handleKeywordCommon("paragraph");
        return _this;
    }
    StylesheetDestinationSub.prototype.handleKeyword = function (keyword, param) {
        switch (keyword) {
            case "s":
                this.index = param;
                return true;
            case "cs":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("character");
                this.index = param;
                return true;
            case "ds":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("section");
                this.index = param;
                return true;
            case "ts":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("table");
                this.index = param;
                return true;
        }
        return this.handler(keyword, param);
    };
    StylesheetDestinationSub.prototype.appendText = function (text) {
        if (this.name == null) {
            this.name = text;
        }
        else {
            this.name += text;
        }
    };
    StylesheetDestinationSub.prototype.apply = function () {
        this._stylesheet.addSub({
            index: this.index,
            name: this.name,
        });
        delete this._stylesheet;
    };
    StylesheetDestinationSub.prototype._handleKeywordCommon = function (member) {
        return function (keyword, param) {
            Helper.log("[stylesheet:sub]." + member + ": unhandled keyword: " + keyword + " param: " + param);
            return false;
        };
    };
    return StylesheetDestinationSub;
}(DestinationBase));
export { StylesheetDestinationSub };
var StylesheetDestination = /** @class */ (function (_super) {
    __extends(StylesheetDestination, _super);
    function StylesheetDestination(parser, inst) {
        var _this = _super.call(this, "stylesheet") || this;
        _this._stylesheets = [];
        _this.inst = inst;
        return _this;
    }
    StylesheetDestination.prototype.sub = function () {
        return new StylesheetDestinationSub(this);
    };
    StylesheetDestination.prototype.apply = function () {
        Helper.log("[stylesheet] apply()");
        for (var idx in this._stylesheets) {
            Helper.log("[stylesheet] [" + idx + "] name: " + this._stylesheets[idx].name);
        }
        this.inst._stylesheets = this._stylesheets;
        delete this._stylesheets;
    };
    StylesheetDestination.prototype.addSub = function (sub) {
        // Some documents will redefine stylesheets
        // if (this._stylesheets[sub.index] != null)
        //     throw new RTFJSError("Cannot redefine stylesheet with index " + sub.index);
        this._stylesheets[sub.index] = sub;
    };
    return StylesheetDestination;
}(DestinationBase));
export { StylesheetDestination };
//# sourceMappingURL=StylesheetDestination.js.map