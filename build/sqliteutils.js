"use strict";
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
class SqliteUtils {
    constructor(file_path, open_with = "stdout") {
        this._file_path = file_path;
        this._open_with = open_with;
        this.results = new Array();
        this._variables = new Map();
    }
    hello() {
        console.log("Hello world from sqliteutils.");
    }
    process_file() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("current dir: " + fileutils_1.FileUtils.currentDirectory());
            // check that the filename exists
            if (!(yield fileutils_1.FileUtils.isFile(this._file_path))) {
                console.log("not file");
                this.results.push("Error: the file " + this._file_path
                    + " doesn't exist.");
                return -2;
            }
            let contents = yield fileutils_1.FileUtils.readFile(this._file_path);
            console.log("length of file: " + contents.length.toString());
            // check that the file has at least 2 rows
            if (contents.length < 2) {
                this.results.push("Error: the file " + this._file_path
                    + " is shorter than 2 rows. There should at least be "
                    + "a database path and an instruction.");
                return -5;
            }
            // Check that the database name is in the first line
            let regex = new RegExp("^-- Database =\\s*(.*?)\\s*$");
            let match = regex.exec(contents[0]);
            if (match == null) {
                this.results.push("Error: The database path and name "
                    + "should be in the first line of the file e.g. "
                    + "-- Database = /home/me/my-database.db");
                return -3;
            }
            let database_path = match[1];
            // console.log("database path: '" + database_path + "'");
            // Check that the database file exists
            if (!(yield fileutils_1.FileUtils.isFile(database_path))) {
                this.results.push("Error: The database '" + database_path
                    + "' doesn't exist.");
                return -4;
            }
            // Variable substitution
            let new_contents = new Array();
            for (let [key, line] of contents.entries()) {
                //console.log(line);
                let variables = fileutils_1.FileUtils.regex_extract("^-- <variable name=\"(.*?)\" "
                    + "value=\"(.*?)\" />\\s*$", line);
                if (variables.length > 0) {
                    this._variables.set(variables[0], variables[1]);
                }
                for (let [variable, replacement] of this._variables.entries()) {
                    if (line.includes(variable)) {
                        line = line.replace(variable, replacement);
                    }
                }
                new_contents.push(line);
            }
            // Write to a temporary file to allow for variable substitution
            let temp_sql_file = yield fileutils_1.FileUtils.tmpfile();
            yield fileutils_1.FileUtils.writeFile(temp_sql_file, new_contents);
            // Send the new file to sqlite3.
            let sql_results = yield fileutils_1.FileUtils.execute(temp_sql_file, database_path);
            let temp_results_path = yield fileutils_1.FileUtils.tmpfile();
            yield fileutils_1.FileUtils.writeFile(temp_results_path, sql_results);
            for (let line of sql_results) {
                this.results.push(line);
            }
            yield fileutils_1.FileUtils.show_file(temp_results_path, this._open_with);
            return 0;
        });
    } // end of process_file
} // End of class SqliteUtils
exports.SqliteUtils = SqliteUtils;
// export = SqliteUtils;
//# sourceMappingURL=sqliteutils.js.map