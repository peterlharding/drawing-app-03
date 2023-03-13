

import Blank from '../components/Blank'
import Canvas from '../components/Canvas'
import {Rectangle} from '../models/rectangle'

import './App.css'

// ---------------------------------------------------------------------------

const App = () => {

    const targets: Rectangle[] = []  // [{x1: 10, y1: 10, x2: 50, y2: 50}, {x1: 100, y1: 100, x2: 200, y2: 200}]
    
    return (
        <div className="App">
            <Canvas targets={targets} />
        </div>
    );
}

// ---------------------------------------------------------------------------

export default App

// ---------------------------------------------------------------------------
