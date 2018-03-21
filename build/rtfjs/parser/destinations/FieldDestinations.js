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
import { DestinationBase, DestinationFormattedTextBase, DestinationTextBase, findParentDestination, } from "./DestinationBase";
import { PictDestination } from "./PictDestinations";
var FieldDestination = /** @class */ (function (_super) {
    __extends(FieldDestination, _super);
    function FieldDestination() {
        var _this = _super.call(this, "field") || this;
        _this._haveInst = false;
        _this._parsedInst = null; // FieldBase
        _this._result = null;
        return _this;
    }
    FieldDestination.prototype.apply = function () {
        if (!this._haveInst) {
            throw new RTFJSError("IField has no fldinst destination");
        }
        // A fldrslt destination should be included but is not required
        // if (this._result == null)
        //     throw new RTFJSError("IField has no fldrslt destination");
    };
    FieldDestination.prototype.setInst = function (inst) {
        var _this = this;
        this._haveInst = true;
        if (this._parsedInst != null) {
            throw new RTFJSError("IField cannot have multiple fldinst destinations");
        }
        if (inst instanceof Promise) {
            inst.then(function (parsedInst) {
                _this._parsedInst = parsedInst;
            }).catch(function (error) {
                _this._parsedInst = null;
                throw new RTFJSError(error.message);
            });
        }
        else {
            this._parsedInst = inst;
        }
    };
    FieldDestination.prototype.getInst = function () {
        return this._parsedInst;
    };
    FieldDestination.prototype.setResult = function (inst) {
        if (this._result != null) {
            throw new RTFJSError("IField cannot have multiple fldrslt destinations");
        }
        this._result = inst;
    };
    return FieldDestination;
}(DestinationBase));
export { FieldDestination };
var FieldBase = /** @class */ (function () {
    function FieldBase(fldinst) {
        this._fldinst = fldinst;
    }
    FieldBase.prototype.renderFieldEnd = function (field, rtf, records) {
        if (records > 0) {
            rtf.addIns(function (renderer) {
                renderer.popContainer();
            });
        }
    };
    return FieldBase;
}());
export { FieldBase };
var FieldHyperlink = /** @class */ (function (_super) {
    __extends(FieldHyperlink, _super);
    function FieldHyperlink(fldinst, data) {
        var _this = _super.call(this, fldinst) || this;
        _this._url = data;
        return _this;
    }
    FieldHyperlink.prototype.url = function () {
        return this._url;
    };
    FieldHyperlink.prototype.renderFieldBegin = function (field, rtf, records) {
        var self = this;
        if (records > 0) {
            rtf.addIns(function (renderer) {
                var inst = renderer._doc;
                var create = function () {
                    return renderer.buildHyperlinkElement(self._url);
                };
                var container;
                if (inst._settings.onHyperlink != null) {
                    container = inst._settings.onHyperlink(create, {
                        url: function () {
                            return self.url();
                        },
                    });
                }
                else {
                    var elem = create();
                    container = {
                        element: elem,
                        content: elem,
                    };
                }
                renderer.pushContainer(container);
            });
            return true;
        }
        return false;
    };
    return FieldHyperlink;
}(FieldBase));
export { FieldHyperlink };
var FldinstDestination = /** @class */ (function (_super) {
    __extends(FldinstDestination, _super);
    function FldinstDestination(parser, inst) {
        var _this = _super.call(this, "fldinst") || this;
        _this.parser = parser;
        _this.inst = inst;
        return _this;
    }
    FldinstDestination.prototype.apply = function () {
        var field = findParentDestination(this.parser, "field");
        if (field == null) {
            throw new RTFJSError("fldinst destination must be child of field destination");
        }
        field.setInst(this.parseType());
    };
    FldinstDestination.prototype.parseType = function () {
        var _this = this;
        var sep = this.text.indexOf(" ");
        if (sep > 0) {
            var data_1 = this.text.substr(sep + 1);
            if (data_1.length >= 2 && data_1[0] === "\"") {
                var end = data_1.indexOf("\"", 1);
                if (end >= 1) {
                    data_1 = data_1.substring(1, end);
                }
            }
            var fieldType = this.text.substr(0, sep).toUpperCase();
            switch (fieldType) {
                case "HYPERLINK":
                    return new FieldHyperlink(this, data_1);
                case "IMPORT":
                    if (typeof this.inst._settings.onImport === "function") {
                        var pict_1;
                        this.inst.addIns(function (renderer) {
                            var inst = renderer._doc;
                            // backup
                            var hook = inst._settings.onPicture;
                            inst._settings.onPicture = null;
                            // tslint:disable-next-line:prefer-const
                            var _a = pict_1.apply(true), isLegacy = _a.isLegacy, element = _a.element;
                            // restore
                            inst._settings.onPicture = hook;
                            if (typeof hook === "function") {
                                element = hook(isLegacy, function () { return element; });
                            }
                            if (element != null) {
                                renderer.appendElement(element);
                            }
                        });
                        var promise = new Promise(function (resolve, reject) {
                            try {
                                var cb = function (_a) {
                                    var error = _a.error, keyword = _a.keyword, blob = _a.blob, width = _a.width, height = _a.height;
                                    if (!error && typeof keyword === "string" && keyword && blob) {
                                        var dims = {
                                            w: Helper._pxToTwips(width || window.document.body.clientWidth
                                                || window.innerWidth),
                                            h: Helper._pxToTwips(height || 300),
                                        };
                                        pict_1 = new PictDestination(_this.parser, _this.inst);
                                        pict_1.handleBlob(blob);
                                        pict_1.handleKeyword(keyword, 8); // mapMode: 8 => preserve aspect ratio
                                        pict_1._displaysize.width = dims.w;
                                        pict_1._displaysize.height = dims.h;
                                        pict_1._size.width = dims.w;
                                        pict_1._size.height = dims.h;
                                        var _parsedInst = {
                                            renderFieldBegin: function () { return true; },
                                            renderFieldEnd: function () { return null; },
                                        };
                                        resolve(_parsedInst);
                                    }
                                    else {
                                        Helper.log("[fldinst]: failed to IMPORT image file: " + data_1);
                                        if (error) {
                                            error = (error instanceof Error) ? error : new Error(error);
                                            reject(error);
                                        }
                                        else {
                                            resolve(null);
                                        }
                                    }
                                };
                                _this.inst._settings.onImport(data_1, cb);
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                        this.parser._asyncTasks.push(promise);
                        return promise;
                    }
                default:
                    Helper.log("[fldinst]: unknown field type: " + fieldType);
                    break;
            }
        }
    };
    return FldinstDestination;
}(DestinationTextBase));
export { FldinstDestination };
var FldrsltDestination = /** @class */ (function (_super) {
    __extends(FldrsltDestination, _super);
    function FldrsltDestination(parser, inst) {
        return _super.call(this, parser, "fldrslt") || this;
    }
    FldrsltDestination.prototype.apply = function () {
        var field = findParentDestination(this.parser, "field");
        if (field != null) {
            field.setResult(this);
        }
        _super.prototype.apply.call(this);
    };
    FldrsltDestination.prototype.renderBegin = function (rtf, records) {
        var field = findParentDestination(this.parser, "field");
        if (field != null) {
            var inst = field.getInst();
            if (inst != null) {
                return inst.renderFieldBegin(field, rtf, records);
            }
        }
        return false;
    };
    FldrsltDestination.prototype.renderEnd = function (rtf, records) {
        var field = findParentDestination(this.parser, "field");
        if (field != null) {
            var inst = field.getInst();
            if (inst != null) {
                inst.renderFieldEnd(field, rtf, records);
            }
        }
    };
    return FldrsltDestination;
}(DestinationFormattedTextBase));
export { FldrsltDestination };
//# sourceMappingURL=FieldDestinations.js.map