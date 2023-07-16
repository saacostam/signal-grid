import {InteractionEvent} from "./event.interface.ts";
import {Agent} from "../../agents";
import {DIRECTION} from "../../models";

export class TransferEvent implements InteractionEvent{
    visited: Set<Agent>;
    constructor(
        readonly origin: Agent,
        readonly target: Agent,
        readonly direction: DIRECTION,
        readonly agents: Agent[],
        visited: Set<Agent>,
    ) {
        this.visited = visited;
    }
}