import {Agent, SideFlow} from "./agent.interface.ts";
import {ROTATION} from "../models";
import {ClickEvent, InteractionEvent, TransferEvent} from "../game-loop";
import {COLOR} from "../params";
import {GridHandler} from "../handler";

export class Source implements Agent{
    rotation: ROTATION;

    constructor(readonly x: number, readonly y: number, readonly width: number, readonly height: number, readonly sides: SideFlow[], rotation: ROTATION = ROTATION.DEGREES_0) {
        this.rotation = rotation;
    }

    draw(ctx: CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.lineWidth = 0.1;
        ctx.fillStyle = COLOR.ON;
        ctx.roundRect(this.x, this.y, this.width, this.height, [0, this.width/3, this.width/3, this.width/3]);
        ctx.stroke();
        ctx.fill();
    }

    update(event: ClickEvent | InteractionEvent){
        if (event instanceof TransferEvent){
            const {agents, visited} = event;
            visited.add(this);

            const gridHandler = new GridHandler(agents);
            const neighbors = gridHandler.findNeighbors(this.x, this.y);

            const newEvents: InteractionEvent[] = neighbors.map(NEIGHBOR => new TransferEvent(this, NEIGHBOR.target, NEIGHBOR.direction, agents, visited));
            return newEvents;
        }
    }
}