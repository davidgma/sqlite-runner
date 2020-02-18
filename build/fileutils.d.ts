export declare class FileUtils {
    constructor();
    hello(): void;
    static isFile(path: string): Promise<boolean>;
    static fullPath(path: string): Promise<string>;
    static isDirectory(path: string): Promise<boolean>;
    static readFile(path: string): Promise<Array<string>>;
    static writeFile(path: string, data: Array<string>): Promise<void>;
    static regex_extract(pattern: string, line: string): Array<string>;
    static tmpfile(): Promise<string>;
    static execute(sql_path: string, database_path: string): Promise<Array<string>>;
    static show_file(path: string, program: string): Promise<void>;
    static run_program(program?: string, args?: Array<string>): Promise<void>;
    static deleteIfExists(path: string): Promise<number>;
    static currentDirectory(): string;
}
