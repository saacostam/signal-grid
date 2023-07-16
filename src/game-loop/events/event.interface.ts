import {Agent} from "../../agents";
import {DIRECTION} from "../../models";

export interface InteractionEvent{
    origin: Agent;
    target: Agent;
    direction: DIRECTION;
}