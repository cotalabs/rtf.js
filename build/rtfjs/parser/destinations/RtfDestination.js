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
import { RenderChp } from "../../renderer/RenderChp";
import { RenderPap } from "../../renderer/RenderPap";
import { Chp, Pap, Sep } from "../Containers";
import { DestinationBase } from "./DestinationBase";
var RtfDestination = /** @class */ (function (_super) {
    __extends(RtfDestination, _super);
    function RtfDestination(parser, inst, name, param) {
        var _this = _super.call(this, name) || this;
        _this._charFormatHandlers = {
            ansicpg: function (param) {
                // if the value is 0, use the default charset as 0 is not valid
                if (param > 0) {
                    Helper.log("[rtf] using charset: " + param);
                    _this.parser.codepage = param;
                }
            },
            sectd: function () {
                Helper.log("[rtf] reset to section defaults");
                _this.parser.state.sep = new Sep(null);
            },
            plain: function () {
                Helper.log("[rtf] reset to character defaults");
                _this.parser.state.chp = new Chp(null);
            },
            pard: function () {
                Helper.log("[rtf] reset to paragraph defaults");
                _this.parser.state.pap = new Pap(null);
            },
            b: _this._genericFormatOnOff("chp", "bold"),
            i: _this._genericFormatOnOff("chp", "italic"),
            cf: _this._genericFormatSetValRequired("chp", "colorindex"),
            fs: _this._genericFormatSetValRequired("chp", "fontsize"),
            f: _this._genericFormatSetValRequired("chp", "fontfamily"),
            loch: _this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.LOWANSI),
            hich: _this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.HIGHANSI),
            dbch: _this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.DOUBLE),
            strike: _this._genericFormatOnOff("chp", "strikethrough"),
            striked: _this._genericFormatOnOff("chp", "dblstrikethrough"),
            ul: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.CONTINUOUS, Helper.UNDERLINE.NONE),
            uld: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DOTTED, Helper.UNDERLINE.NONE),
            uldash: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DASHED, Helper.UNDERLINE.NONE),
            uldashd: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DASHDOTTED, Helper.UNDERLINE.NONE),
            uldashdd: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DASHDOTDOTTED, Helper.UNDERLINE.NONE),
            uldb: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DOUBLE, Helper.UNDERLINE.NONE),
            ulhwave: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.HEAVYWAVE, Helper.UNDERLINE.NONE),
            ulldash: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.LONGDASHED, Helper.UNDERLINE.NONE),
            ulnone: _this._genericFormatSetNoParam("chp", "underline", Helper.UNDERLINE.NONE),
            ulth: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICK, Helper.UNDERLINE.NONE),
            ulthd: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDOTTED, Helper.UNDERLINE.NONE),
            ulthdash: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHED, Helper.UNDERLINE.NONE),
            ulthdashd: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHDOTTED, Helper.UNDERLINE.NONE),
            ulthdashdd: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHDOTDOTTED, Helper.UNDERLINE.NONE),
            ululdbwave: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DOUBLEWAVE, Helper.UNDERLINE.NONE),
            ulw: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.WORD, Helper.UNDERLINE.NONE),
            ulwave: _this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.WAVE, Helper.UNDERLINE.NONE),
            li: _this._genericFormatSetMemberVal("pap", "indent", "left", 0),
            ri: _this._genericFormatSetMemberVal("pap", "indent", "right", 0),
            fi: _this._genericFormatSetMemberVal("pap", "indent", "firstline", 0),
            sa: _this._genericFormatSetValRequired("pap", "spaceafter"),
            sb: _this._genericFormatSetValRequired("pap", "spacebefore"),
            cols: _this._genericFormatSetVal("sep", "columns", 0),
            sbknone: _this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.NONE),
            sbkcol: _this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.COL),
            sbkeven: _this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.EVEN),
            sbkodd: _this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.ODD),
            sbkpage: _this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.PAGE),
            pgnx: _this._genericFormatSetMemberVal("sep", "pagenumber", "x", 0),
            pgny: _this._genericFormatSetMemberVal("sep", "pagenumber", "y", 0),
            pgndec: _this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.DECIMAL),
            pgnucrm: _this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.UROM),
            pgnlcrm: _this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.LROM),
            pgnucltr: _this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.ULTR),
            pgnlcltr: _this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.LLTR),
            qc: _this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.CENTER),
            ql: _this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.LEFT),
            qr: _this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.RIGHT),
            qj: _this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.JUSTIFY),
            paperw: _this._genericFormatSetVal("dop", "width", 12240),
            paperh: _this._genericFormatSetVal("dop", "height", 15480),
            margl: _this._genericFormatSetMemberVal("dop", "margin", "left", 1800),
            margr: _this._genericFormatSetMemberVal("dop", "margin", "right", 1800),
            margt: _this._genericFormatSetMemberVal("dop", "margin", "top", 1440),
            margb: _this._genericFormatSetMemberVal("dop", "margin", "bottom", 1440),
            pgnstart: _this._genericFormatSetVal("dop", "pagenumberstart", 1),
            facingp: _this._genericFormatSetNoParam("dop", "facingpages", true),
            landscape: _this._genericFormatSetNoParam("dop", "landscape", true),
            par: _this._addInsHandler(function (renderer) {
                renderer.startPar();
            }),
            line: _this._addInsHandler(function (renderer) {
                renderer.lineBreak();
            }),
        };
        if (parser.version != null) {
            throw new RTFJSError("Unexpected rtf destination");
        }
        // This parameter should be one, but older versions of the spec allow for omission of the version number
        if (param && param !== 1) {
            throw new RTFJSError("Unsupported rtf version");
        }
        parser.version = 1;
        _this._metadata = {};
        _this.parser = parser;
        _this.inst = inst;
        return _this;
    }
    RtfDestination.prototype.addIns = function (func) {
        this.inst.addIns(func);
    };
    RtfDestination.prototype.appendText = function (text) {
        Helper.log("[rtf] output: " + text);
        this.inst.addIns(text);
    };
    RtfDestination.prototype.sub = function () {
        Helper.log("[rtf].sub()");
    };
    RtfDestination.prototype.handleKeyword = function (keyword, param) {
        var handler = this._charFormatHandlers[keyword];
        if (handler != null) {
            handler(param);
            return true;
        }
        return false;
    };
    RtfDestination.prototype.apply = function () {
        Helper.log("[rtf] apply()");
        for (var prop in this._metadata) {
            this.inst._meta[prop] = this._metadata[prop];
        }
        delete this._metadata;
    };
    RtfDestination.prototype.setMetadata = function (prop, val) {
        this._metadata[prop] = val;
    };
    RtfDestination.prototype._addInsHandler = function (func) {
        var _this = this;
        return function (param) {
            _this.inst.addIns(func);
        };
    };
    RtfDestination.prototype._addFormatIns = function (ptype, props) {
        Helper.log("[rtf] update " + ptype);
        switch (ptype) {
            case "chp":
                var rchp_1 = new RenderChp(new Chp(props));
                this.inst.addIns(function (renderer) {
                    renderer.setChp(rchp_1);
                });
                break;
            case "pap":
                var rpap_1 = new RenderPap(new Pap(props));
                this.inst.addIns(function (renderer) {
                    renderer.setPap(rpap_1);
                });
                break;
        }
    };
    RtfDestination.prototype._genericFormatSetNoParam = function (ptype, prop, val) {
        var _this = this;
        return function (param) {
            var props = _this.parser.state[ptype];
            props[prop] = val;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            _this._addFormatIns(ptype, props);
        };
    };
    RtfDestination.prototype._genericFormatOnOff = function (ptype, prop, onval, offval) {
        var _this = this;
        return function (param) {
            var props = _this.parser.state[ptype];
            props[prop] = (param == null || param !== 0)
                ? (onval != null ? onval : true) : (offval != null ? offval : false);
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            _this._addFormatIns(ptype, props);
        };
    };
    RtfDestination.prototype._genericFormatSetVal = function (ptype, prop, defaultval) {
        var _this = this;
        return function (param) {
            var props = _this.parser.state[ptype];
            props[prop] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            _this._addFormatIns(ptype, props);
        };
    };
    RtfDestination.prototype._genericFormatSetValRequired = function (ptype, prop) {
        var _this = this;
        return function (param) {
            if (param == null) {
                throw new RTFJSError("Keyword without required param");
            }
            var props = _this.parser.state[ptype];
            props[prop] = param;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            _this._addFormatIns(ptype, props);
        };
    };
    RtfDestination.prototype._genericFormatSetMemberVal = function (ptype, prop, member, defaultval) {
        var _this = this;
        return function (param) {
            var props = _this.parser.state[ptype];
            var members = props[prop];
            members[member] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + "." + member + " = " + members[member].toString());
            _this._addFormatIns(ptype, props);
        };
    };
    return RtfDestination;
}(DestinationBase));
export { RtfDestination };
//# sourceMappingURL=RtfDestination.js.map