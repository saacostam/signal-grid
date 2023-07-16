import './style.css'
import {Game} from "./game-loop";
import {SetupError} from "./errors";
import {CANVAS_PARAMS} from "./params";

const app = document.getElementById('app');
if (!app) throw  new SetupError('No app div was found!');

const canvas = document.createElement('canvas');
canvas.width = CANVAS_PARAMS.WIDTH;
canvas.height = CANVAS_PARAMS.HEIGHT;
if (!canvas) throw new SetupError('No canvas element was found!');

app.append(canvas);
new Game(canvas);