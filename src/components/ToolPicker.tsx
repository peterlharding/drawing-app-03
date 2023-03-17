import React from "react";

import Form from "react-bootstrap/Form";

import {ToolType} from "../models/drawingElement";

interface Props {
    tool: ToolType
    setTool: (toolType: ToolType) => void
}

const ToolPicker: React.FC<Props> = ({tool, setTool}) => {
    return (
        <div style={{position: 'fixed'}}>
            <Form.Check type='radio'
                        inline
                        id='line'
                        checked={tool === 'selection'}
                        label="Selection"
                        onChange={() => setTool('selection')}/>

            <Form.Check type='radio'
                        inline
                        id='line'
                        checked={tool === 'line'}
                        label="Line"
                        onChange={() => setTool('line')}/>

            <Form.Check type='radio'
                        inline
                        id='rectangle'
                        checked={tool === 'rectangle'}
                        label="RectangleX"
                        onChange={() => setTool('rectangle')}/>

            <Form.Check type='radio'
                        inline
                        id='crosshairs'
                        checked={tool === 'crosshairs'}
                        label="Cross Hairs"
                        onChange={() => setTool('crosshairs')}/>
        </div>
    );
};

export default ToolPicker;
