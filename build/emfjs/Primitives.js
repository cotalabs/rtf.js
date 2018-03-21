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
import { EMFJSError } from "./Helper";
var PointS = /** @class */ (function () {
    function PointS(reader, x, y) {
        if (reader != null) {
            this.x = reader.readInt16();
            this.y = reader.readInt16();
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    PointS.prototype.clone = function () {
        return new PointS(null, this.x, this.y);
    };
    PointS.prototype.toString = function () {
        return "{x: " + this.x + ", y: " + this.y + "}";
    };
    return PointS;
}());
export { PointS };
var PointL = /** @class */ (function () {
    function PointL(reader, x, y) {
        if (reader != null) {
            this.x = reader.readInt32();
            this.y = reader.readInt32();
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    PointL.prototype.clone = function () {
        return new PointL(null, this.x, this.y);
    };
    PointL.prototype.toString = function () {
        return "{x: " + this.x + ", y: " + this.y + "}";
    };
    return PointL;
}());
export { PointL };
var RectL = /** @class */ (function () {
    function RectL(reader, left, top, right, bottom) {
        if (reader != null) {
            this.left = reader.readInt32();
            this.top = reader.readInt32();
            this.right = reader.readInt32();
            this.bottom = reader.readInt32();
        }
        else {
            this.bottom = bottom;
            this.right = right;
            this.top = top;
            this.left = left;
        }
    }
    RectL.prototype.clone = function () {
        return new RectL(null, this.left, this.top, this.right, this.bottom);
    };
    RectL.prototype.toString = function () {
        return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right
            + ", bottom: " + this.bottom + "}";
    };
    RectL.prototype.empty = function () {
        return this.left >= this.right || this.top >= this.bottom;
    };
    RectL.prototype.intersect = function (rectL) {
        if (this.empty() || rectL.empty()) {
            return null;
        }
        if (this.left >= rectL.right || this.top >= rectL.bottom ||
            this.right <= rectL.left || this.bottom <= rectL.top) {
            return null;
        }
        return new RectL(null, Math.max(this.left, rectL.left), Math.max(this.top, rectL.top), Math.min(this.right, rectL.right), Math.min(this.bottom, rectL.bottom));
    };
    return RectL;
}());
export { RectL };
var SizeL = /** @class */ (function () {
    function SizeL(reader, cx, cy) {
        if (reader != null) {
            this.cx = reader.readUint32();
            this.cy = reader.readUint32();
        }
        else {
            this.cx = cx;
            this.cy = cy;
        }
    }
    SizeL.prototype.clone = function () {
        return new SizeL(null, this.cx, this.cy);
    };
    SizeL.prototype.toString = function () {
        return "{cx: " + this.cx + ", cy: " + this.cy + "}";
    };
    return SizeL;
}());
export { SizeL };
var Obj = /** @class */ (function () {
    function Obj(type) {
        this.type = type;
    }
    Obj.prototype.clone = function () {
        throw new EMFJSError("clone not implemented");
    };
    Obj.prototype.toString = function () {
        throw new EMFJSError("toString not implemented");
    };
    return Obj;
}());
export { Obj };
//# sourceMappingURL=Primitives.js.map