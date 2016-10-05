///<reference path="../_references.ts"/>

import ReadableStream = NodeJS.ReadableStream;
import {VsSolutionFile} from "./solution-items/VsSolutionFile";
import {Grammar} from "./Grammar"

var es = require('event-stream');
var camelCase = require('camelcase');

const regex_line = /\w+/g;
export class Reader {
    private text: string;
    private input: ReadableStream | string;
    private state: any[];
    private solution: VsSolutionFile;
    private objects: any[];

    constructor(input: ReadableStream | string,
                private callback: (result: VsSolutionFile) => void) {
        this.text = "";
        if (input["setEncoding"]) {
            input["setEncoding"]("utf8");
        }

        this.input = input;

        this.solution = {
            projects: []
        };
        this.objects = [this.solution];
        this.state = [Grammar.solution];
    }

    private currentState = (): any => this.state.length > 0 ? this.state[this.state.length - 1] : null;
    private currentObject = (): any => this.objects.length > 0 ? this.objects[this.objects.length - 1] : null;

    private push = (state: any, object: any)=> {
        this.state.push(state);
        this.objects.push(object || this.currentObject());
    };

    private pop = (): void => {
        this.state.pop();
        this.objects.pop();
    };

    read = (): void => {
        // Regarding "$this": we shouldn't need to do this since
        // we're using lambdas and TSC should handle the "this"
        // keyword for us. However, inside the event handler
        // in 'on("end"...)' the keyword "this" points to the
        // stream, not the SlnReader. I don't know why.
        const $this = this;
        if (typeof this.input === "string") {
            const text = this.input as string;
            text.split(/\r?\n/).forEach(line => this.readLine(line));
            $this.callback($this.solution);
        }
        else {
            const stream = this.input as ReadableStream;
            stream
                .pipe(es.split())
                .pipe(es.mapSync(line => {
                    stream.pause();
                    this.readLine(line);
                    stream.resume();
                }))

                //.on("data", this.readLine)
                .on("end", () => {
                    $this.callback($this.solution);
                });
        }
    };

    private readLine = line => {
        regex_line.lastIndex = 0;
        const matches = regex_line.exec(line);
        if (!matches || !matches.length) {
            return;
        }

        const verb = matches[0];
        const state = this.currentState();
        const object = this.currentObject();
        const transition = state[verb.toLowerCase()];

        switch (transition) {
            case undefined:
                Reader.readSimpleValue(state, line, object);
                break;
            case null:
                this.pop();
                break;
            default:
                this.readComplexValue(transition, line, object, verb);
                break;
        }
    };

    private readComplexValue(transition: any, line, object: any, verb: string) {
        const newState = Grammar[transition];
        if (newState) {
            const child = Reader.createAndAttachChild(newState, line, object, verb);
            this.push(newState, child);
        }
        else {
            // error ?
        }
    }

    private static readSimpleValue(state: any, line, object: any) {
        const regex = state["*"];
        if (regex) {
            regex.lastIndex = 0;
            const m = regex.exec(line);
            if (m && m.length > 2) {
                let key = m[1];
                if (state._camelCase) {
                    key = camelCase(key);
                }
                object[key] = m[2];
            }
        }
        else {
            // error?
        }
    }

    private static createAndAttachChild(newState: any, line, parent: any, verb: string): any {
        if (!newState._factory) {
            return null;
        }

        const matches = newState._regexp
            ? this.execRegex(newState._regexp, line)
            : [];
        const child = newState._factory(matches);

        if (newState._attach) {
            newState._attach(parent, child, matches);
        }
        else {
            parent[verb.toLowerCase()] = child;
        }

        return child;
    }

    private static execRegex(regex: RegExp, line): string[] {
        const matches = [];
        regex.lastIndex = 0;

        for (let m = regex.exec(line); m && m.length; m = regex.exec(line)) {
            matches.push(m[m.length == 1 ? 0 : 1]);
        }

        return matches;
    }
}