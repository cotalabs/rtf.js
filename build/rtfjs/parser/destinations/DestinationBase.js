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
var DestinationFactory = /** @class */ (function () {
    function DestinationFactory() {
    }
    DestinationFactory.prototype.newDestination = function (parser, inst, name, param) {
        return new this.class(parser, inst, name, param);
    };
    return DestinationFactory;
}());
export { DestinationFactory };
export var findParentDestination = function (parser, dest) {
    var state = parser.state;
    while (state != null) {
        if (state.destination == null) {
            break;
        }
        if (state.destination._name === dest) {
            return state.destination;
        }
        state = state.parent;
    }
    Helper.log("findParentDestination() did not find destination " + dest);
};
var DestinationBase = /** @class */ (function () {
    function DestinationBase(name) {
        this._name = name;
    }
    return DestinationBase;
}());
export { DestinationBase };
var DestinationTextBase = /** @class */ (function () {
    function DestinationTextBase(name) {
        this._name = name;
        this.text = "";
    }
    DestinationTextBase.prototype.appendText = function (text) {
        this.text += text;
    };
    return DestinationTextBase;
}());
export { DestinationTextBase };
var DestinationFormattedTextBase = /** @class */ (function () {
    function DestinationFormattedTextBase(parser, name) {
        this.parser = parser;
        this._name = name;
        this._records = [];
    }
    DestinationFormattedTextBase.prototype.appendText = function (text) {
        this._records.push(function (rtf) {
            rtf.appendText(text);
        });
    };
    DestinationFormattedTextBase.prototype.handleKeyword = function (keyword, param) {
        this._records.push(function (rtf) {
            return rtf.handleKeyword(keyword, param);
        });
    };
    DestinationFormattedTextBase.prototype.apply = function () {
        var rtf = findParentDestination(this.parser, "rtf");
        if (rtf == null) {
            throw new RTFJSError("IDestination " + this._name + " is not child of rtf destination");
        }
        var len = this._records.length;
        var doRender = true;
        if (this.renderBegin != null) {
            doRender = this.renderBegin(rtf, len);
        }
        if (doRender) {
            for (var i = 0; i < len; i++) {
                this._records[i](rtf);
            }
            if (this.renderEnd != null) {
                this.renderEnd(rtf, len);
            }
        }
        delete this._records;
    };
    return DestinationFormattedTextBase;
}());
export { DestinationFormattedTextBase };
var GenericPropertyDestinationFactory = /** @class */ (function (_super) {
    __extends(GenericPropertyDestinationFactory, _super);
    function GenericPropertyDestinationFactory(parentdest, metaprop) {
        var _this = _super.call(this) || this;
        _this.class = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1(parser, inst, name) {
                var _this = _super.call(this, name) || this;
                _this.parser = parser;
                return _this;
            }
            class_1.prototype.apply = function () {
                var dest = findParentDestination(this.parser, parentdest);
                if (dest == null) {
                    throw new RTFJSError("IDestination " + this._name + " must be within "
                        + parentdest + " destination");
                }
                if (dest.setMetadata == null) {
                    throw new RTFJSError("IDestination " + parentdest + " does not accept meta data");
                }
                dest.setMetadata(metaprop, this.text);
            };
            return class_1;
        }(DestinationTextBase));
        return _this;
    }
    return GenericPropertyDestinationFactory;
}(DestinationFactory));
export { GenericPropertyDestinationFactory };
var GenericSubTextPropertyDestinationFactory = /** @class */ (function (_super) {
    __extends(GenericSubTextPropertyDestinationFactory, _super);
    function GenericSubTextPropertyDestinationFactory(name, parentDest, propOrFunc) {
        var _this = _super.call(this) || this;
        _this.class = /** @class */ (function (_super) {
            __extends(class_2, _super);
            function class_2(parser) {
                var _this = _super.call(this, name) || this;
                _this.parser = parser;
                return _this;
            }
            class_2.prototype.apply = function () {
                var dest = findParentDestination(this.parser, parentDest);
                if (dest == null) {
                    throw new RTFJSError(this._name + " destination must be child of " + parentDest + " destination");
                }
                if (dest[propOrFunc] == null) {
                    throw new RTFJSError(this._name + " destination cannot find member + " + propOrFunc
                        + " in " + parentDest + " destination");
                }
                if (dest[propOrFunc] instanceof Function) {
                    dest[propOrFunc](this.text);
                }
                else {
                    dest[propOrFunc] = this.text;
                }
            };
            return class_2;
        }(DestinationTextBase));
        return _this;
    }
    return GenericSubTextPropertyDestinationFactory;
}(DestinationFactory));
export { GenericSubTextPropertyDestinationFactory };
var RequiredDestinationFactory = /** @class */ (function (_super) {
    __extends(RequiredDestinationFactory, _super);
    function RequiredDestinationFactory(name) {
        var _this = _super.call(this) || this;
        _this.class = /** @class */ (function (_super) {
            __extends(class_3, _super);
            function class_3() {
                return _super.call(this, name) || this;
            }
            return class_3;
        }(DestinationBase));
        return _this;
    }
    return RequiredDestinationFactory;
}(DestinationFactory));
export { RequiredDestinationFactory };
//# sourceMappingURL=DestinationBase.js.map