

import Blank from '../components/Blank'
import Canvas from '../components/Canvas'
import {Rectangle} from '../models/rectangle'

import './App.css'

// ---------------------------------------------------------------------------

const App = () => {

    const targets: Rectangle[] = [{x1: 100, y1: 100, x2: 200, y2: 200}, {x1: 300, y1: 300, x2: 400, y2: 400}]
    
    return (
        <div className="App">
            <Canvas targets={targets} />
        </div>
    );
}

// ---------------------------------------------------------------------------

export default App

// ---------------------------------------------------------------------------
