import {ClickEvent, EventQueue, Game, TransferEvent} from "../game-loop";
import {Agent, Tile} from "../agents";
import {CANVAS_PARAMS, GAME_PARAMS} from "../params";
import {InputError, SetupError} from "../errors";
import {DIRECTION} from "../models";

export class ClickHandler{
    constructor(private canvas: HTMLCanvasElement, private eventQueue: EventQueue, readonly agents: Agent[], readonly game: Game) {
        this.canvas.addEventListener('click', (e) => {
            const {offsetX, offsetY} = e;

            const TILE_WIDTH = CANVAS_PARAMS.WIDTH/GAME_PARAMS.COLUMNS;
            const TILE_HEIGHT = CANVAS_PARAMS.HEIGHT/GAME_PARAMS.ROWS;

            const x = Math.floor( offsetX/TILE_WIDTH)*(TILE_WIDTH);
            const y = Math.floor( offsetY/TILE_HEIGHT)*(TILE_HEIGHT);

            const AGENT = this.agents.find(AGENT => AGENT.x === x && AGENT.y === y);
            if (!AGENT) throw new InputError('Click does not match with an element on screen!');
            this.eventQueue.add(new ClickEvent(AGENT));

            this.startFlow();

            if (game.isGameOver) return game.start();
        })
    }

    startFlow(){
        this.agents.forEach(AGENT => {
            if (AGENT instanceof Tile) AGENT.disconnect();
        })

        const SOURCE = this.agents.find(AGENT => AGENT.x === 0 && AGENT.y === 0);
        if (!SOURCE) throw new SetupError('Source element not found in expected position');
        this.eventQueue.add(new TransferEvent(SOURCE, SOURCE, DIRECTION.NONE, this.agents, new Set<Agent>));
    }

    randomize(){
        for (let i = 0; i < GAME_PARAMS.RPI; i++){
            const AGENT = this.agents[Math.ceil(Math.random() * this.agents.length)];
            if (AGENT instanceof Tile){
                if (!AGENT.isConnected){
                    Math.random() < 0.5 ? AGENT.rotate() : AGENT.backRotate();
                }
            }
        }
        this.startFlow();
    }
}