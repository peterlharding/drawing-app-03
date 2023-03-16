import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

import logo from '../assets/img/logo.svg'

import Container from 'react-bootstrap/Container'

import {Point} from '../models/point'
import {PairOfPoints} from '../models/pairOfPoints'
import {DrawingElement} from '../models/drawingElement'
import {Position} from '../models/position'
import {Rectangle} from '../models/rectangle'
import {Circle} from '../models/circle'

// ---------------------------------------------------------------------------

interface Props {
    targets: Rectangle[];
}

// ---------------------------------------------------------------------------

const Canvas = ({targets}: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [action, setAction] = useState('none');
    const [tool, setTool] = useState('rectangle');
    const [selectedElement, setSelectedElement] = useState<DrawingElement|null>(null);
    const [mouseDownPoint, setMouseDownPoint] = useState<Point|null>(null)
    // const [mouseUpPoint, setMouseUpPoint] = useState<Point|null>(null)
    // const [mousePoint, setMousePoint] = useState<Point|null>(null)
    const [lineType, setLineType] = useState('solid')

    const sampleImage = '../assets/img/sample-1.png';

    // -----------------------------------------------------------------------

    const createElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: string): DrawingElement => {

        console.log(`createElement - id ${id} : x1 ${x1} y1 ${y1} x2 ${x2} y2 ${y2} - ${type}`)

        return {id, x1, y1, x2, y2, type}
    }

    // -----------------------------------------------------------------------

    // const createCircle = (id: number, x: number, y: number, radius: number): DrawingElement => {

    //     console.log(`createCircle - id ${id} : center.x ${x} center.y ${y} radius ${radius}`)

    //     const circle: Circle = {x, y, radius}

    //     return {id, circle, type: 'circle'}
    // }

    // -----------------------------------------------------------------------

    useEffect(() => {
        const newElements = targets.map((target, index) => (
            createElement(index, target.x, target.y, target.x + target.width, target.y + target.height, 'rectangle')
        ))
        setElements(newElements)
    }, [targets])

    // -----------------------------------------------------------------------
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

    useLayoutEffect(() => {
        const canvas  = canvasRef.current;

        if (canvas && (canvas instanceof HTMLCanvasElement)) {
            const context = canvas.getContext('2d');

            const backgroundImage = new Image();

            // backgroundImage.src = '../assets/img/english-countryside.jpg'    // 'https://www.w3schools.com/tags/img_the_scream.jpg' // 'https://performiq.com/img/logo2.gif' // '../assets/img/sample-1.png'
            // backgroundImage.src = 'https://wallpapercave.com/wp/pf3xWQ5.jpg' // 'https://performiq.com/img/logo2.gif' // '../assets/img/sample-1.png'

            if (context !== null) {
                context.clearRect(0, 0, canvas.width, canvas.height)
                context.drawImage(backgroundImage, 0, 0);
                context.fillStyle = 'green';
                elements.forEach((element) => draw(context, element))
            }
        }
    }, [elements])


    // -----------------------------------------------------------------------
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes

    const draw = (context: CanvasRenderingContext2D, element: DrawingElement) => {
        const {type} = element
        switch (lineType) {
            case 'solid': {
                context.setLineDash([])
                break
            }
            case 'dashed': {
                const segments = [1, 2, 1]
                context.setLineDash(segments)
                break
            }
            default:
                context.setLineDash([])
                break
        }
        if (element) {
            switch (element.type) {
                case 'rectangle': {
                    const width = element.x2 - element.x1
                    const height = element.y2 - element.y1
                    context.strokeRect(element.x1, element.y1, width, height)
                    break
                }
                case 'line': {
                    context.beginPath();
                    context.moveTo(element.x1, element.y1)
                    context.lineTo(element.x2, element.y2);
                    // context.closePath();
                    context.stroke();
                    break
                }
                case 'crosshairs': {
                    const size = element.x2 - element.x1
    
                    context.beginPath();
                    context.moveTo(element.x1 - size, element.y1)
                    context.lineTo(element.x1 + size, element.y1)
                    context.moveTo(element.x1, element.y1 - size)
                    context.lineTo(element.x1, element.y1 + size)
                    context.stroke();
                    break
                }
            }
        }

        console.log(`draw - id: ${element.id} - x1 ${element.x1} y1 ${element.y1} x2 ${element.x2} y2 ${element.y2} - ${element.type}`)
    }

    // -----------------------------------------------------------------------

    const distance = (a: Point, b: Point): number => 
        Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

    // -----------------------------------------------------------------------

    const isWithinElement = (
            x: number,
            y: number,
            element: DrawingElement) => {

        const {type, x1, x2, y1, y2} = element

        switch (type) {
            case 'rectangle': {
                const minX = Math.min(element.x1, element.x2)
                const maxX = Math.max(element.x1, element.x2)
                const minY = Math.min(element.y1, element.y2)
                const maxY = Math.max(element.y1, element.y2)
                return x >= minX && x <= maxX && y >= minY && y <= maxY
            }
            default: {
                const a: Point = {x: x1, y: y1}
                const b: Point = {x: x2, y: y2}
                const c: Point = {x, y}
                const offset: number = distance(a, b) - (distance(a, c) + distance(b, c))
                return Math.abs(offset) < 1
            }          
        }
    }
    

    // -----------------------------------------------------------------------

    const nearPoint = (
        x: number,
        y: number,
        x1: number,
        y1: number,
        name: string) => {
        return (Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5) ? name : null
    }

    // -----------------------------------------------------------------------

    const positionWithinElement = (
            x: number,
            y: number,
            element: DrawingElement): string|null => {

        const {type, x1, y1, x2, y2} = element

        switch (type) {
            case 'rectangle': {
                const topLeft = nearPoint(x, y, x1, y1, 'tl')
                const topRight = nearPoint(x, y, x2, y1, 'tr')
                const bottomLeft = nearPoint(x, y, x1, y2, 'bl')
                const bottomRight = nearPoint(x, y, x2, y2, 'br')
                // return {x1: minX, y1: minY, x2: maxX, y2: maxY}
                const inside =  x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null
                return topLeft || topRight || bottomLeft || bottomRight || inside
            }
            case 'line': {
                const a: Point = {x: x1, y: y1}
                const b: Point = {x: x2, y: y2}
                const c: Point = {x, y}
                const offset: number = distance(a, b) - (distance(a, c) + distance(b, c))
                const start = nearPoint(x, y, x1, y1, 'start')
                const end = nearPoint(x, y, x2, y2, 'end')
                const inside =  Math.abs(offset) < 1 ? 'inside' : null
                return start || end || inside
            }
            case 'crosshairs': {
                const size = x2 - x1
                const inside =  x >= x1 - size && x <= x1 + size && y >= y1 - size && y <= y1 + size ? "inside" : null
                return inside
            }
            default:
                return null
        }

    }

    // -----------------------------------------------------------------------

    const getElementAtPosition = (
            x: number,
            y: number,
            elements: DrawingElement[]) => {

        return elements
                .map(element => ({...element, position: positionWithinElement(x, y, element)}))
                .find(element => element.position !== null)
    }

    // -----------------------------------------------------------------------

    const adjustElementCoordinates = (element: DrawingElement) => {
        const {type, x1, y1, x2, y2} = element

        switch (type) {
            case 'rectangle': {
                const minX = Math.min(x1, x2)
                const maxX = Math.max(x1, x2)
                const minY = Math.min(y1, y2)
                const maxY = Math.max(y1, y2)
                return {x1: minX, y1: minY, x2: maxX, y2: maxY}
            }
            case 'line': {
                if (x1 < x2 || x1=== x2 && y1 < y2) {
                    return {x1,y1, x2, y2}
                } else {
                    return {x2, y2, x1, y1}
                }
            }
            case 'crosshairs': {
                return {x1, y1, x2, y2}
            }
            default: {
                return {x1: 10, y1: 10, x2: 20, y2: 20}
            }
        }
    }


    // -----------------------------------------------------------------------

    const updateElement = (
            id: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            type: string) => {

        const updatedElement = createElement(id, x1, y1, x2, y2, type)

        console.log(`updateElement - id ${id}  x1 ${x1} y1 ${y1} x2 ${x2} y2 ${y2}`)

        const elementsCopy: DrawingElement[] = [...elements]

        elementsCopy[id] = updatedElement

        setElements(elementsCopy)
    }

    // -----------------------------------------------------------------------

    const cursorForPosition = (position: Position) => {
        switch (position) {
            case 'tl':
            case 'br':
            case 'start':
            case 'end':
                return 'nwse-resize'
            case 'tr':
            case 'bl':
                return 'nesw-resize'
            default:
                return "move"
        }
    }

    // -----------------------------------------------------------------------

    const resizeCoordinates = (
            clientX: number,
            clientY: number,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            position: Position): PairOfPoints|null => {

        let tl: Point
        let br: Point

        console.log(`resizeCoordinates: position |${position}|`)

        switch (position) {
            case 'tl':
            case 'start':
                tl = {x: clientX, y: clientY}
                br = {x: x2, y: y2}
                return {topLeft: tl, bottomRight: br}
            case 'tr':
                tl = {x: x1, y: clientY}
                br = {x: clientX, y: y2}
                return {topLeft: tl, bottomRight: br}
            case 'bl':
                tl = {x: clientX, y: y1}
                br = {x: x2, y: clientY}
                return {topLeft: tl, bottomRight: br}
            case 'br':
            case 'end':
                tl = {x: x1, y: y1}
                br = {x: clientX, y: clientY}
                return {topLeft: tl, bottomRight: br}
            default:
                return null
        }
    }

    // -----------------------------------------------------------------------

    const mouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {

        const {clientX, clientY} = event;
        const point: Point = {x: clientX, y: clientY}

        setMouseDownPoint(point)

        console.log(`Down ${point.x} ${point.y} - Tool ${tool}`)

        if (tool === 'selection') {
            // If we are on an element
            const element = getElementAtPosition(point.x, point.y, elements)

            if (element) {
                setSelectedElement(element)
                console.log(JSON.stringify(element))
                if (element.position === 'inside') {
                    console.log('Moving...')
                    setAction('moving')
                } else {
                    console.log('resizing...')
                    setAction('resizing')
                }
            }
        } else {
            const id = elements.length

            const element = createElement(id, point.x, point.y, point.x, point.y, tool);
            
            setElements(prevState => [...prevState, element]);

            console.log('drawing...')

            setAction('drawing');
        }
    }

    // -----------------------------------------------------------------------

    const mouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {

        const {clientX, clientY} = event

        const point: Point = {x: clientX, y: clientY}

        // setMousePoint(point)

        if (tool === 'selection') {
            const element = getElementAtPosition(clientX, clientY, elements)
            // console.log(JSON.stringify(element))
            if (element) {
                // setSelectedElement(element)
                const cursor = cursorForPosition(element.position)
                // console.log(cursor)
                event.currentTarget.style.cursor = cursor
            } else {
                event.currentTarget.style.cursor = "default"  
            }
        }

        if (!action || (action == '')) {
            return;
        }

        switch (action) {

            case 'drawing': {

                const index = elements.length - 1

                const {x1, y1} = elements[index]

                updateElement(index, x1, y1, clientX, clientY, tool)

                break
            }

            case 'moving': {

                // event.currentTarget.style.cursor = "move"

                if (selectedElement !== null) {
                    const {id, x1, y1, x2, y2, type} = selectedElement

                    const width = x2 - x1
                    const height = y2 - y1
    
                    if (mouseDownPoint) {
                        const deltaX = clientX - mouseDownPoint.x
                        const deltaY = clientY - mouseDownPoint.y

                        if ((Math.abs(deltaX) >= 2) && (Math.abs(deltaY) >= 2)) {
                            console.log(`moving - Mouse Down    (${mouseDownPoint.x}, ${mouseDownPoint.y})`)
                            console.log(`moving - Mouse Current (${clientX}, ${clientY})`)
                            console.log(`moving - Delta         (${deltaX}, ${deltaY})`)
                            console.log(`moving - x1 ${x1} y1 ${y1} x2 ${x2} y2 ${y2}`)
          
                            updateElement(id, selectedElement.x1 + deltaX, selectedElement.y1 + deltaY, selectedElement.x2 + deltaX, selectedElement.y2 + deltaY, type)
    
                            // const point: Point = {x: clientX, y: clientY}
    
                            // setMouseDownPoint(point)    
                        }
                    }
                }
                break
            }

            case 'resizing': {
                if (selectedElement !== null) {
                    const {id, type, position, x1, y1, x2, y2} = selectedElement

                    console.log(`resizing - x1 ${x1} y1 ${y1} x2 ${x2} y2 ${y2}`)

                    const points = resizeCoordinates(clientX, clientY, x1, y1, x2, y2, position)
                    if (points) {
                        const {topLeft, bottomRight} = points
                        console.log(`resizing - topLeft (${topLeft.x}, ${topLeft.y}) bottomRight (${bottomRight.x}, ${bottomRight.y})`)

                        updateElement(id, topLeft.x, topLeft.y, bottomRight.x, bottomRight.y, type)
                    }

                }
                break
            }

            default:
                break
        }
    }

    // -----------------------------------------------------------------------

    const mouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const {clientX, clientY} = event;
        const point: Point = {x: clientX, y: clientY}
        // setMouseUpPoint(point)

        const index = selectedElement?.id
        if (index !== undefined) {
            const {id, type} = elements[index]
            if (action === 'drawing' || action === 'moving' || action === 'resizing') {
                const element = elements[index]
                console.log(`mouseUp - Before adjust - x1 ${element.x1} y1 ${element.y1} x2 ${element.x2} y2 ${element.y2}`)
                const {x1, y1, x2, y2} = adjustElementCoordinates(elements[index])
                console.log(`mouseUp - After adjust  - x1 ${x1} y1 ${y1} x2 ${x2} y2 ${y2}`)
                // updateElement(id, x1, y1, x2, y2, type)
            }
        }
        setAction('none')
        setSelectedElement(null)
        event.currentTarget.style.cursor = "default"
        setTool('selection')
    }

    // -----------------------------------------------------------------------

    const onLoad = () => {
        setAction('none')
        setSelectedElement(null)
    }

    // -----------------------------------------------------------------------

    const info = () => {
        return (
            <span>
                <input type='text'
                    id='down-point'
                    readOnly
                    size={20}
                    value={mouseDownPoint ? `{x: ${mouseDownPoint.x}, y: ${mouseDownPoint.y}}` : 'None'}
                />
                <label htmlFor='down-point' style={{paddingLeft: '5px'}}>Mouse Down&nbsp;&nbsp;</label>
                <input type='text'
                    id='element'
                    readOnly
                    size={40}
                    value={selectedElement ? `{id: ${selectedElement.id}, x1: ${selectedElement.x1}, y1: ${selectedElement.y1}, x2: ${selectedElement.x2}, y2: ${selectedElement.y2}}` : 'None'}
                />
                <label htmlFor='element' style={{paddingLeft: '5px'}}>Element&nbsp;</label>
            </span>
        )
    }

    // -----------------------------------------------------------------------

    const setLineFeatures = () => {
        return (
            <span>
                <input type='radio'
                    id='solid'
                    checked={lineType === 'solid'}
                    onChange={() => setLineType('solid')}
                />
                <label htmlFor='solid'>Solid&nbsp;&nbsp;</label>
                <input type='radio'
                    id='dashed'
                    checked={lineType === 'dashed'}
                    onChange={() => setLineType('dashed')}
                />
                <label htmlFor='dashed'>Dashed</label>
            </span>
        )

    }

    // -----------------------------------------------------------------------

    const pickTool = () => {
        return (
            <div style={{position: 'fixed'}}>
            <input type='radio'
                id='line'
                checked={tool === 'selection'}
                onChange={() => setTool('selection')}
            />
            <label htmlFor='selection'>Selection&nbsp;&nbsp;</label>

            <input type='radio'
                id='line'
                checked={tool === 'line'}
                onChange={() => setTool('line')}
            />
            <label htmlFor='line'>Line&nbsp;&nbsp;</label>

            <input type='radio'
                id='rectangle'
                checked={tool === 'rectangle'}
                onChange={() => setTool('rectangle')}
            />
            <label htmlFor='rectangle'>Rectangle&nbsp;&nbsp;</label>

            <input type='radio'
                id='crosshairs'
                checked={tool === 'crosshairs'}
                onChange={() => setTool('crosshairs')}
            />
            <label htmlFor='crosshairs'>Cross Hairs&nbsp;&nbsp;</label>

        </div>
        )
    }

    // -----------------------------------------------------------------------

    return (
        <div>
            {pickTool()}
            {/* {setLineFeatures()} */}
            {/* {info()} */}
                <canvas 
                    id='canvas'
                    ref={canvasRef}
                    style={{backgroundColor: '#e0e0e0'}}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={mouseDown}
                    onMouseMove={mouseMove}
                    onMouseUp={mouseUp}
                    onLoad={onLoad}
                >
                    Canvas
                </canvas>
        </div>
    );


}

// ---------------------------------------------------------------------------

export default Canvas

// ---------------------------------------------------------------------------
// Notes
//
//  * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
//  * https://www.youtube.com/watch?v=6arkndScw7A Building a Drawing App in React - Pt 1
//  * https://www.youtube.com/watch?v=IcfhcJrtJqI Building a Drawing App in React - Pt 2: Moving Elements
//
// and
//
//  * https://github.com/rough-stuff/rough/issues/145
//  * 

