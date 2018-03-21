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
import * as EMFJS from "EMFJS";
import * as WMFJS from "WMFJS";
import { Helper, RTFJSError } from "../../Helper";
import { DestinationFactory, DestinationTextBase, findParentDestination } from "./DestinationBase";
var PictGroupDestinationFactory = /** @class */ (function (_super) {
    __extends(PictGroupDestinationFactory, _super);
    function PictGroupDestinationFactory(legacy) {
        var _this = _super.call(this) || this;
        _this.class = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super.call(this, "pict-group") || this;
                _this._legacy = legacy;
                return _this;
            }
            class_1.prototype.isLegacy = function () {
                return this._legacy;
            };
            return class_1;
        }(DestinationTextBase));
        return _this;
    }
    return PictGroupDestinationFactory;
}(DestinationFactory));
export { PictGroupDestinationFactory };
var PictDestination = /** @class */ (function (_super) {
    __extends(PictDestination, _super);
    function PictDestination(parser, inst) {
        var _this = _super.call(this, "pict") || this;
        _this._pictHandlers = {
            picw: _this._setPropValueRequired("_size", "width"),
            pich: _this._setPropValueRequired("_size", "height"),
            picwgoal: _this._setPropValueRequired("_displaysize", "width"),
            pichgoal: _this._setPropValueRequired("_displaysize", "height"),
        };
        _this._pictTypeHandler = {
            emfblip: (function () {
                if (typeof EMFJS !== "undefined") {
                    return function () {
                        return {
                            load: function () {
                                try {
                                    return new EMFJS.Renderer(_this._blob);
                                }
                                catch (e) {
                                    if (e instanceof EMFJS.Error) {
                                        return e.message;
                                    }
                                    else {
                                        throw e;
                                    }
                                }
                            },
                            render: function (img) {
                                return img.render({
                                    width: Helper._twipsToPt(_this._displaysize.width) + "pt",
                                    height: Helper._twipsToPt(_this._displaysize.height) + "pt",
                                    wExt: _this._size.width,
                                    hExt: _this._size.width,
                                    xExt: _this._size.width,
                                    yExt: _this._size.height,
                                    mapMode: 8,
                                });
                            },
                        };
                    };
                }
                else {
                    return "";
                }
            })(),
            pngblip: "image/png",
            jpegblip: "image/jpeg",
            macpict: "",
            pmmetafile: "",
            wmetafile: (function () {
                if (typeof WMFJS !== "undefined") {
                    return function (param) {
                        if (param == null || param < 0 || param > 8) {
                            throw new RTFJSError("Insufficient metafile information");
                        }
                        return {
                            load: function () {
                                try {
                                    return new WMFJS.Renderer(_this._blob);
                                }
                                catch (e) {
                                    if (e instanceof WMFJS.Error) {
                                        return e.message;
                                    }
                                    else {
                                        throw e;
                                    }
                                }
                            },
                            render: function (img) {
                                return img.render({
                                    width: Helper._twipsToPt(_this._displaysize.width) + "pt",
                                    height: Helper._twipsToPt(_this._displaysize.height) + "pt",
                                    xExt: _this._size.width,
                                    yExt: _this._size.height,
                                    mapMode: param,
                                });
                            },
                        };
                    };
                }
                else {
                    return "";
                }
            })(),
            dibitmap: "",
            wbitmap: "",
        };
        _this._type = null;
        _this._blob = null;
        _this._displaysize = {
            width: null,
            height: null,
        };
        _this._size = {
            width: null,
            height: null,
        };
        _this.parser = parser;
        _this.inst = inst;
        return _this;
    }
    PictDestination.prototype.handleKeyword = function (keyword, param) {
        var handler = this._pictHandlers[keyword];
        if (handler != null) {
            handler(param);
            return true;
        }
        var type = this._pictTypeHandler[keyword];
        if (type != null) {
            if (this._type == null) {
                if (typeof type === "function") {
                    var info_1 = type(param);
                    if (info_1 != null) {
                        this._type = function () {
                            var renderer = info_1.load();
                            if (renderer != null) {
                                if (typeof renderer === "string") {
                                    return renderer;
                                }
                                return function () {
                                    return info_1.render(renderer);
                                };
                            }
                        };
                    }
                }
                else {
                    this._type = type;
                }
            }
            return true;
        }
        return false;
    };
    PictDestination.prototype.handleBlob = function (blob) {
        this._blob = blob;
    };
    PictDestination.prototype.apply = function (rendering) {
        var _this = this;
        if (rendering === void 0) { rendering = false; }
        if (this._type == null) {
            throw new RTFJSError("Picture type unknown or not specified");
        }
        var pictGroup = findParentDestination(this.parser, "pict-group");
        var isLegacy = (pictGroup != null ? pictGroup.isLegacy() : null);
        var type = this._type;
        if (typeof type === "function") {
            // type is the trampoline function that executes the .load function
            // and returns a renderer trampoline that ends up calling the .render function
            if (this._blob == null) {
                this._blob = Helper._hexToBlob(this.text);
                if (this._blob == null) {
                    throw new RTFJSError("Could not parse picture data");
                }
                delete this.text;
            }
            var doRender_1 = function (renderer, render) {
                var inst = renderer._doc;
                var pictrender = type();
                if (pictrender != null) {
                    if (typeof pictrender === "string") {
                        Helper.log("[pict] Could not load image: " + pictrender);
                        if (render) {
                            return renderer.buildPicture(pictrender, null);
                        }
                        else {
                            inst.addIns(function (rendererForPicture) {
                                rendererForPicture.picture(pictrender, null);
                            });
                        }
                    }
                    else {
                        if (typeof pictrender !== "function") {
                            throw new RTFJSError("Expected a picture render function");
                        }
                        if (render) {
                            return renderer.buildRenderedPicture(pictrender());
                        }
                        else {
                            inst.addIns(function (rendererForPicture) {
                                rendererForPicture.renderedPicture(pictrender());
                            });
                        }
                    }
                }
            };
            if (this.inst._settings.onPicture != null) {
                this.inst.addIns(function (renderer) {
                    var inst = _this._doc;
                    var elem = inst._settings.onPicture(isLegacy, function () {
                        return doRender_1(renderer, true);
                    });
                    if (elem != null) {
                        _this.appendElement(elem);
                    }
                });
            }
            else {
                return {
                    isLegacy: isLegacy,
                    element: doRender_1(this.parser.renderer, rendering),
                };
            }
        }
        else if (typeof type === "string") {
            var text_1 = this.text;
            var blob_1 = this._blob;
            var doRender_2 = function (renderer, render) {
                var bin = blob_1 != null ? Helper._blobToBinary(blob_1) : Helper._hexToBinary(text_1);
                if (type !== "") {
                    if (render) {
                        return renderer.buildPicture(type, bin);
                    }
                    else {
                        renderer._doc.addIns(function (rendererForPicture) {
                            rendererForPicture.picture(type, bin);
                        });
                    }
                }
                else {
                    if (render) {
                        return renderer.buildPicture("Unsupported image format", null);
                    }
                    else {
                        renderer._doc.addIns(function (rendererForPicture) {
                            rendererForPicture.picture("Unsupported image format", null);
                        });
                    }
                }
            };
            if (this.inst._settings.onPicture != null) {
                this.inst.addIns(function (renderer) {
                    var inst = _this._doc;
                    var elem = inst._settings.onPicture(isLegacy, function () {
                        return doRender_2(renderer, true);
                    });
                    if (elem != null) {
                        _this.appendElement(elem);
                    }
                });
            }
            else {
                return {
                    isLegacy: isLegacy,
                    element: doRender_2(this.parser.renderer, rendering),
                };
            }
        }
        delete this.text;
    };
    PictDestination.prototype._setPropValueRequired = function (member, prop) {
        var _this = this;
        return function (param) {
            if (param == null) {
                throw new RTFJSError("Picture property has no value");
            }
            Helper.log("[pict] set " + member + "." + prop + " = " + param);
            var obj = (member != null ? _this[member] : _this);
            obj[prop] = param;
        };
    };
    return PictDestination;
}(DestinationTextBase));
export { PictDestination };
//# sourceMappingURL=PictDestinations.js.map