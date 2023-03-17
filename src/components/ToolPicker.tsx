import React from "react";
import {ToolType} from "../models/drawingElement";

interface Props {
    tool: ToolType
    setTool: (toolType: ToolType) => void
}

const ToolPicker: React.FC<Props> = ({tool, setTool}) => {
    return (
        <div style={{position: 'fixed'}}>
            <input type='radio'
                   id='line'
                   checked={tool === 'selection'}
                   onChange={() => setTool('selection')}/>
            <label htmlFor='selection'>Selection&nbsp;&nbsp;</label>

            <input type='radio'
                   id='line'
                   checked={tool === 'line'}
                   onChange={() => setTool('line')}/>
            <label htmlFor='line'>Line&nbsp;&nbsp;</label>

            <input type='radio'
                   id='rectangle'
                   checked={tool === 'rectangle'}
                   onChange={() => setTool('rectangle')}/>
            <label htmlFor='rectangle'>Rectangle&nbsp;&nbsp;</label>

            <input type='radio'
                   id='crosshairs'
                   checked={tool === 'crosshairs'}
                   onChange={() => setTool('crosshairs')}/>
            <label htmlFor='crosshairs'>Cross Hairs&nbsp;&nbsp;</label>
        </div>
    );
};

export default ToolPicker;
