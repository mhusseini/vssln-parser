///<reference path="../_references.ts"/>
import {VsSolutionFile} from "../src/solution-items/VsSolutionFile";

var expect: Chai.ExpectStatic = require('chai').expect;
var fs = require('fs');
var parse = require("../../").parse;

describe('Read from stream', function () {
    let solution: VsSolutionFile;
    before(done => {
        const stream = fs.createReadStream("dist/test/test.sln");
        parse(stream, result => {
            solution = result;
            done();
        });
    });

    it("expects the solution to contain a valid 'VisualStudioVersion'", () => {
        expect(solution.visualStudioVersion).to.equal("14.0.25420.1");
    });

    it("expects the solution to contain a valid 'MinimumVisualStudioVersion'", () => {
        expect(solution.minimumVisualStudioVersion).to.equal("10.0.40219.1");
    });

    it("expects the solution to contain projects with dependencies", () => {
        const projectsWithDependencies = solution.projects.filter(p => !!p.projectDependencies);
        expect(projectsWithDependencies.length).to.greaterThan(0);
    });
});
