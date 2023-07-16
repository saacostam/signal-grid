import {DIRECTION, ORDERED_DIRECTIONS, ROTATION} from "../models";
import {Agent, SideFlow, Source, Tile} from "../agents";
import {CANVAS_PARAMS, GAME_PARAMS} from "../params";
import {RuntimeError} from "../errors";

interface FindNeighborOutput{
    target: Agent;
    direction: DIRECTION;
}

export class GridHandler {
    static neighborsMap = [
        // delta x, delta y
        // direction in which the target/neighbor receives the transfer
        // opposite to the (direction in which the target is relative to self/this)
        { x: 1, y: 0, targetReceivesFrom: DIRECTION.LEFT},
        { x: -1, y: 0, targetReceivesFrom: DIRECTION.RIGHT},
        { x: 0, y: 1, targetReceivesFrom: DIRECTION.UP},
        { x: 0, y: -1, targetReceivesFrom: DIRECTION.DOWN}
    ]

    columns: number = GAME_PARAMS.COLUMNS;
    rows: number = GAME_PARAMS.ROWS;
    width: number = CANVAS_PARAMS.WIDTH;
    height: number = CANVAS_PARAMS.HEIGHT;
    tileWidth: number = CANVAS_PARAMS.WIDTH/GAME_PARAMS.COLUMNS;
    tileHeight: number = CANVAS_PARAMS.HEIGHT/GAME_PARAMS.ROWS;

    constructor(readonly agents: Agent[]){}

    createAgents(width: number, height: number): Agent[]{
        const agents: Agent[] = [];
        const agentWidth = width/this.columns;
        const agentHeight = height/this.rows;

        for (let x = 0; x < width; x+=agentWidth){
            for (let y = 0; y < height; y += agentHeight){
                const AGENT = new Tile(x, y, agentWidth, agentHeight, this.randomSides(),
                [
                    ROTATION.DEGREES_0,
                    ROTATION.DEGREES_90,
                    ROTATION.DEGREES_180,
                    ROTATION.DEGREES_270,
                ][Math.floor(Math.random()*4)]);
                agents.push(AGENT);
            }
        }

        agents[0] = new Source(0, 0, agentWidth, agentHeight, []);
        return agents;
    }

    findNeighbors(x: number, y:number): FindNeighborOutput[]{
        const nx = x/this.tileWidth;
        const ny = y/this.tileHeight;
        const neighbors: FindNeighborOutput[] = [];

        GridHandler.neighborsMap.forEach(MAP => {
            const mx = (nx + MAP.x)*this.tileWidth;
            const my = (ny + MAP.y)*this.tileHeight;

            if (0 <= mx && mx < this.width && 0 <= my && my < this.height){
                const NEIGHBOR = this.agents.find( AGENT => AGENT.x === mx && AGENT.y === my)
                if (!NEIGHBOR) throw new RuntimeError('Trying to access undefined neighbor!');

                const payload: FindNeighborOutput = {
                    target: NEIGHBOR,
                    direction: MAP.targetReceivesFrom,
                }
                neighbors.push(payload);
            }
        })

        return neighbors;
    }

    randomSides(): SideFlow[]{
        let ret: SideFlow[] = [];

        const nSides = 2 + [0, 1][Math.floor(Math.random()*2)];
        for (let iter = 0; iter < nSides; iter++){
            let SIDE: DIRECTION|null = null;
            while (!SIDE || ret.find(SF => SF.side === SIDE)) SIDE = ORDERED_DIRECTIONS[Math.floor(Math.random()*ORDERED_DIRECTIONS.length)];

            const payload: SideFlow = {
                side: SIDE,
                hasFlow: false,
            };
            ret.push(payload);
        }

        return ret;
    }
}
