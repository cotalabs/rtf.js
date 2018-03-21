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
// tslint:disable-next-line:variable-name
export var RTFJSError = function (message) {
    this.name = "RTFJSError";
    this.message = message;
    this.stack = (new Error()).stack;
};
RTFJSError.prototype = new Error();
var isLoggingEnabled = true;
export function loggingEnabled(enabled) {
    isLoggingEnabled = enabled;
}
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.log = function (message) {
        if (isLoggingEnabled) {
            // tslint:disable-next-line:no-console
            console.log(message);
        }
    };
    Helper._isalpha = function (str) {
        var len = str.length;
        for (var i = 0; i < len; i++) {
            var ch = str.charCodeAt(i);
            if (!((ch >= this._A && ch <= this._Z) ||
                (ch >= this._a && ch <= this._z))) {
                return false;
            }
        }
        return len > 0;
    };
    Helper._isdigit = function (str) {
        var len = str.length;
        for (var i = 0; i < len; i++) {
            var ch = str.charCodeAt(i);
            if (ch < this._0 || ch > this._9) {
                return false;
            }
        }
        return len > 0;
    };
    Helper._parseHex = function (str) {
        var len = str.length;
        for (var i = 0; i < len; i++) {
            var ch = str.charCodeAt(i);
            if (!((ch >= this._0 && ch <= this._9) ||
                (ch >= this._a && ch <= this._f) ||
                (ch >= this._A && ch <= this._F))) {
                return NaN;
            }
        }
        if (len > 0) {
            return parseInt(str, 16);
        }
        return NaN;
    };
    Helper._blobToBinary = function (blob) {
        var view = new Uint8Array(blob);
        var ret = "";
        var len = view.length;
        for (var i = 0; i < len; i++) {
            ret += String.fromCharCode(view[i]);
        }
        return ret;
    };
    Helper._hexToBlob = function (str) {
        var len = str.length;
        var buf = new ArrayBuffer(Math.floor(len-- / 2));
        var view = new Uint8Array(buf);
        var d = 0;
        for (var i = 0; i < len; i += 2) {
            var val = this._parseHex(str.substr(i, 2));
            if (isNaN(val)) {
                return null;
            }
            view[d++] = val;
        }
        return buf;
    };
    Helper._hexToBinary = function (str) {
        var bin = "";
        var len = str.length - 1;
        for (var i = 0; i < len; i += 2) {
            var val = this._parseHex(str.substr(i, 2));
            if (isNaN(val)) {
                return null;
            }
            bin += String.fromCharCode(val);
        }
        return bin;
    };
    Helper._mapCharset = function (idx) {
        return this._charsetMap[idx.toString()];
    };
    Helper._mapColorTheme = function (name) {
        return this._colorThemeMap[name];
    };
    Helper._colorToStr = function (color) {
        return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    };
    Helper._twipsToPt = function (twips) {
        return Math.floor(twips / 20);
    };
    Helper._twipsToPx = function (twips) {
        return Math.floor(twips / 20 * 96 / 72);
    };
    Helper._pxToTwips = function (px) {
        return Math.floor(px * 20 * 72 / 96);
    };
    Helper.JUSTIFICATION = {
        LEFT: "left",
        CENTER: "center",
        RIGHT: "right",
        JUSTIFY: "justify",
    };
    Helper.BREAKTYPE = {
        NONE: "none",
        COL: "col",
        EVEN: "even",
        ODD: "odd",
        PAGE: "page",
    };
    Helper.PAGENUMBER = {
        DECIMAL: "decimal",
        UROM: "urom",
        LROM: "lrom",
        ULTR: "ultr",
        LLTR: "lltr",
    };
    Helper.UNDERLINE = {
        NONE: "none",
        CONTINUOUS: "continuous",
        DOTTED: "dotted",
        DASHED: "dashed",
        DASHDOTTED: "dashdotted",
        DASHDOTDOTTED: " dashdotdotted",
        DOUBLE: "double",
        HEAVYWAVE: "heavywave",
        LONGDASHED: "longdashed",
        THICK: "thick",
        THICKDOTTED: "thickdotted",
        THICKDASHED: "thickdashed",
        THICKDASHDOTTED: "thickdashdotted",
        THICKDASHDOTDOTTED: "thickdashdotdotted",
        THICKLONGDASH: "thicklongdash",
        DOUBLEWAVE: "doublewave",
        WORD: "word",
        WAVE: "wave",
    };
    Helper.FONTPITCH = {
        DEFAULT: 0,
        FIXED: 1,
        VARIABLE: 2,
    };
    Helper.CHARACTER_TYPE = {
        LOWANSI: "loch",
        HIGHANSI: "hich",
        DOUBLE: "dbch",
    };
    Helper._A = "A".charCodeAt(0);
    Helper._a = "a".charCodeAt(0);
    Helper._F = "F".charCodeAt(0);
    Helper._f = "f".charCodeAt(0);
    Helper._Z = "Z".charCodeAt(0);
    Helper._z = "z".charCodeAt(0);
    Helper._0 = "0".charCodeAt(0);
    Helper._9 = "9".charCodeAt(0);
    Helper._charsetMap = {
        0: 1252,
        77: 10000,
        78: 10001,
        79: 10003,
        80: 10008,
        81: 10002,
        83: 10005,
        84: 10004,
        85: 10006,
        86: 10081,
        87: 10021,
        88: 10029,
        89: 10007,
        128: 932,
        129: 949,
        130: 1361,
        134: 936,
        136: 950,
        161: 1253,
        162: 1254,
        163: 1258,
        177: 1255,
        178: 1256,
        186: 1257,
        204: 1251,
        222: 874,
        238: 1250,
        254: 437,
        255: 850,
    };
    Helper._colorThemeMap = {
        // TODO
        maindarkone: null,
        mainlightone: null,
        maindarktwo: null,
        mainlighttwo: null,
        accentone: null,
        accenttwo: null,
        accentthree: null,
        accentfour: null,
        accentfive: null,
        accentsix: null,
        hyperlink: null,
        followedhyperlink: null,
        backgroundone: null,
        textone: null,
        backgroundtwo: null,
        texttwo: null,
    };
    return Helper;
}());
export { Helper };
//# sourceMappingURL=Helper.js.map