/// <reference path="command-line-args.d.ts" />

import { FileUtils } from './fileutils';
import { SqliteUtils } from './sqliteutils';

const program_version: string = "0.3";
import CLA = require('command-line-args');
import CLU = require('command-line-usage');


class SqliteRunner {
  private _options: any; // command line options Javascript set of name:values
  private _results: Array<string> = new Array<string>();
  constructor(options: any) {
    this._options = options;
  }

  public async run() {
    console.log("input file: " + this._options['input-file']);

    // Check that the input file exists.
    if (! await FileUtils.isFile(this._options['input-file'])) {
      console.log(`Error: the file ${this._options['input-file']} `
        + "does not exist.");
      return;
    }
    else {
      // Make sure the input file is the full path
      let fullPath = await FileUtils.fullPath(this._options['input-file']);
      console.log("full path: " + fullPath);
      
      // Change working directory if specified
      if (this._options['working-directory'] != null) {
        console.log("working directory: "
          + FileUtils.currentDirectory());
        console.log("Changing working directory to " + this._options['working-directory']);
        process.chdir(this._options['working-directory']);
      }

      let su: SqliteUtils =
        new SqliteUtils(fullPath,
          this._options['open-with']);
      await su.process_file();
      process.exit();
      return 0;

    }
  }



  hello() {
    let sqlu = new SqliteUtils("");
    sqlu.hello();
    let fu = new FileUtils();
    fu.hello();
  }
} // Emd of SqliteRunner class  

// Display command line usage.
function show_usage(definitions: Array<CLA.ArgDescriptor>) {
  const usage = CLU([
    {
      header: 'Sqlite Runner',
      content: 'A program to send an sql file to sqlite3 and show the result.'
    },
    {
      header: 'Options',
      optionList: definitions
    }
  ])
  console.log(usage)

}

// Main function
function main() {
  // Deal with any command line arguments to the program
  // https://www.npmjs.com/package/command-line-args
  const optionDefinitions: Array<CLA.ArgDescriptor> = [
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
  let options: any;
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



