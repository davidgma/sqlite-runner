declare namespace CLA {
	class ArgDescriptor {
    name: string;
    // type: Object;
    alias?: string;
    description?: string;
    defaultValue?: any;
    type: (val: string) => any;
    multiple?: boolean;
}
}

