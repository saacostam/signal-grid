import {Agent, SideFlow} from "./agent.interface.ts";
import {COORDINATES, DIRECTION, ORDERED_DIRECTIONS, ROTATION} from "../models";
import {AcceptEvent, ClickEvent, InteractionEvent, TransferEvent} from "../game-loop";
import {COLOR} from "../params";
import {GridHandler} from "../handler";
import {DirectionUtil} from "../util";
import {Source} from "./source.agent.ts";

export class Tile implements Agent{
    rotation: ROTATION;
    isConnected: boolean = false;

    constructor(readonly x: number, readonly y: number, readonly width: number, readonly height: number, readonly sides: SideFlow[], rotation: ROTATION = ROTATION.DEGREES_0) {
        this.rotation = rotation;
        this.generalRotate(rotation);
    }

    draw(ctx: CanvasRenderingContext2D){
        const centerX = this.x + (this.width / 2);
        const centerY = this.y + (this.height / 2);
        const radius = this.width/6;
        const color = this.isConnected ? COLOR.ON : COLOR.OFF;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();

        this.sides.forEach(
            SIDE_FLOW => {
                const DELTA = SIDE_FLOW.hasFlow ? this.width/2 : this.width/4;
                let TIP;

                switch (SIDE_FLOW.side){
                    case DIRECTION.DOWN:
                        TIP = new COORDINATES(centerX, centerY+DELTA);
                        break;
                    case DIRECTION.RIGHT:
                        TIP = new COORDINATES(centerX+DELTA, centerY);
                        break;
                    case DIRECTION.UP:
                        TIP = new COORDINATES(centerX, centerY-DELTA);
                        break;
                    case DIRECTION.LEFT:
                        TIP = new COORDINATES(centerX-DELTA, centerY);
                        break;
                }

                if (!TIP) return;

                ctx.lineWidth = this.width/5;
                ctx.strokeStyle = color;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(TIP.x, TIP.y);
                ctx.stroke();
            }
        )


    }

    update(event: ClickEvent | InteractionEvent){
        if (event instanceof  ClickEvent){
            this.rotate();
        }else if (event instanceof TransferEvent){
            const {agents, visited, direction, origin} = event;

            const newEvents: InteractionEvent[] = []

            // ACCEPT EVENTS TO ORIGIN
            const SIDE_FLOW = this.sides.find(SIDE_FLOW => SIDE_FLOW.side === direction);
            if (!SIDE_FLOW) return;

            SIDE_FLOW.hasFlow = true;
            this.isConnected = true;
            visited.add(this);

            newEvents.push( new AcceptEvent(this, origin, DirectionUtil.reverseDirection(direction)) );

            // TRANSFER EVENTS TO NEIGHBORS
            const gridHandler = new GridHandler(agents);
            const neighbors = gridHandler.findNeighbors(this.x, this.y);

            neighbors.forEach(NEIGHBOR => {
                if (NEIGHBOR.target instanceof Source) return;
                if (NEIGHBOR.target instanceof Tile && NEIGHBOR.target.isConnected) return;

                const match = ( this.sides.find(SF => SF.side === DirectionUtil.reverseDirection(NEIGHBOR.direction)) )
                if (!match) return;

                newEvents.push( new TransferEvent(this, NEIGHBOR.target, NEIGHBOR.direction, agents, visited) );
            });

            return newEvents;
        }else if (event instanceof AcceptEvent){
            const { direction } = event;
            const SIDE_FLOW = this.sides.find(SF => SF.side === direction);
            if (!SIDE_FLOW) return;
            SIDE_FLOW.hasFlow = true;
        }
    }

    disconnect(){
        this.isConnected = false;
        this.sides.forEach(SIDE => SIDE.hasFlow = false);
    }

    rotate(){
        this.generalRotate(1);
    }

    backRotate(){
        this.generalRotate(-1);
    }

    private generalRotate(delta: number){
        this.rotation +=delta ;
        this.sides.forEach(SIDE => SIDE.side = (SIDE.side + delta + ORDERED_DIRECTIONS.length)%ORDERED_DIRECTIONS.length);
    }
}
