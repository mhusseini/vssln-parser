///<reference path="../_references.ts"/>

import {ProjectTypeMappings} from "./Mappings"

var camelCase = require('camelcase');
var extend = require("extend");

const sectionExpression = {
    _regexp: /\((.+?)\)/g,
    _attach: (parent, item, m) => parent[camelCase(m[0])] = item,
    _factory: () => {
        return {};
    },
    "*": /\s*(.+?)\s*=\s*(.+)\s*/g
};

export const Grammar = {
    solution: {
        project: "project",
        global: "global",
        _camelCase: true,
        "*": /\s*(.+?)\s*=\s*(.+)\s*/g
    },
    project: {
        _regexp: /"([^"]+)"/g,
        _attach: (parent, item) => parent.projects.push(item),
        _factory: m => {
            return {
                name: m[1],
                type: ProjectTypeMappings[m[0].toUpperCase()],
                typeGuid: m[0],
                projectGuid: m[3],
                path: m[2]
            }
        },
        projectsection: "projectsection",
        endproject: null
    },
    global: {
        globalsection: "globalsection",
        endglobal: null
    },
    projectsection: extend({endprojectsection: null}, sectionExpression),
    globalsection: extend({endglobalsection: null}, sectionExpression)
};