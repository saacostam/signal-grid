import {DIRECTION, ORDERED_DIRECTIONS} from "../models";
export class DirectionUtil{
    static reverseDirection(direction: DIRECTION){
        return ORDERED_DIRECTIONS[(direction + 2)%4];
    }
}