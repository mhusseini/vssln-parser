///<reference path="../_references.ts"/>

var vssln = require("./dist/js/Reader");
module.exports =  function(stream, callback) {
    var reader = new vssln.Reader(stream, callback);
    reader.read();
};
