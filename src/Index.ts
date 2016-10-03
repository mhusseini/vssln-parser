///<reference path="../_references.ts"/>

var vssln = require("./Reader");
export function parse(stream, callback) {
    var reader = new vssln.Reader(stream, callback);
    reader.read();
}
