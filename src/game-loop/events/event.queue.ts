import {InteractionEvent} from "./event.interface.ts";
import {ClickEvent} from "./click.event.ts";

export class EventQueue{
    inputEvents: ClickEvent[] = [];
    interactionEvents: InteractionEvent[] = [];

    add(input: InteractionEvent | ClickEvent){
        if (input instanceof ClickEvent) this.inputEvents.push(input);
        else this.interactionEvents.push(input);
    }

    pop(): ClickEvent | InteractionEvent | undefined{
        if (this.inputEvents.length > 0) return this.inputEvents.shift();
        if (this.interactionEvents.length > 0 ) return this.interactionEvents.shift();
    }

    isEmpty(){
        return (this.inputEvents.length === 0 && this.interactionEvents.length === 0);
    }
}