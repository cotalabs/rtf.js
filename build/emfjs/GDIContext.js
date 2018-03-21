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
import { EMFJSError, Helper } from "./Helper";
import { Obj } from "./Primitives";
import { CreateSimpleRegion } from "./Region";
import { Brush, ColorRef, Font, Pen } from "./Style";
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path(svgPath, copy) {
        var _this = _super.call(this, "path") || this;
        if (svgPath != null) {
            _this.svgPath = svgPath;
        }
        else {
            _this.svgPath = copy.svgPath;
        }
        return _this;
    }
    Path.prototype.clone = function () {
        return new Path(null, this.svgPath);
    };
    Path.prototype.toString = function () {
        return "{[path]}";
    };
    return Path;
}(Obj));
export { Path };
function createStockObjects() {
    // Create global stock objects
    var createSolidBrush = function (r, g, b) {
        return new Brush(null, {
            style: Helper.GDI.BrushStyle.BS_SOLID,
            color: new ColorRef(null, r, g, b),
        });
    };
    var createSolidPen = function (r, g, b) {
        return new Pen(null, Helper.GDI.PenStyle.PS_SOLID, 1, new ColorRef(null, r, g, b), null);
    };
    var stockObjs = {
        WHITE_BRUSH: createSolidBrush(255, 255, 255),
        LTGRAY_BRUSH: createSolidBrush(212, 208, 200),
        GRAY_BRUSH: createSolidBrush(128, 128, 128),
        DKGRAY_BRUSH: createSolidBrush(64, 64, 64),
        BLACK_BRUSH: createSolidBrush(0, 0, 0),
        NULL_BRUSH: new Brush(null, {
            style: Helper.GDI.BrushStyle.BS_NULL,
        }),
        WHITE_PEN: createSolidPen(255, 255, 255),
        BLACK_PEN: createSolidPen(0, 0, 0),
        NULL_PEN: new Pen(null, Helper.GDI.PenStyle.PS_NULL, 0, null, null),
        OEM_FIXED_FONT: null,
        ANSI_FIXED_FONT: null,
        ANSI_VAR_FONT: null,
        SYSTEM_FONT: null,
        DEVICE_DEFAULT_FONT: null,
        DEFAULT_PALETTE: null,
        SYSTEM_FIXED_FONT: null,
        DEFAULT_GUI_FONT: null,
    };
    var objs = {};
    for (var t in stockObjs) {
        var stockObjects = Helper.GDI.StockObject;
        var idx = stockObjects[t] - 0x80000000;
        objs[idx.toString()] = stockObjs[t];
    }
    return objs;
}
export var _StockObjects = createStockObjects();
var GDIContextState = /** @class */ (function () {
    function GDIContextState(copy, defObjects) {
        if (copy != null) {
            this._svggroup = copy._svggroup;
            this._svgclipChanged = copy._svgclipChanged;
            this._svgtextbkfilter = copy._svgtextbkfilter;
            this.mapmode = copy.mapmode;
            this.stretchmode = copy.stretchmode;
            this.textalign = copy.textalign;
            this.bkmode = copy.bkmode;
            this.textcolor = copy.textcolor.clone();
            this.bkcolor = copy.bkcolor.clone();
            this.polyfillmode = copy.polyfillmode;
            this.miterlimit = copy.miterlimit;
            this.wx = copy.wx;
            this.wy = copy.wy;
            this.ww = copy.ww;
            this.wh = copy.wh;
            this.vx = copy.vx;
            this.vy = copy.vy;
            this.vw = copy.vw;
            this.vh = copy.vh;
            this.x = copy.x;
            this.y = copy.y;
            this.nextbrx = copy.nextbrx;
            this.nextbry = copy.nextbry;
            this.brx = copy.brx;
            this.bry = copy.bry;
            this.clip = copy.clip;
            this.ownclip = false;
            this.selected = {};
            for (var type in copy.selected) {
                this.selected[type] = copy.selected[type];
            }
        }
        else {
            this._svggroup = null;
            this._svgclipChanged = false;
            this._svgtextbkfilter = null;
            this.mapmode = Helper.GDI.MapMode.MM_ANISOTROPIC;
            this.stretchmode = Helper.GDI.StretchMode.COLORONCOLOR;
            this.textalign = 0; // TA_LEFT | TA_TOP | TA_NOUPDATECP
            this.bkmode = Helper.GDI.MixMode.OPAQUE;
            this.textcolor = new ColorRef(null, 0, 0, 0);
            this.bkcolor = new ColorRef(null, 255, 255, 255);
            this.polyfillmode = Helper.GDI.PolygonFillMode.ALTERNATE;
            this.miterlimit = 10;
            this.wx = 0;
            this.wy = 0;
            this.ww = 0;
            this.wh = 0;
            this.vx = 0;
            this.vy = 0;
            this.vw = 0;
            this.vh = 0;
            this.x = 0;
            this.y = 0;
            this.nextbrx = 0;
            this.nextbry = 0;
            this.brx = 0;
            this.bry = 0;
            this.clip = null;
            this.ownclip = false;
            this.selected = {};
            for (var type in defObjects) {
                var defObj = defObjects[type];
                this.selected[type] = defObj != null ? defObj.clone() : null;
            }
        }
    }
    return GDIContextState;
}());
export { GDIContextState };
var GDIContext = /** @class */ (function () {
    function GDIContext(svg) {
        this._svg = svg;
        this._svgdefs = null;
        this._svgPatterns = {};
        this._svgClipPaths = {};
        this._svgPath = null;
        this.defObjects = {
            brush: new Brush(null, {
                style: Helper.GDI.BrushStyle.BS_SOLID,
                color: new ColorRef(null, 0, 0, 0),
            }),
            pen: new Pen(null, Helper.GDI.PenStyle.PS_SOLID, 1, new ColorRef(null, 0, 0, 0), null),
            font: new Font(null, null),
            palette: null,
            region: null,
        };
        this.state = new GDIContextState(null, this.defObjects);
        this.statestack = [this.state];
        this.objects = {};
    }
    GDIContext.prototype.setMapMode = function (mode) {
        Helper.log("[gdi] setMapMode: mode=" + mode);
        this.state.mapmode = mode;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setWindowOrgEx = function (x, y) {
        Helper.log("[gdi] setWindowOrgEx: x=" + x + " y=" + y);
        this.state.wx = x;
        this.state.wy = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setWindowExtEx = function (x, y) {
        Helper.log("[gdi] setWindowExtEx: x=" + x + " y=" + y);
        this.state.ww = x;
        this.state.wh = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setViewportOrgEx = function (x, y) {
        Helper.log("[gdi] setViewportOrgEx: x=" + x + " y=" + y);
        this.state.vx = x;
        this.state.vy = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setViewportExtEx = function (x, y) {
        Helper.log("[gdi] setViewportExtEx: x=" + x + " y=" + y);
        this.state.vw = x;
        this.state.vh = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setBrushOrgEx = function (origin) {
        Helper.log("[gdi] setBrushOrgEx: x=" + origin.x + " y=" + origin.y);
        this.state.nextbrx = origin.x;
        this.state.nextbry = origin.y;
    };
    GDIContext.prototype.saveDC = function () {
        Helper.log("[gdi] saveDC");
        var prevstate = this.state;
        this.state = new GDIContextState(this.state);
        this.statestack.push(prevstate);
        this.state._svggroup = null;
    };
    GDIContext.prototype.restoreDC = function (saved) {
        Helper.log("[gdi] restoreDC: saved=" + saved);
        if (this.statestack.length > 1) {
            if (saved === -1) {
                this.state = this.statestack.pop();
            }
            else if (saved < -1) {
                throw new EMFJSError("restoreDC: relative restore not implemented");
            }
            else if (saved > 1) {
                throw new EMFJSError("restoreDC: absolute restore not implemented");
            }
        }
        else {
            throw new EMFJSError("No saved contexts");
        }
        this.state._svggroup = null;
    };
    GDIContext.prototype.setStretchBltMode = function (stretchMode) {
        Helper.log("[gdi] setStretchBltMode: stretchMode=" + stretchMode);
    };
    GDIContext.prototype.rectangle = function (rect, rw, rh) {
        Helper.log("[gdi] rectangle: rect=" + rect.toString() + " with pen " + this.state.selected.pen.toString()
            + " and brush " + this.state.selected.brush.toString());
        var bottom = this._todevY(rect.bottom);
        var right = this._todevX(rect.right);
        var top = this._todevY(rect.top);
        var left = this._todevX(rect.left);
        rw = this._todevH(rw);
        rh = this._todevH(rh);
        Helper.log("[gdi] rectangle: TRANSLATED: bottom=" + bottom + " right=" + right + " top=" + top
            + " left=" + left + " rh=" + rh + " rw=" + rw);
        this._pushGroup();
        var opts = this._applyOpts(null, true, true, false);
        this._svg.rect(this.state._svggroup, left, top, right - left, bottom - top, rw / 2, rh / 2, opts);
    };
    GDIContext.prototype.lineTo = function (x, y) {
        Helper.log("[gdi] lineTo: x=" + x + " y=" + y + " with pen " + this.state.selected.pen.toString());
        var toX = this._todevX(x);
        var toY = this._todevY(y);
        var fromX = this._todevX(this.state.x);
        var fromY = this._todevY(this.state.y);
        // Update position
        this.state.x = x;
        this.state.y = y;
        Helper.log("[gdi] lineTo: TRANSLATED: toX=" + toX + " toY=" + toY + " fromX=" + fromX + " fromY=" + fromY);
        this._pushGroup();
        var opts = this._applyOpts(null, true, false, false);
        this._svg.line(this.state._svggroup, fromX, fromY, toX, toY, opts);
    };
    GDIContext.prototype.moveToEx = function (x, y) {
        Helper.log("[gdi] moveToEx: x=" + x + " y=" + y);
        this.state.x = x;
        this.state.y = y;
        if (this._svgPath != null) {
            this._svgPath.move(this.state.x, this.state.y);
            Helper.log("[gdi] new path: " + this._svgPath.path());
        }
    };
    GDIContext.prototype.polygon = function (points, bounds, first) {
        Helper.log("[gdi] polygon: points=" + points + " with pen " + this.state.selected.pen.toString()
            + " and brush " + this.state.selected.brush.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        if (first) {
            this._pushGroup();
        }
        var opts = {
            "fill-rule": this.state.polyfillmode === Helper.GDI.PolygonFillMode.ALTERNATE ? "evenodd" : "nonzero",
        };
        this._applyOpts(opts, true, true, false);
        this._svg.polygon(this.state._svggroup, pts, opts);
    };
    GDIContext.prototype.polyPolygon = function (polygons, bounds) {
        Helper.log("[gdi] polyPolygon: polygons.length=" + polygons.length
            + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var cnt = polygons.length;
        for (var i = 0; i < cnt; i++) {
            this.polygon(polygons[i], bounds, i === 0);
        }
    };
    GDIContext.prototype.polyline = function (isLineTo, points, bounds) {
        Helper.log("[gdi] polyline: isLineTo=" + isLineTo.toString() + ", points=" + points
            + ", bounds=" + bounds.toString() + " with pen " + this.state.selected.pen.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        if (this._svgPath != null) {
            if (!isLineTo || pts.length === 0) {
                this._svgPath.move(this._todevX(this.state.x), this._todevY(this.state.y));
            }
            else {
                var firstPts = pts[0];
                this._svgPath.move(firstPts[0], firstPts[1]);
            }
            this._svgPath.line(pts);
            Helper.log("[gdi] new path: " + this._svgPath.path());
        }
        else {
            this._pushGroup();
            var opts = this._applyOpts(null, true, false, false);
            if (isLineTo && points.length > 0) {
                var firstPt = points[0];
                if (firstPt.x !== this.state.x || firstPt.y !== this.state.y) {
                    pts.unshift([this._todevX(this.state.x), this._todevY(this.state.y)]);
                }
            }
            this._svg.polyline(this.state._svggroup, pts, opts);
        }
        if (points.length > 0) {
            var lastPt = points[points.length - 1];
            this.state.x = lastPt.x;
            this.state.y = lastPt.y;
        }
    };
    GDIContext.prototype.polybezier = function (isPolyBezierTo, points, bounds) {
        Helper.log("[gdi] polybezier: isPolyBezierTo=" + isPolyBezierTo.toString() + ", points=" + points
            + ", bounds=" + bounds.toString() + " with pen " + this.state.selected.pen.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push({ x: this._todevX(point.x), y: this._todevY(point.y) });
        }
        if (this._svgPath != null) {
            if (isPolyBezierTo && pts.length > 0) {
                var firstPts = pts[0];
                this._svgPath.move(firstPts.x, firstPts.y);
            }
            else {
                this._svgPath.move(this._todevX(this.state.x), this._todevY(this.state.y));
            }
            if (pts.length < (isPolyBezierTo ? 3 : 4)) {
                throw new EMFJSError("Not enough points to draw bezier");
            }
            for (var i = isPolyBezierTo ? 1 : 0; i + 3 <= pts.length; i += 3) {
                var cp1 = pts[i];
                var cp2 = pts[i + 1];
                var ep = pts[i + 2];
                this._svgPath.curveC(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);
            }
            Helper.log("[gdi] new path: " + this._svgPath.path());
        }
        else {
            throw new EMFJSError("polybezier not implemented (not a path)");
        }
        if (points.length > 0) {
            var lastPt = points[points.length - 1];
            this.state.x = lastPt.x;
            this.state.y = lastPt.y;
        }
    };
    GDIContext.prototype.selectClipPath = function (rgnMode) {
        Helper.log("[gdi] selectClipPath: rgnMode=0x" + rgnMode.toString(16));
    };
    GDIContext.prototype.selectClipRgn = function (rgnMode, region) {
        Helper.log("[gdi] selectClipRgn: rgnMode=0x" + rgnMode.toString(16));
        if (rgnMode === Helper.GDI.RegionMode.RGN_COPY) {
            this.state.selected.region = region;
            this.state.clip = null;
            this.state.ownclip = false;
        }
        else {
            if (region == null) {
                throw new EMFJSError("No clip region to select");
            }
            throw new EMFJSError("Not implemented: rgnMode=0x" + rgnMode.toString(16));
        }
        this.state._svgclipChanged = true;
    };
    GDIContext.prototype.offsetClipRgn = function (offset) {
        Helper.log("[gdi] offsetClipRgn: offset=" + offset.toString());
        this._getClipRgn().offset(offset.x, offset.y);
    };
    GDIContext.prototype.setTextAlign = function (textAlignmentMode) {
        Helper.log("[gdi] setTextAlign: textAlignmentMode=0x" + textAlignmentMode.toString(16));
        this.state.textalign = textAlignmentMode;
    };
    GDIContext.prototype.setMiterLimit = function (miterLimit) {
        Helper.log("[gdi] setMiterLimit: miterLimit=" + miterLimit);
        this.state.miterlimit = miterLimit;
    };
    GDIContext.prototype.setBkMode = function (bkMode) {
        Helper.log("[gdi] setBkMode: bkMode=0x" + bkMode.toString(16));
        this.state.bkmode = bkMode;
    };
    GDIContext.prototype.setBkColor = function (bkColor) {
        Helper.log("[gdi] setBkColor: bkColor=" + bkColor.toString());
        this.state.bkcolor = bkColor;
        this.state._svgtextbkfilter = null;
    };
    GDIContext.prototype.setPolyFillMode = function (polyFillMode) {
        Helper.log("[gdi] setPolyFillMode: polyFillMode=" + polyFillMode);
        this.state.polyfillmode = polyFillMode;
    };
    GDIContext.prototype.createBrush = function (index, brush) {
        var idx = this._storeObject(brush, index);
        Helper.log("[gdi] createBrush: brush=" + brush.toString() + " with handle " + idx);
    };
    GDIContext.prototype.createPen = function (index, pen) {
        var idx = this._storeObject(pen, index);
        Helper.log("[gdi] createPen: pen=" + pen.toString() + " width handle " + idx);
    };
    GDIContext.prototype.createPenEx = function (index, pen) {
        var idx = this._storeObject(pen, index);
        Helper.log("[gdi] createPenEx: pen=" + pen.toString() + " width handle " + idx);
    };
    GDIContext.prototype.selectObject = function (objIdx, checkType) {
        var obj = this._getObject(objIdx);
        if (obj != null && (checkType == null || obj.type === checkType)) {
            this._selectObject(obj);
            Helper.log("[gdi] selectObject: objIdx=" + objIdx
                + (obj ? " selected " + obj.type + ": " + obj.toString() : "[invalid index]"));
        }
        else {
            Helper.log("[gdi] selectObject: objIdx=" + objIdx
                + (obj ? " invalid object type: " + obj.type : "[invalid index]"));
        }
    };
    GDIContext.prototype.abortPath = function () {
        Helper.log("[gdi] abortPath");
        if (this._svgPath != null) {
            this._svgPath = null;
        }
    };
    GDIContext.prototype.beginPath = function () {
        Helper.log("[gdi] beginPath");
        if (this._svgPath != null) {
            this._svgPath = null;
        }
        this._svgPath = this._svg.createPath();
    };
    GDIContext.prototype.closeFigure = function () {
        Helper.log("[gdi] closeFigure");
        if (this._svgPath == null) {
            throw new EMFJSError("No path bracket: cannot close figure");
        }
        this._svgPath.close();
    };
    GDIContext.prototype.fillPath = function (bounds) {
        Helper.log("[gdi] fillPath");
        if (this.state.selected.path == null) {
            throw new EMFJSError("No path selected");
        }
        var selPath = this.state.selected.path;
        var opts = this._applyOpts(null, true, true, false);
        this._svg.path(this.state._svggroup, selPath.svgPath, opts);
        this._pushGroup();
        this.state.selected.path = null;
    };
    GDIContext.prototype.strokePath = function (bounds) {
        Helper.log("[gdi] strokePath");
        if (this.state.selected.path == null) {
            throw new EMFJSError("No path selected");
        }
        var selPath = this.state.selected.path;
        var opts = this._applyOpts({ fill: "none" }, true, false, false);
        this._svg.path(this.state._svggroup, selPath.svgPath, opts);
        this._pushGroup();
        this.state.selected.path = null;
    };
    GDIContext.prototype.endPath = function () {
        Helper.log("[gdi] endPath");
        if (this._svgPath == null) {
            throw new EMFJSError("No path bracket: cannot end path");
        }
        this._pushGroup();
        this._selectObject(new Path(this._svgPath));
        this._svgPath = null;
    };
    GDIContext.prototype.deleteObject = function (objIdx) {
        var ret = this._deleteObject(objIdx);
        Helper.log("[gdi] deleteObject: objIdx=" + objIdx + (ret ? " deleted object" : "[invalid index]"));
    };
    GDIContext.prototype._pushGroup = function () {
        if (this.state._svggroup == null || this.state._svgclipChanged) {
            this.state._svgclipChanged = false;
            this.state._svgtextbkfilter = null;
            var settings = {
                viewBox: [this.state.vx, this.state.vy, this.state.vw, this.state.vh].join(" "),
                preserveAspectRatio: "none",
            };
            if (this.state.clip != null) {
                Helper.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw
                    + " height=" + this.state.vh + " with clipping");
                settings["clip-path"] = "url(#" + this._getSvgClipPathForRegion(this.state.clip) + ")";
            }
            else {
                Helper.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw
                    + " height=" + this.state.vh + " without clipping");
            }
            this.state._svggroup = this._svg.svg(this.state._svggroup, this.state.vx, this.state.vy, this.state.vw, this.state.vh, settings);
        }
    };
    GDIContext.prototype._getStockObject = function (idx) {
        if (idx >= 0x80000000 && idx <= 0x80000011) {
            return _StockObjects[(idx - 0x80000000).toString()];
        }
        else if (idx === Helper.GDI.StockObject.DC_BRUSH) {
            return this.state.selected.brush;
        }
        else if (idx === Helper.GDI.StockObject.DC_PEN) {
            return this.state.selected.pen;
        }
        return null;
    };
    GDIContext.prototype._storeObject = function (obj, idx) {
        if (!idx) {
            idx = 0;
            while (this.objects[idx.toString()] != null && idx <= 65535) {
                idx++;
            }
            if (idx > 65535) {
                Helper.log("[gdi] Too many objects!");
                return -1;
            }
        }
        this.objects[idx.toString()] = obj;
        return idx;
    };
    GDIContext.prototype._getObject = function (objIdx) {
        var obj = this.objects[objIdx.toString()];
        if (obj == null) {
            obj = this._getStockObject(objIdx);
            if (obj == null) {
                Helper.log("[gdi] No object with handle " + objIdx);
            }
        }
        return obj;
    };
    GDIContext.prototype._getSvgDef = function () {
        if (this._svgdefs == null) {
            this._svgdefs = this._svg.defs();
        }
        return this._svgdefs;
    };
    GDIContext.prototype._getSvgClipPathForRegion = function (region) {
        for (var existingId in this._svgClipPaths) {
            var rgn = this._svgClipPaths[existingId];
            if (rgn === region) {
                return existingId;
            }
        }
        var id = Helper._makeUniqueId("c");
        var sclip = this._svg.clipPath(this._getSvgDef(), id, "userSpaceOnUse");
        switch (region.complexity) {
            case 1:
                this._svg.rect(sclip, this._todevX(region.bounds.left), this._todevY(region.bounds.top), this._todevW(region.bounds.right - region.bounds.left), this._todevH(region.bounds.bottom - region.bounds.top), { fill: "black", strokeWidth: 0 });
                break;
            case 2:
                for (var i = 0; i < region.scans.length; i++) {
                    var scan = region.scans[i];
                    for (var j = 0; j < scan.scanlines.length; j++) {
                        var scanline = scan.scanlines[j];
                        this._svg.rect(sclip, this._todevX(scanline.left), this._todevY(scan.top), this._todevW(scanline.right - scanline.left), this._todevH(scan.bottom - scan.top), { fill: "black", strokeWidth: 0 });
                    }
                }
                break;
        }
        this._svgClipPaths[id] = region;
        return id;
    };
    GDIContext.prototype._getSvgPatternForBrush = function (brush) {
        for (var existingId in this._svgPatterns) {
            var pat = this._svgPatterns[existingId];
            if (pat === brush) {
                return existingId;
            }
        }
        var width;
        var height;
        var img;
        switch (brush.style) {
            case Helper.GDI.BrushStyle.BS_PATTERN:
                width = brush.pattern.getWidth();
                height = brush.pattern.getHeight();
                break;
            case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                width = brush.dibpatternpt.getWidth();
                height = brush.dibpatternpt.getHeight();
                img = brush.dibpatternpt.base64ref();
                break;
            default:
                throw new EMFJSError("Invalid brush style");
        }
        var id = Helper._makeUniqueId("p");
        var spat = this._svg.pattern(this._getSvgDef(), id, this.state.brx, this.state.bry, width, height, { patternUnits: "userSpaceOnUse" });
        this._svg.image(spat, 0, 0, width, height, img);
        this._svgPatterns[id] = brush;
        return id;
    };
    GDIContext.prototype._selectObject = function (obj) {
        this.state.selected[obj.type] = obj;
        switch (obj.type) {
            case "region":
                this.state._svgclipChanged = true;
                break;
            case "brush":
                this.state.brx = this.state.nextbrx;
                this.state.bry = this.state.nextbry;
                break;
        }
    };
    GDIContext.prototype._deleteObject = function (objIdx) {
        var obj = this.objects[objIdx.toString()];
        if (obj != null) {
            for (var i = 0; i < this.statestack.length; i++) {
                var state = this.statestack[i];
                if (state.selected[obj.type] === obj) {
                    state.selected[obj.type] = this.defObjects[obj.type].clone();
                }
            }
            delete this.objects[objIdx.toString()];
            return true;
        }
        Helper.log("[gdi] Cannot delete object with invalid handle " + objIdx);
        return false;
    };
    GDIContext.prototype._getClipRgn = function () {
        if (this.state.clip != null) {
            if (!this.state.ownclip) {
                this.state.clip = this.state.clip.clone();
            }
        }
        else {
            if (this.state.selected.region != null) {
                this.state.clip = this.state.selected.region.clone();
            }
            else {
                this.state.clip = CreateSimpleRegion(this.state.wx, this.state.wy, this.state.wx + this.state.ww, this.state.wy + this.state.wh);
            }
        }
        this.state.ownclip = true;
        return this.state.clip;
    };
    GDIContext.prototype._todevX = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.wx) * (this.state.vw / this.state.ww)) + this.state.vx;
    };
    GDIContext.prototype._todevY = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.wy) * (this.state.vh / this.state.wh)) + this.state.vy;
    };
    GDIContext.prototype._todevW = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val * (this.state.vw / this.state.ww)) + this.state.vx;
    };
    GDIContext.prototype._todevH = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val * (this.state.vh / this.state.wh)) + this.state.vy;
    };
    GDIContext.prototype._tologicalX = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.vx) / (this.state.vw / this.state.ww)) + this.state.wx;
    };
    GDIContext.prototype._tologicalY = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.vy) / (this.state.vh / this.state.wh)) + this.state.wy;
    };
    GDIContext.prototype._tologicalW = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val / (this.state.vw / this.state.ww)) + this.state.wx;
    };
    GDIContext.prototype._tologicalH = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val / (this.state.vh / this.state.wh)) + this.state.wy;
    };
    GDIContext.prototype._applyOpts = function (opts, usePen, useBrush, useFont) {
        if (opts == null) {
            opts = {};
        }
        if (usePen) {
            var pen = this.state.selected.pen;
            if (pen.style !== Helper.GDI.PenStyle.PS_NULL) {
                opts.stroke = "#" + pen.color.toHex(); // TODO: pen style
                opts.strokeWidth = pen.width;
                opts["stroke-miterlimit"] = this.state.miterlimit;
                var dotWidth = void 0;
                opts["stroke-linecap"] = "round";
                dotWidth = 1;
                opts["stroke-linejoin"] = "round";
                var dashWidth = opts.strokeWidth * 4;
                var dotSpacing = opts.strokeWidth * 2;
                switch (pen.style) {
                    case Helper.GDI.PenStyle.PS_DASH:
                        opts["stroke-dasharray"] = [dashWidth, dotSpacing].toString();
                        break;
                    case Helper.GDI.PenStyle.PS_DOT:
                        opts["stroke-dasharray"] = [dotWidth, dotSpacing].toString();
                        break;
                    case Helper.GDI.PenStyle.PS_DASHDOT:
                        opts["stroke-dasharray"] = [dashWidth, dotSpacing, dotWidth, dotSpacing].toString();
                        break;
                    case Helper.GDI.PenStyle.PS_DASHDOTDOT:
                        opts["stroke-dasharray"] =
                            [dashWidth, dotSpacing, dotWidth, dotSpacing, dotWidth, dotSpacing].toString();
                        break;
                }
            }
        }
        if (useBrush) {
            var brush = this.state.selected.brush;
            switch (brush.style) {
                case Helper.GDI.BrushStyle.BS_SOLID:
                    opts.fill = "#" + brush.color.toHex();
                    break;
                case Helper.GDI.BrushStyle.BS_PATTERN:
                case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                    opts.fill = "url(#" + this._getSvgPatternForBrush(brush) + ")";
                    break;
                case Helper.GDI.BrushStyle.BS_NULL:
                    opts.fill = "none";
                    break;
                default:
                    Helper.log("[gdi] unsupported brush style: " + brush.style);
                    opts.fill = "none";
                    break;
            }
        }
        if (useFont) {
            var font = this.state.selected.font;
            opts["font-family"] = font.facename;
            opts["font-size"] = Math.abs(font.height);
            opts.fill = "#" + this.state.textcolor.toHex();
        }
        return opts;
    };
    return GDIContext;
}());
export { GDIContext };
//# sourceMappingURL=GDIContext.js.map