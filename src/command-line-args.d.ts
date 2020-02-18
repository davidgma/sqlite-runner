declare namespace CLA {
  interface ArgDescriptor {
	name: string;
	// type: Object;
	alias?: string;
	description?: string;
	defaultOption?: boolean;
	defaultValue?: any;
	type: (val: string) => any;
	multiple?: boolean;
  }

}

declare module 'command-line-args' {
  function commandLineArgs(args: CLA.ArgDescriptor[]): any;
  export = commandLineArgs; 
}


