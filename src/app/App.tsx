

import Blank from '../components/Blank'
import Canvas from '../components/Canvas'
import {Rectangle} from '../models/rectangle'

import './App.css'

// ---------------------------------------------------------------------------

const App = () => {

    const targets: Rectangle[] = [{x: 100, y: 100, width: 200, height: 200}, {x: 300, y: 300, width: 100, height: 100}]
    
    return (
        <div className="App">
            <Canvas targets={targets} />
        </div>
    );
}

// ---------------------------------------------------------------------------

export default App

// ---------------------------------------------------------------------------
