"use strict";
/// <reference path="command-line-args.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileutils_1 = require("./fileutils");
const sqliteutils_1 = require("./sqliteutils");
const program_version = "0.3";
const CLA = require("command-line-args");
const CLU = require("command-line-usage");
class SqliteRunner {
    constructor(options) {
        this._results = new Array();
        this._options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("input file: " + this._options['input-file']);
            // Check that the input file exists.
            if (!(yield fileutils_1.FileUtils.isFile(this._options['input-file']))) {
                console.log(`Error: the file ${this._options['input-file']} `
                    + "does not exist.");
                return;
            }
            else {
                // Make sure the input file is the full path
                let fullPath = yield fileutils_1.FileUtils.fullPath(this._options['input-file']);
                console.log("full path: " + fullPath);
                // Change working directory if specified
                if (this._options['working-directory'] != null) {
                    console.log("working directory: "
                        + fileutils_1.FileUtils.currentDirectory());
                    console.log("Changing working directory to " + this._options['working-directory']);
                    process.chdir(this._options['working-directory']);
                }
                let su = new sqliteutils_1.SqliteUtils(fullPath, this._options['open-with']);
                yield su.process_file();
                process.exit();
                return 0;
            }
        });
    }
    hello() {
        let sqlu = new sqliteutils_1.SqliteUtils("");
        sqlu.hello();
        let fu = new fileutils_1.FileUtils();
        fu.hello();
    }
} // Emd of SqliteRunner class  
// Display command line usage.
function show_usage(definitions) {
    const usage = CLU([
        {
            header: 'Sqlite Runner',
            content: 'A program to send an sql file to sqlite3 and show the result.'
        },
        {
            header: 'Options',
            optionList: definitions
        }
    ]);
    console.log(usage);
}
// Main function
function main() {
    // Deal with any command line arguments to the program
    // https://www.npmjs.com/package/command-line-args
    const optionDefinitions = [
        {
            name: 'open-with', alias: 'o', type: String,
            description: "Program with which to open the resulting \
file (default = geany). Specify 'stdout' for terminal.",
            defaultValue: 'geany'
        },
        {
            name: 'version', alias: 'e', type: Boolean,
            description: "Show the version number then exit the program."
        },
        {
            name: 'verbose', alias: 'v', type: Boolean,
            description: "Show all warnings."
        },
        {
            name: 'input-file', alias: 'i', type: String,
            defaultOption: true, description: "The sql text file to send to sqlite3."
        },
        {
            name: 'working-directory', alias: 'w', type: String,
            description: "The working directory for sqlite3."
        },
        {
            name: 'help', alias: 'h', type: Boolean,
            description: "Display this usage guide."
        }
    ];
    let options;
    try {
        options = CLA(optionDefinitions);
    }
    catch (e) {
        console.log("Error in command line arguments: " + e.toString());
        show_usage(optionDefinitions);
        return;
    }
    if (options.help) {
        console.log("Help option chosen in command line arguments.");
        show_usage(optionDefinitions);
        return;
    }
    if (options.version) {
        console.log("version = " + program_version);
        return;
    }
    // console.log(options);
    if (options['input-file'] == null) {
        console.log("Error: an input file must be specified, or -h or -e.");
        show_usage(optionDefinitions);
        return;
    }
    let app = new SqliteRunner(options);
    app.run();
} // end of main function
main();
//# sourceMappingURL=main.js.map