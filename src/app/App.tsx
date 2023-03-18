

import Container from 'react-bootstrap/Container'

import Canvas from '../components/Canvas'
import {Rectangle} from '../models/rectangle'

import './App.css'

// ---------------------------------------------------------------------------

const App = () => {

    const targets: Rectangle[] = [{x: 100, y: 100, width: 200, height: 200}, {x: 500, y: 400, width: 150, height: 100}]
    
    return (
        <Container>
            <Canvas targets={targets} width={1000} height={1000} />
        </Container>
    );
}

// ---------------------------------------------------------------------------

export default App

// ---------------------------------------------------------------------------
