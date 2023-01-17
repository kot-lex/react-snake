import { useEffect, useState } from 'react';
import useKeyPress from '../../useKeyPress';
import './Game.css';
import Info from '../Info/Info';
import Snake from '../Snake/Snake';
import Target from '../Target/Target';
import { checkForHit, DIRECTIONS, getTargetPosition, moveSnake, Snake as SnakeType } from './helpers';

type CrashedProps = {
    onRestart: () => void
}
export const Crashed = (props: CrashedProps) => {
    const enterPressed = useKeyPress('Enter');
    useEffect(() => {
        if (enterPressed) {
            props.onRestart();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enterPressed]);
    return <div className="Crashed">
        <h2>Crashed 🔥</h2>
        <button onClick={props.onRestart}>Start again</button>
    </div>
}

export const StartInfo = () => {
    return (<div className="StartInfo">
        Press arrow key to start
    </div>)
}

const Game = () => {
    // Field size
    const size = [30, 30];
    // Snake step in pixels
    const step = 20;
    // Delay between steps in ms
    const initialSpeed = 200;
    const leftPressed: boolean = useKeyPress('ArrowLeft', true);
    const rightPressed: boolean = useKeyPress('ArrowRight', true);
    const upPressed: boolean = useKeyPress('ArrowUp', true);
    const downPressed: boolean = useKeyPress('ArrowDown', true);
    
    const moveTo = (leftPressed && DIRECTIONS.LEFT) ||
    (rightPressed && DIRECTIONS.RIGHT) ||
    (upPressed && DIRECTIONS.UP) ||
    (downPressed && DIRECTIONS.DOWN) || null;

    const initialSnake = [[0, 0]]
    const [snake, setSnake] = useState(initialSnake);
    const [score, setScore] = useState(0);
    const [isCrash, setIsCrash] = useState(false);
    const [direction, setDirection] = useState<number | null>(null);
    const [speed, setSpeed] = useState<number>(initialSpeed)
    const [targetPosition, setTargetPosition] = useState(getTargetPosition(size, snake));

    const processHit = (newSnake: SnakeType) => {
        setTargetPosition(getTargetPosition(size, newSnake));
        setSpeed(initialSpeed / Math.ceil((score+1)/10));
        setScore(score+1);
            
    }

    const restartHandler = () => {
        setScore(0);
        setSpeed(initialSpeed);
        setSnake(initialSnake);
        setTargetPosition(getTargetPosition(size, initialSnake));
        setIsCrash(false);
    }

    useEffect(() => {
        if (isCrash) {
            return;
        }
        if (moveTo !== null) {
            // check if direction is allowed one (cannot move in the opposite direction)
            if (direction && (Math.abs(direction) === Math.abs(moveTo))) {
                return;
            }
            
            setDirection(moveTo);
            
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moveTo]);

    useEffect(() => {
        const doMove = () => {
            let newSnake = moveSnake(direction, snake, size, step, targetPosition);

            const isHit = checkForHit(newSnake, targetPosition);
            if (isHit) {
                processHit(newSnake);
            }
            if (newSnake) {
                setSnake(newSnake);
            } else {
                setIsCrash(true)
            }
        }
        if (direction) {
            doMove();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [direction]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const doMove = () => {
            let newSnake = moveSnake(direction, snake, size, step, targetPosition);

            const isHit = checkForHit(newSnake, targetPosition);
            if (isHit) {
                processHit(newSnake);
            }

            if (newSnake) {
                setSnake(newSnake);
            } else {
                setIsCrash(true)
            }
            
        }
        if (direction) {
            timeout = setTimeout(() => doMove(), speed);
        }
        return () => { clearTimeout(timeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snake]);

    useEffect(() => {
        if(isCrash) {
            setDirection(null);
        }
    }, [isCrash])
    return <div className="Game" style={{
        width: step*size[0],
        height: step*size[1],
    }}>
        <Snake step={step} snake={snake} />
        <Target step={step} position={targetPosition} />
        <Info score={score} />
        {!isCrash && !direction && <StartInfo />}
        {isCrash && <Crashed onRestart={restartHandler} /> }
    </div>
}

export default Game;
