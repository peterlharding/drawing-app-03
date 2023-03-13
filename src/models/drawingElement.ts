
import {Position} from './position'

export interface DrawingElement {
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: string,
    position?: Position
}
