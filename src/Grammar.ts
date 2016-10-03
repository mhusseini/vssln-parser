///<reference path="../_references.ts"/>

import {ProjectTypeMappings} from "./Mappings"

var camelCase = require('camelcase');

export const Grammar = {
    solution: {
        project: "project",
        global: "global",
        _camelCase:true,
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
    projectsection: {
        _regexp: /\((.+?)\)/g,
        _attach: (parent, item, m) => parent[camelCase(m[0])] = item,
        _factory: () => {
            return {};
        },
        endprojectsection: null,
        "*": /\s*(.+?)\s*=\s*(.+)\s*/g
    },
    global: {
        globalsection: "globalsection",
        endglobal: null
    },
    globalsection: {
        _regexp: /\((.+?)\)/g,
        _attach: (parent, item, m) => parent[camelCase(m[0])] = item,
        _factory: () => {
            return {};
        },
        endglobalsection: null,
        "*": /\s*(.+?)\s*=\s*(.+)\s*/g
    }
};