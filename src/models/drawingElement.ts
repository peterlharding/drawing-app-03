
import {Position} from './position'
import {Circle} from './circle'
import {Line} from './line'
import {Rectangle} from './rectangle'
import {Crosshairs} from './crosshairs'


export type ToolType = 'selection' | 'line' | 'rectangle' | 'crosshairs'

export interface DrawingElement {
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    // rectangle?: Rectangle,
    // line?: Line,
    // circle?: Circle,
    // crosshairs?: Crosshairs,
    type: string,
    position?: Position
}
