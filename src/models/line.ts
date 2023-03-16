
export interface Line {
    x1: number;
    y1: number;
    x2: number
    y2: number;
}

// or...

import {Point} from './point'

export interface LineAsPoints {
    start: Point,
    end: Point
}
