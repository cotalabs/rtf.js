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
import { Document } from "./Document";
import { RTFJSError } from "./Helper";
import { Parser } from "./parser/Parser";
import { Renderer } from "./renderer/Renderer";
var DocumentFacade = /** @class */ (function () {
    function DocumentFacade(blob, settings) {
        this._document = new Document(settings);
        this._renderer = new Renderer(this._document);
        var parser = new Parser(this._document, blob, this._renderer);
        this._parsed = parser.parse();
    }
    DocumentFacade.prototype.metadata = function () {
        return this._document._meta;
    };
    DocumentFacade.prototype.render = function () {
        var _this = this;
        return this._parsed
            .then(function () {
            return _this._renderer.buildDom();
        }).catch(function (error) {
            throw new RTFJSError(error);
        });
    };
    return DocumentFacade;
}());
export { DocumentFacade };
//# sourceMappingURL=DocumentFacade.js.map