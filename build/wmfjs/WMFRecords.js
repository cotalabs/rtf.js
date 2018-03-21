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
import { DIBitmap, PatternBitmap16 } from "./Bitmap";
import { Blob } from "./Blob";
import { Helper, WMFJSError } from "./Helper";
import { PointS, Rect } from "./Primitives";
import { Region } from "./Region";
import { Brush, ColorRef, Font, Palette, Pen } from "./Style";
var WMFRecords = /** @class */ (function () {
    function WMFRecords(reader, first) {
        this._records = [];
        var all = false;
        var curpos = first;
        var _loop_1 = function () {
            reader.seek(curpos);
            var size = reader.readUint32();
            if (size < 3) {
                throw new WMFJSError("Invalid record size");
            }
            var type = reader.readUint16();
            switch (type) {
                case Helper.GDI.RecordType.META_EOF:
                    all = true;
                    return "break-main_loop";
                case Helper.GDI.RecordType.META_SETMAPMODE: {
                    var mapMode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setMapMode(mapMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETWINDOWORG: {
                    var y_1 = reader.readInt16();
                    var x_1 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowOrg(x_1, y_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETWINDOWEXT: {
                    var y_2 = reader.readInt16();
                    var x_2 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowExt(x_2, y_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_OFFSETWINDOWORG: {
                    var offY_1 = reader.readInt16();
                    var offX_1 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.offsetWindowOrg(offX_1, offY_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETVIEWPORTORG: {
                    var y_3 = reader.readInt16();
                    var x_3 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportOrg(x_3, y_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETVIEWPORTEXT: {
                    var y_4 = reader.readInt16();
                    var x_4 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportExt(x_4, y_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_OFFSETVIEWPORTORG: {
                    var offY_2 = reader.readInt16();
                    var offX_2 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.offsetViewportOrg(offX_2, offY_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SAVEDC: {
                    this_1._records.push(function (gdi) {
                        gdi.saveDC();
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_RESTOREDC: {
                    var saved_1 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.restoreDC(saved_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETSTRETCHBLTMODE: {
                    var stretchMode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setStretchBltMode(stretchMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_DIBSTRETCHBLT: {
                    var haveSrcDib = ((type >> 8) + 3 !== size);
                    var rasterOp_1 = reader.readUint16() | (reader.readUint16() << 16);
                    var srcH_1 = reader.readInt16();
                    var srcW_1 = reader.readInt16();
                    var srcY_1 = reader.readInt16();
                    var srcX_1 = reader.readInt16();
                    var destH_1 = reader.readInt16();
                    var destW_1 = reader.readInt16();
                    var destY_1 = reader.readInt16();
                    var destX_1 = reader.readInt16();
                    var datalength = size * 2 - (reader.pos - curpos);
                    var dib_1 = new DIBitmap(reader, datalength);
                    this_1._records.push(function (gdi) {
                        gdi.stretchDibBits(srcX_1, srcY_1, srcW_1, srcH_1, destX_1, destY_1, destW_1, destH_1, rasterOp_1, dib_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_STRETCHDIB: {
                    var rasterOp_2 = reader.readUint16() | (reader.readUint16() << 16);
                    var colorUsage_1 = reader.readInt16();
                    var srcH_2 = reader.readInt16();
                    var srcW_2 = reader.readInt16();
                    var srcY_2 = reader.readInt16();
                    var srcX_2 = reader.readInt16();
                    var destH_2 = reader.readInt16();
                    var destW_2 = reader.readInt16();
                    var destY_2 = reader.readInt16();
                    var destX_2 = reader.readInt16();
                    var datalength = size * 2 - (reader.pos - curpos);
                    var dib_2 = new DIBitmap(reader, datalength);
                    this_1._records.push(function (gdi) {
                        gdi.stretchDib(srcX_2, srcY_2, srcW_2, srcH_2, destX_2, destY_2, destW_2, destH_2, rasterOp_2, colorUsage_1, dib_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_ESCAPE: {
                    var func_1 = reader.readUint16();
                    var count_1 = reader.readUint16();
                    var offset_1 = reader.pos;
                    var blob_1 = new Blob(reader, offset_1);
                    this_1._records.push(function (gdi) {
                        gdi.escape(func_1, blob_1, offset_1, count_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETTEXTALIGN: {
                    var textAlign_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setTextAlign(textAlign_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETBKMODE: {
                    var bkMode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setBkMode(bkMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETTEXTCOLOR: {
                    var textColor_1 = new ColorRef(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setTextColor(textColor_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETBKCOLOR: {
                    var bkColor_1 = new ColorRef(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setBkColor(bkColor_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEBRUSHINDIRECT: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var brush_1 = new Brush(reader, datalength, false);
                    this_1._records.push(function (gdi) {
                        gdi.createBrush(brush_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_DIBCREATEPATTERNBRUSH: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var brush_2 = new Brush(reader, datalength, true);
                    this_1._records.push(function (gdi) {
                        gdi.createBrush(brush_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEPENINDIRECT: {
                    var pen_1 = new Pen(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createPen(pen_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEFONTINDIRECT: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var font_1 = new Font(reader, datalength);
                    this_1._records.push(function (gdi) {
                        gdi.createFont(font_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SELECTOBJECT: {
                    var idx_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_1, null);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SELECTPALETTE: {
                    var idx_2 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_2, "palette");
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SELECTCLIPREGION: {
                    var idx_3 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_3, "region");
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_DELETEOBJECT: {
                    var idx_4 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.deleteObject(idx_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_RECTANGLE: {
                    var rect_1 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_1, 0, 0);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_ROUNDRECT: {
                    var rh_1 = reader.readInt16();
                    var rw_1 = reader.readInt16();
                    var rect_2 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_2, rw_1, rh_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_LINETO: {
                    var y_5 = reader.readInt16();
                    var x_5 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.lineTo(x_5, y_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_MOVETO: {
                    var y_6 = reader.readInt16();
                    var x_6 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.moveTo(x_6, y_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_TEXTOUT: {
                    var len = reader.readInt16();
                    if (len > 0) {
                        var text_1 = reader.readString(len);
                        reader.skip(len % 2);
                        var y_7 = reader.readInt16();
                        var x_7 = reader.readInt16();
                        this_1._records.push(function (gdi) {
                            gdi.textOut(x_7, y_7, text_1);
                        });
                    }
                    break;
                }
                case Helper.GDI.RecordType.META_EXTTEXTOUT: {
                    var y_8 = reader.readInt16();
                    var x_8 = reader.readInt16();
                    var len = reader.readInt16();
                    var fwOpts_1 = reader.readUint16();
                    var hasRect = null;
                    var hasDx = null;
                    if (size * 2 === 14 + len + len % 2) {
                        hasRect = false;
                        hasDx = false;
                    }
                    if (size * 2 === 14 + 8 + len + len % 2) {
                        hasRect = true;
                        hasDx = false;
                    }
                    if (size * 2 === 14 + len + len % 2 + len * 2) {
                        hasRect = false;
                        hasDx = true;
                    }
                    if (size * 2 === 14 + 8 + len + len % 2 + len * 2) {
                        hasRect = true;
                        hasDx = true;
                    }
                    var rect_3 = hasRect ? new Rect(reader) : null;
                    if (len > 0) {
                        var text_2 = reader.readString(len);
                        reader.skip(len % 2);
                        var dx_1 = [];
                        if (hasDx) {
                            for (var i = 0; i < text_2.length; i++) {
                                dx_1.push(reader.readInt16());
                            }
                        }
                        this_1._records.push(function (gdi) {
                            gdi.extTextOut(x_8, y_8, text_2, fwOpts_1, rect_3, dx_1);
                        });
                    }
                    break;
                }
                case Helper.GDI.RecordType.META_EXCLUDECLIPRECT: {
                    var rect_4 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.excludeClipRect(rect_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_INTERSECTCLIPRECT: {
                    var rect_5 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.intersectClipRect(rect_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_POLYGON: {
                    var cnt = reader.readInt16();
                    var points_1 = [];
                    while (cnt > 0) {
                        points_1.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polygon(points_1, true);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETPOLYFILLMODE: {
                    var polyfillmode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setPolyFillMode(polyfillmode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_POLYPOLYGON: {
                    var cnt = reader.readUint16();
                    var polygonsPtCnts = [];
                    for (var i = 0; i < cnt; i++) {
                        polygonsPtCnts.push(reader.readUint16());
                    }
                    var polygons_1 = [];
                    for (var i = 0; i < cnt; i++) {
                        var ptCnt = polygonsPtCnts[i];
                        var p = [];
                        for (var ip = 0; ip < ptCnt; ip++) {
                            p.push(new PointS(reader));
                        }
                        polygons_1.push(p);
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyPolygon(polygons_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_POLYLINE: {
                    var cnt = reader.readInt16();
                    var points_2 = [];
                    while (cnt > 0) {
                        points_2.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyline(points_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_ELLIPSE: {
                    var rect_6 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.ellipse(rect_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEPALETTE: {
                    var palette_1 = new Palette(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createPalette(palette_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEREGION: {
                    var region_1 = new Region(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createRegion(region_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEPATTERNBRUSH: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var patternBitmap = new PatternBitmap16(reader, datalength);
                    var brush_3 = new Brush(reader, datalength, patternBitmap);
                    this_1._records.push(function (gdi) {
                        gdi.createPatternBrush(brush_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_OFFSETCLIPRGN: {
                    var offY_3 = reader.readInt16();
                    var offX_3 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.offsetClipRgn(offX_3, offY_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_REALIZEPALETTE:
                case Helper.GDI.RecordType.META_SETPALENTRIES:
                case Helper.GDI.RecordType.META_SETROP2:
                case Helper.GDI.RecordType.META_SETRELABS:
                case Helper.GDI.RecordType.META_SETTEXTCHAREXTRA:
                case Helper.GDI.RecordType.META_RESIZEPALETTE:
                case Helper.GDI.RecordType.META_SETLAYOUT:
                case Helper.GDI.RecordType.META_FILLREGION:
                case Helper.GDI.RecordType.META_SETMAPPERFLAGS:
                case Helper.GDI.RecordType.META_SETTEXTJUSTIFICATION:
                case Helper.GDI.RecordType.META_SCALEWINDOWEXT:
                case Helper.GDI.RecordType.META_SCALEVIEWPORTEXT:
                case Helper.GDI.RecordType.META_FLOODFILL:
                case Helper.GDI.RecordType.META_FRAMEREGION:
                case Helper.GDI.RecordType.META_ANIMATEPALETTE:
                case Helper.GDI.RecordType.META_EXTFLOODFILL:
                case Helper.GDI.RecordType.META_SETPIXEL:
                case Helper.GDI.RecordType.META_PATBLT:
                case Helper.GDI.RecordType.META_PIE:
                case Helper.GDI.RecordType.META_STRETCHBLT:
                case Helper.GDI.RecordType.META_INVERTREGION:
                case Helper.GDI.RecordType.META_PAINTREGION:
                case Helper.GDI.RecordType.META_ARC:
                case Helper.GDI.RecordType.META_CHORD:
                case Helper.GDI.RecordType.META_BITBLT:
                case Helper.GDI.RecordType.META_SETDIBTODEV:
                case Helper.GDI.RecordType.META_DIBBITBLT:
                default: {
                    var recordName = "UNKNOWN";
                    for (var name_1 in Helper.GDI.RecordType) {
                        var recordTypes = Helper.GDI.RecordType;
                        if (recordTypes[name_1] === type) {
                            recordName = name_1;
                            break;
                        }
                    }
                    Helper.log("[WMF] " + recordName + " record (0x" + type.toString(16) + ") at offset 0x"
                        + curpos.toString(16) + " with " + (size * 2) + " bytes");
                    break;
                }
            }
            curpos += size * 2;
        };
        var this_1 = this;
        main_loop: while (!all) {
            var state_1 = _loop_1();
            switch (state_1) {
                case "break-main_loop": break main_loop;
            }
        }
        if (!all) {
            throw new WMFJSError("Could not read all records");
        }
    }
    WMFRecords.prototype.play = function (gdi) {
        var len = this._records.length;
        for (var i = 0; i < len; i++) {
            this._records[i](gdi);
        }
    };
    return WMFRecords;
}());
export { WMFRecords };
//# sourceMappingURL=WMFRecords.js.map