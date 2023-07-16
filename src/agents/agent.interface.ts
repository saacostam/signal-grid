import { InteractionEvent, ClickEvent } from "../game-loop";
import { DIRECTION, ROTATION } from "../models";

export interface Agent{
    draw: (ctx: CanvasRenderingContext2D) => void;
    update: (event: ClickEvent | InteractionEvent) => InteractionEvent | InteractionEvent[] | void;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: ROTATION;
    sides: SideFlow[];
}

export interface SideFlow{
    side: DIRECTION;
    hasFlow: boolean;
}