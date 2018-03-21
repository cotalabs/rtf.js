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
import { EMFJSError, Helper } from "./Helper";
import { PointL, PointS, RectL, SizeL } from "./Primitives";
import { Region } from "./Region";
import { Brush, ColorRef, Pen } from "./Style";
var EmfHeader = /** @class */ (function () {
    function EmfHeader(reader, headerSize) {
        var recordStart = reader.pos - 8;
        this.size = headerSize;
        this.bounds = new RectL(reader);
        this.frame = new RectL(reader);
        if (reader.readUint32() !== Helper.GDI.FormatSignature.ENHMETA_SIGNATURE) {
            throw new EMFJSError("Invalid header signature");
        }
        reader.skip(4); // version
        reader.skip(4); // bytes (size of metafile)
        reader.skip(4); // number of records
        reader.skip(2); // number of handles
        reader.skip(2); // reserved
        var descriptionLen = reader.readUint32();
        var descriptionOff = reader.readUint32();
        this.nPalEntries = reader.readUint32();
        this.refDevCx = reader.readUint32();
        this.refDevCy = reader.readUint32();
        this.refDevCxMm = reader.readUint32();
        this.refDevCyMm = reader.readUint32();
        var hdrSize = headerSize;
        if (descriptionLen > 0) {
            if (descriptionOff < 88) {
                throw new EMFJSError("Invalid header description offset");
            }
            hdrSize = descriptionOff + (descriptionLen * 2);
            if (hdrSize > headerSize) {
                throw new EMFJSError("Invalid header description length");
            }
            var prevPos = reader.pos;
            reader.seek(recordStart + descriptionOff);
            this.description = reader.readFixedSizeUnicodeString(descriptionLen);
            reader.seek(prevPos);
        }
        else {
            this.description = "";
        }
        if (hdrSize >= 100) {
            // We have a EmfMetafileHeaderExtension1 record
            var pixelFormatSize = reader.readUint32();
            var pixelFormatOff = reader.readUint32();
            var haveOpenGl = reader.readUint32();
            if (haveOpenGl !== 0) {
                throw new EMFJSError("OpenGL records are not yet supported");
            }
            if (pixelFormatOff !== 0) {
                if (pixelFormatOff < 100 || pixelFormatOff < hdrSize) {
                    throw new EMFJSError("Invalid pixel format offset");
                }
                hdrSize = pixelFormatOff + pixelFormatSize;
                if (hdrSize > headerSize) {
                    throw new EMFJSError("Invalid pixel format size");
                }
                // TODO: read pixel format blob
            }
            if (hdrSize >= 108) {
                // We have a EmfMetafileHeaderExtension2 record
                this.displayDevCxUm = reader.readUint32(); // in micrometers
                this.displayDevCyUm = reader.readUint32(); // in micrometers
            }
        }
    }
    EmfHeader.prototype.toString = function () {
        return "{bounds: " + this.bounds.toString() + ", frame: " + this.frame.toString()
            + ", description: " + this.description + "}";
    };
    return EmfHeader;
}());
export { EmfHeader };
var EMFRecords = /** @class */ (function () {
    function EMFRecords(reader, first) {
        this._records = [];
        this._header = new EmfHeader(reader, first);
        var all = false;
        var curpos = first;
        var _loop_1 = function () {
            reader.seek(curpos);
            var type = reader.readUint32();
            var size = reader.readUint32();
            if (size < 8) {
                throw new EMFJSError("Invalid record size");
            }
            switch (type) {
                case Helper.GDI.RecordType.EMR_EOF:
                    all = true;
                    return "break-main_loop";
                case Helper.GDI.RecordType.EMR_SETMAPMODE: {
                    var mapMode_1 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.setMapMode(mapMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETWINDOWORGEX: {
                    var x_1 = reader.readInt32();
                    var y_1 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowOrgEx(x_1, y_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETWINDOWEXTEX: {
                    var x_2 = reader.readUint32();
                    var y_2 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowExtEx(x_2, y_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETVIEWPORTORGEX: {
                    var x_3 = reader.readInt32();
                    var y_3 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportOrgEx(x_3, y_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETVIEWPORTEXTEX: {
                    var x_4 = reader.readUint32();
                    var y_4 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportExtEx(x_4, y_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SAVEDC: {
                    this_1._records.push(function (gdi) {
                        gdi.saveDC();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_RESTOREDC: {
                    var saved_1 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.restoreDC(saved_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETBKMODE: {
                    var bkMode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setBkMode(bkMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETBKCOLOR: {
                    var bkColor_1 = new ColorRef(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setBkColor(bkColor_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_CREATEBRUSHINDIRECT: {
                    var index_1 = reader.readUint32();
                    var brush_1 = new Brush(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createBrush(index_1, brush_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_CREATEPEN: {
                    var index_2 = reader.readUint32();
                    var pen_1 = new Pen(reader, null);
                    this_1._records.push(function (gdi) {
                        gdi.createPen(index_2, pen_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_EXTCREATEPEN: {
                    var index_3 = reader.readUint32();
                    var offBmi = reader.readUint32();
                    var cbBmi = reader.readUint32();
                    var offBits = reader.readUint32();
                    var cbBits = reader.readUint32();
                    var pen_2 = new Pen(reader, {
                        header: {
                            off: offBmi,
                            size: cbBmi,
                        },
                        data: {
                            off: offBits,
                            size: cbBits,
                        },
                    });
                    this_1._records.push(function (gdi) {
                        gdi.createPen(index_3, pen_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SELECTOBJECT: {
                    var idx_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_1, null);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_DELETEOBJECT: {
                    var idx_2 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.deleteObject(idx_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_RECTANGLE: {
                    var rect_1 = new RectL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_1, 0, 0);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_ROUNDRECT: {
                    var rect_2 = new RectL(reader);
                    var corner_1 = new SizeL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_2, corner_1.cx, corner_1.cy);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_LINETO: {
                    var x_5 = reader.readInt32();
                    var y_5 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.lineTo(x_5, y_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_MOVETOEX: {
                    var x_6 = reader.readInt32();
                    var y_6 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.moveToEx(x_6, y_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYGON:
                case Helper.GDI.RecordType.EMR_POLYGON16: {
                    var isSmall = (type === Helper.GDI.RecordType.EMR_POLYGON16);
                    var bounds_1 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_1 = [];
                    while (cnt > 0) {
                        points_1.push(isSmall ? new PointS(reader) : new PointL(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polygon(points_1, bounds_1, true);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYPOLYGON:
                case Helper.GDI.RecordType.EMR_POLYPOLYGON16: {
                    var isSmall = (type === Helper.GDI.RecordType.EMR_POLYPOLYGON16);
                    var bounds_2 = new RectL(reader);
                    var polyCnt = reader.readUint32();
                    reader.skip(4); // count
                    var polygonsPtCnts = [];
                    for (var i = 0; i < polyCnt; i++) {
                        polygonsPtCnts.push(reader.readUint32());
                    }
                    var polygons_1 = [];
                    for (var i = 0; i < polyCnt; i++) {
                        var ptCnt = polygonsPtCnts[i];
                        var p = [];
                        for (var ip = 0; ip < ptCnt; ip++) {
                            p.push(isSmall ? new PointS(reader) : new PointL(reader));
                        }
                        polygons_1.push(p);
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyPolygon(polygons_1, bounds_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETPOLYFILLMODE: {
                    var polyfillmode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setPolyFillMode(polyfillmode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYLINE16:
                case Helper.GDI.RecordType.EMR_POLYLINETO16: {
                    var isLineTo_1 = (type === Helper.GDI.RecordType.EMR_POLYLINETO16);
                    var bounds_3 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_2 = [];
                    while (cnt > 0) {
                        points_2.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyline(isLineTo_1, points_2, bounds_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYBEZIER:
                case Helper.GDI.RecordType.EMR_POLYBEZIERTO: {
                    var isPolyBezierTo_1 = (type === Helper.GDI.RecordType.EMR_POLYBEZIERTO);
                    var bounds_4 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_3 = [];
                    while (cnt > 0) {
                        points_3.push(new PointL(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polybezier(isPolyBezierTo_1, points_3, bounds_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYBEZIER16: {
                    var bounds_5 = new RectL(reader);
                    var start = new PointL(reader);
                    var cnt = reader.readUint32();
                    var points_4 = [start];
                    while (cnt > 0) {
                        points_4.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polybezier(false, points_4, bounds_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYBEZIERTO16: {
                    var bounds_6 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_5 = [];
                    while (cnt > 0) {
                        points_5.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polybezier(true, points_5, bounds_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETTEXTALIGN: {
                    var textAlign_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setTextAlign(textAlign_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETSTRETCHBLTMODE: {
                    var stretchMode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setStretchBltMode(stretchMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETBRUSHORGEX: {
                    var origin_1 = new PointL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setBrushOrgEx(origin_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_BEGINPATH: {
                    this_1._records.push(function (gdi) {
                        gdi.beginPath();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_ENDPATH: {
                    this_1._records.push(function (gdi) {
                        gdi.endPath();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_ABORTPATH: {
                    this_1._records.push(function (gdi) {
                        gdi.abortPath();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_CLOSEFIGURE: {
                    this_1._records.push(function (gdi) {
                        gdi.closeFigure();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_FILLPATH: {
                    var bounds_7 = new RectL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.fillPath(bounds_7);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_STROKEPATH: {
                    var bounds_8 = new RectL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.strokePath(bounds_8);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SELECTCLIPPATH: {
                    var rgnMode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.selectClipPath(rgnMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_EXTSELECTCLIPRGN: {
                    reader.skip(4);
                    var rgnMode_2 = reader.readUint32();
                    var region_1 = rgnMode_2 !== Helper.GDI.RegionMode.RGN_COPY ? new Region(reader) : null;
                    this_1._records.push(function (gdi) {
                        gdi.selectClipRgn(rgnMode_2, region_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_OFFSETCLIPRGN: {
                    var offset_1 = new PointL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.offsetClipRgn(offset_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETMITERLIMIT: {
                    var miterLimit_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setMiterLimit(miterLimit_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYLINE:
                case Helper.GDI.RecordType.EMR_POLYLINETO:
                case Helper.GDI.RecordType.EMR_POLYPOLYLINE:
                case Helper.GDI.RecordType.EMR_SETPIXELV:
                case Helper.GDI.RecordType.EMR_SETMAPPERFLAGS:
                case Helper.GDI.RecordType.EMR_SETROP2:
                case Helper.GDI.RecordType.EMR_SETCOLORADJUSTMENT:
                case Helper.GDI.RecordType.EMR_SETTEXTCOLOR:
                case Helper.GDI.RecordType.EMR_SETMETARGN:
                case Helper.GDI.RecordType.EMR_EXCLUDECLIPRECT:
                case Helper.GDI.RecordType.EMR_INTERSECTCLIPRECT:
                case Helper.GDI.RecordType.EMR_SCALEVIEWPORTEXTEX:
                case Helper.GDI.RecordType.EMR_SCALEWINDOWEXTEX:
                case Helper.GDI.RecordType.EMR_SETWORLDTRANSFORM:
                case Helper.GDI.RecordType.EMR_MODIFYWORLDTRANSFORM:
                case Helper.GDI.RecordType.EMR_ANGLEARC:
                case Helper.GDI.RecordType.EMR_ELLIPSE:
                case Helper.GDI.RecordType.EMR_ARC:
                case Helper.GDI.RecordType.EMR_CHORD:
                case Helper.GDI.RecordType.EMR_PIE:
                case Helper.GDI.RecordType.EMR_SELECTPALETTE:
                case Helper.GDI.RecordType.EMR_CREATEPALETTE:
                case Helper.GDI.RecordType.EMR_SETPALETTEENTRIES:
                case Helper.GDI.RecordType.EMR_RESIZEPALETTE:
                case Helper.GDI.RecordType.EMR_REALIZEPALETTE:
                case Helper.GDI.RecordType.EMR_EXTFLOODFILL:
                case Helper.GDI.RecordType.EMR_ARCTO:
                case Helper.GDI.RecordType.EMR_POLYDRAW:
                case Helper.GDI.RecordType.EMR_SETARCDIRECTION:
                case Helper.GDI.RecordType.EMR_STROKEANDFILLPATH:
                case Helper.GDI.RecordType.EMR_FLATTENPATH:
                case Helper.GDI.RecordType.EMR_WIDENPATH:
                case Helper.GDI.RecordType.EMR_COMMENT:
                case Helper.GDI.RecordType.EMR_FILLRGN:
                case Helper.GDI.RecordType.EMR_FRAMERGN:
                case Helper.GDI.RecordType.EMR_INVERTRGN:
                case Helper.GDI.RecordType.EMR_PAINTRGN:
                case Helper.GDI.RecordType.EMR_BITBLT:
                case Helper.GDI.RecordType.EMR_STRETCHBLT:
                case Helper.GDI.RecordType.EMR_MASKBLT:
                case Helper.GDI.RecordType.EMR_PLGBLT:
                case Helper.GDI.RecordType.EMR_SETDIBITSTODEVICE:
                case Helper.GDI.RecordType.EMR_STRETCHDIBITS:
                case Helper.GDI.RecordType.EMR_EXTCREATEFONTINDIRECTW:
                case Helper.GDI.RecordType.EMR_EXTTEXTOUTA:
                case Helper.GDI.RecordType.EMR_EXTTEXTOUTW:
                case Helper.GDI.RecordType.EMR_POLYPOLYLINE16:
                case Helper.GDI.RecordType.EMR_POLYDRAW16:
                case Helper.GDI.RecordType.EMR_CREATEMONOBRUSH:
                case Helper.GDI.RecordType.EMR_CREATEDIBPATTERNBRUSHPT:
                case Helper.GDI.RecordType.EMR_POLYTEXTOUTA:
                case Helper.GDI.RecordType.EMR_POLYTEXTOUTW:
                case Helper.GDI.RecordType.EMR_SETICMMODE:
                case Helper.GDI.RecordType.EMR_CREATECOLORSPACE:
                case Helper.GDI.RecordType.EMR_SETCOLORSPACE:
                case Helper.GDI.RecordType.EMR_DELETECOLORSPACE:
                case Helper.GDI.RecordType.EMR_GLSRECORD:
                case Helper.GDI.RecordType.EMR_GLSBOUNDEDRECORD:
                case Helper.GDI.RecordType.EMR_PIXELFORMAT:
                case Helper.GDI.RecordType.EMR_DRAWESCAPE:
                case Helper.GDI.RecordType.EMR_EXTESCAPE:
                case Helper.GDI.RecordType.EMR_SMALLTEXTOUT:
                case Helper.GDI.RecordType.EMR_FORCEUFIMAPPING:
                case Helper.GDI.RecordType.EMR_NAMEDESCAPE:
                case Helper.GDI.RecordType.EMR_COLORCORRECTPALETTE:
                case Helper.GDI.RecordType.EMR_SETICMPROFILEA:
                case Helper.GDI.RecordType.EMR_SETICMPROFILEW:
                case Helper.GDI.RecordType.EMR_ALPHABLEND:
                case Helper.GDI.RecordType.EMR_SETLAYOUT:
                case Helper.GDI.RecordType.EMR_TRANSPARENTBLT:
                case Helper.GDI.RecordType.EMR_GRADIENTFILL:
                case Helper.GDI.RecordType.EMR_SETLINKEDUFIS:
                case Helper.GDI.RecordType.EMR_SETTEXTJUSTIFICATION:
                case Helper.GDI.RecordType.EMR_COLORMATCHTOTARGETW:
                case Helper.GDI.RecordType.EMR_CREATECOLORSPACEW:
                default: {
                    var recordName = "UNKNOWN";
                    for (var name_1 in Helper.GDI.RecordType) {
                        var recordTypes = Helper.GDI.RecordType;
                        if (recordTypes[name_1] === type) {
                            recordName = name_1;
                            break;
                        }
                    }
                    Helper.log("[EMF] " + recordName + " record (0x" + type.toString(16) + ") at offset 0x"
                        + curpos.toString(16) + " with " + size + " bytes");
                    break;
                }
            }
            curpos += size;
        };
        var this_1 = this;
        main_loop: while (!all) {
            var state_1 = _loop_1();
            switch (state_1) {
                case "break-main_loop": break main_loop;
            }
        }
        if (!all) {
            throw new EMFJSError("Could not read all records");
        }
    }
    EMFRecords.prototype.play = function (gdi) {
        var len = this._records.length;
        for (var i = 0; i < len; i++) {
            this._records[i](gdi);
        }
    };
    return EMFRecords;
}());
export { EMFRecords };
//# sourceMappingURL=EMFRecords.js.map