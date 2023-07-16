export class InputError extends Error{
    constructor(msg: string) {
        super(`Error in game input: ${msg}`);
    }
}