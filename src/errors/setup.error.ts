export class SetupError extends Error{
    constructor(msg: string) {
        super(`Error in game setup: ${msg}`);
    }
}