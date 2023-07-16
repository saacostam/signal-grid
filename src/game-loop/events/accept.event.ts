import {Agent} from "../../agents";
import {DIRECTION} from "../../models";
import {InteractionEvent} from "./event.interface.ts";

export class AcceptEvent implements InteractionEvent{
    constructor(readonly origin: Agent, readonly target: Agent, readonly direction: DIRECTION) {}
}