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
// import fs = require('fs');
// import os = require('os');
// import exec = require('child_process');
// import tmp = require('tmp');
const fs_1 = require("fs");
const os_1 = require("os");
const child_process_1 = require("child_process");
const tmp_1 = require("tmp");
class FileUtils {
    constructor() { }
    hello() {
        console.log("Hello world from FileUtils.");
    }
    // use: if (! await flu.isFile(path)) {
    static isFile(path) {
        if (path == null) {
            return new Promise((resolve, reject) => {
                console.log("Error: null path sent to isFile.");
                resolve(false);
            });
        }
        return new Promise((resolve, reject) => {
            fs_1.stat(path, (err, stats) => {
                if (err) {
                    resolve(false);
                }
                else if (stats.isFile()) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    static fullPath(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!(yield FileUtils.isFile(path))) {
                    console.log(`Error: the file ${path} `
                        + "does not exist.");
                    resolve("error: file '" + path
                        + "' doesn't exist");
                }
                fs_1.realpath(path, (err, resolvedPath) => {
                    if (err) {
                        resolve("error: " + err.message);
                    }
                    else {
                        resolve(resolvedPath);
                    }
                });
            }));
        });
    }
    static isDirectory(path) {
        return new Promise((resolve, reject) => {
            fs_1.stat(path, (err, stats) => {
                if (err) {
                    resolve(false);
                }
                else if (stats.isDirectory()) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    static readFile(path) {
        return new Promise((resolve, reject) => {
            // Check that the file exists
            FileUtils.isFile(path).then((value) => {
                if (value == true) {
                    fs_1.readFile(path, (err, data) => {
                        if (err) {
                            let r = new Array();
                            r.push(err.toString());
                            resolve(r);
                        }
                        else {
                            resolve(data.toString().split(os_1.EOL));
                        }
                    });
                }
                else {
                    reject("Error: File '" + path + "' does not exist.");
                }
            }, (reason) => {
                console.log("isFile rejected");
                return new Promise((resolve, reject) => {
                    reject(reason);
                });
            });
        });
    }
    static writeFile(path, data) {
        console.log("path='" + path + "'");
        return new Promise((resolve, reject) => {
            fs_1.writeFile(path, data.join(os_1.EOL), (err) => {
                if (err) {
                    console.log("Error: " + err);
                    throw err;
                }
                else {
                    resolve();
                }
            });
        });
    }
    // Returns an array of matched groups from 
    // a string based on regexp
    static regex_extract(pattern, line) {
        let r = new Array();
        let regex = new RegExp(pattern);
        let match = regex.exec(line);
        if (match != null) {
            for (let i = 1; i < 100; i++) {
                if (match[i] != undefined) {
                    r.push(match[i]);
                }
                else {
                    break;
                }
            }
        }
        return r;
    }
    static tmpfile() {
        return new Promise((resolve, reject) => {
            tmp_1.file({ keep: true }, (err, path, fd, cleanupcallback) => {
                if (err) {
                    throw err;
                }
                else {
                    resolve(path);
                }
            });
        });
    }
    static execute(sql_path, database_path) {
        let ret = new Array();
        return new Promise((resolve, reject) => {
            let command = "sqlite3";
            let args = new Array();
            args.push("-init");
            args.push(sql_path);
            args.push(database_path);
            args.push(".quit");
            let process = child_process_1.spawn(command, args);
            process.stdout.on('data', (data) => {
                ret.push(data.toString());
            });
            process.stderr.on('data', (data) => {
                ret.push(data.toString());
            });
            process.on('close', (code) => {
                resolve(ret);
            });
        });
    }
    static show_file(path, program) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isFile(path)) {
                throw "Error: file " + path + "doesn't exist.";
            }
            if (program == "none") {
                return;
            }
            if (program == "stdout") {
                let lines = yield this.readFile(path);
                for (let line of lines) {
                    console.log(line);
                }
            }
            else {
                let args = new Array();
                args.push(path);
                let process = child_process_1.spawn(program, args, { detached: true });
            }
        });
    }
    static run_program(program = "google-chrome", args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args == null) {
                args = new Array();
            }
            let process = child_process_1.spawn(program, args, { detached: true });
        });
    }
    static deleteIfExists(path) {
        return new Promise((resolve, reject) => {
            fs_1.unlink(path, (err) => {
                resolve();
            });
        });
    }
    static currentDirectory() {
        return __dirname;
    }
} // End of Application class 
exports.FileUtils = FileUtils;
// export = FileUtils;
//# sourceMappingURL=fileutils.js.map