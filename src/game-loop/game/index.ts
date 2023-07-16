import {Agent, Tile} from "../../agents";
import {SetupError} from "../../errors";
import {EventQueue, TransferEvent} from "../events";
import {CANVAS_PARAMS, COLOR, GAME_PARAMS} from "../../params";
import {ClickHandler, GridHandler} from "../../handler";
import {DIRECTION} from "../../models";

interface IGame{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    loop: () => void;
    update: () => void;
    draw: () => void;
    agents: Agent[];
    eventQueue: EventQueue;
    clickHandler: ClickHandler;
    isGameOver: boolean;
    start: () => void;
}

export class Game implements IGame{
    agents: Agent[] = [];
    ctx: CanvasRenderingContext2D;
    eventQueue: EventQueue;
    clickHandler: ClickHandler;
    isGameOver: boolean;

    constructor(readonly canvas: HTMLCanvasElement) {
        const context = this.canvas.getContext('2d');
        if (!context) throw new SetupError('Could not find a 2d canvas context!');
        this.ctx = context;

        this.eventQueue = new EventQueue();

        const gridHandler = new GridHandler(this.agents);
        this.agents = gridHandler.createAgents(CANVAS_PARAMS.WIDTH, CANVAS_PARAMS.HEIGHT);

        this.clickHandler = new ClickHandler(this.canvas, this.eventQueue, this.agents, this);

        const SOURCE = this.agents.find(AGENT => AGENT.x === 0 && AGENT.y === 0);
        if (!SOURCE) throw new SetupError('Source element not found in expected position');
        this.eventQueue.add(new TransferEvent(SOURCE, SOURCE, DIRECTION.NONE, this.agents, new Set<Agent>));

        this.isGameOver = false;

        this.loop();
    }

    update(){
        while (!this.eventQueue.isEmpty()){
            const event = this.eventQueue.pop();
            const responseEvent = event?.target.update(event);

            if (responseEvent && Array.isArray(responseEvent)){
                responseEvent.forEach( EVENT => this.eventQueue.add(EVENT) );
            }else if (responseEvent){
                this.eventQueue.add(responseEvent);
            }
        }
    }

    private clearCanvas(){
        this.ctx.clearRect(0, 0, CANVAS_PARAMS.WIDTH, CANVAS_PARAMS.HEIGHT);
    }

    draw(){
        this.clearCanvas();
        this.agents.forEach(AGENT => AGENT.draw(this.ctx));
    }

    loop(){
        this.update();
        this.draw();

        if (this.isTheEnd()){
            this.handleGameEnd();
        }else{
            if (GAME_PARAMS.RANDOM_MODE) this.clickHandler.randomize();
            window.requestAnimationFrame(this.loop.bind(this));
        }
    }

    isTheEnd(){
        const total = this.agents.reduce((prev, current) => {
            let delta = 0;
            if (current instanceof Tile) delta = current.isConnected ? 1 : 0;
            return prev + delta;
        }, 0);

        return total === (GAME_PARAMS.COLUMNS*GAME_PARAMS.ROWS -1);
    }

    private handleGameEnd(){
        this.isGameOver = true;

        this.ctx.clearRect(0, 0, CANVAS_PARAMS.WIDTH, CANVAS_PARAMS.HEIGHT);
        this.ctx.font = '64px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = COLOR.ON;
        this.ctx.fillText('You Won!', this.canvas.width/2, this.canvas.height/2);

        this.ctx.font = '32px Arial';
        this.ctx.fillStyle = COLOR.OFF;
        this.ctx.fillText('Click to restart!', this.canvas.width/2, this.canvas.height*2/3);
    }

    start(){
        this.eventQueue = new EventQueue();

        const gridHandler = new GridHandler(this.agents);
        this.agents = gridHandler.createAgents(CANVAS_PARAMS.WIDTH, CANVAS_PARAMS.HEIGHT);

        this.clickHandler = new ClickHandler(this.canvas, this.eventQueue, this.agents, this);

        const SOURCE = this.agents.find(AGENT => AGENT.x === 0 && AGENT.y === 0);
        if (!SOURCE) throw new SetupError('Source element not found in expected position');
        this.eventQueue.add(new TransferEvent(SOURCE, SOURCE, DIRECTION.NONE, this.agents, new Set<Agent>));

        this.isGameOver = false;

        this.loop();
    }
}
