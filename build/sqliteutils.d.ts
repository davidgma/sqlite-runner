export declare class SqliteUtils {
    private _file_path;
    results: Array<string>;
    private _variables;
    private _open_with;
    constructor(file_path: string, open_with?: string);
    hello(): void;
    process_file(): Promise<number>;
}
