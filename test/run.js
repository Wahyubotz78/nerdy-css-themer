import {readFileSync, writeFileSync, existsSync } from "fs";
import { emptyDirSync } from "fs-extra";
import { performance } from "perf_hooks";
import NerdyCSSThemer from "../index.js";

const encoding = 'utf8';

function runTest(sampleName, options) {
    console.log(`${sampleName}: Processing`);
    const rootFileName = `./test/samples/${sampleName}.css`;
    if (!existsSync(rootFileName)) {
        console.log(`File ${rootFileName} does not exist. Skipping.`)
        return;
    }
    const startTime = performance.now();
    const oldCSS = readFileSync(rootFileName, `utf-8`);
    const newCSS = NerdyCSSThemer(oldCSS, {
        beautify: true,
        astHandler: (oldAST, newAST) => {
            console.log(`${sampleName}: Saving AST`);
            writeFileSync(`./test/out/${sampleName}.ast.old.json`, JSON.stringify(oldAST, undefined, 2), encoding);
            writeFileSync(`./test/out/${sampleName}.ast.new.json`, JSON.stringify(newAST, undefined, 2), encoding);
        },
        ...options,
    });
    console.log(`${sampleName}: Saving`);
    writeFileSync(`./test/out/${sampleName}.old.css`, oldCSS, encoding);
    writeFileSync(`./test/out/${sampleName}.new.css`, newCSS, encoding);
    const endTime = performance.now();
    console.log(`${sampleName}: Done [${Math.round((endTime - startTime + Number.EPSILON) * 100) / 100} ms]`);
}

emptyDirSync('./test/out');
runTest('sampleSmall');
runTest('sampleBig');
runTest('bitbucket');