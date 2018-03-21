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
import { RTFJSError } from "../../Helper";
import { DestinationBase, DestinationFactory, DestinationTextBase, findParentDestination, } from "./DestinationBase";
var InfoDestination = /** @class */ (function (_super) {
    __extends(InfoDestination, _super);
    function InfoDestination(parser, inst, name) {
        var _this = _super.call(this, name) || this;
        _this._metadata = {};
        _this.inst = inst;
        return _this;
    }
    InfoDestination.prototype.apply = function () {
        for (var prop in this._metadata) {
            this.inst._meta[prop] = this._metadata[prop];
        }
        delete this._metadata;
    };
    InfoDestination.prototype.setMetadata = function (prop, val) {
        this._metadata[prop] = val;
    };
    return InfoDestination;
}(DestinationBase));
export { InfoDestination };
var MetaPropertyDestinationFactory = /** @class */ (function (_super) {
    __extends(MetaPropertyDestinationFactory, _super);
    function MetaPropertyDestinationFactory(metaprop) {
        var _this = _super.call(this) || this;
        _this.class = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1(parser, inst, name) {
                var _this = _super.call(this, name) || this;
                _this.parser = parser;
                return _this;
            }
            class_1.prototype.apply = function () {
                var info = findParentDestination(this.parser, "info");
                if (info == null) {
                    throw new RTFJSError("IDestination " + this._name + " must be within info destination");
                }
                info.setMetadata(metaprop, this.text);
            };
            return class_1;
        }(DestinationTextBase));
        return _this;
    }
    return MetaPropertyDestinationFactory;
}(DestinationFactory));
export { MetaPropertyDestinationFactory };
var MetaPropertyTimeDestinationFactory = /** @class */ (function (_super) {
    __extends(MetaPropertyTimeDestinationFactory, _super);
    function MetaPropertyTimeDestinationFactory(metaprop) {
        var _this = _super.call(this) || this;
        _this.class = /** @class */ (function (_super) {
            __extends(class_2, _super);
            function class_2(parser, inst, name) {
                var _this = _super.call(this, name) || this;
                _this._yr = null;
                _this._mo = null;
                _this._dy = null;
                _this._hr = null;
                _this._min = null;
                _this._sec = null;
                _this.parser = parser;
                return _this;
            }
            class_2.prototype.handleKeyword = function (keyword, param) {
                switch (keyword) {
                    case "yr":
                        this._yr = param;
                        break;
                    case "mo":
                        this._mo = param;
                        break;
                    case "dy":
                        this._dy = param;
                        break;
                    case "hr":
                        this._hr = param;
                        break;
                    case "min":
                        this._min = param;
                        break;
                    case "sec":
                        this._sec = param;
                        break;
                    default:
                        return false;
                }
                if (param == null) {
                    throw new RTFJSError("No param found for keyword " + keyword);
                }
                return true;
            };
            class_2.prototype.apply = function () {
                var info = findParentDestination(this.parser, "info");
                if (info == null) {
                    throw new RTFJSError("IDestination " + this._name + " must be within info destination");
                }
                var date = new Date(Date.UTC(this._yr != null ? this._yr : 1970, this._mo != null ? this._mo : 1, this._dy != null ? this._dy : 1, this._hr != null ? this._hr : 0, this._min != null ? this._min : 0, this._sec != null ? this._sec : 0, 0));
                info.setMetadata(metaprop, date);
            };
            return class_2;
        }(DestinationBase));
        return _this;
    }
    return MetaPropertyTimeDestinationFactory;
}(DestinationFactory));
export { MetaPropertyTimeDestinationFactory };
//# sourceMappingURL=MetaDestinations.js.map