export class RuntimeError extends Error{
    constructor(msg: string) {
        super(`Error in game runtime: ${msg}`);
    }
}