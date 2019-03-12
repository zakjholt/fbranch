#!/usr/bin/env node

const Git = require("../lib/main");

const args = process.argv.slice(2);

const workingDir = process.cwd();

const git = new Git(workingDir);

args.includes("-i") ? git.interactiveSearchByQuery() : git.searchByQuery(args);
