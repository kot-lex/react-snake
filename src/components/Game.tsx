import { useEffect, useRef, useState } from 'react';
import useKeyPress from '../useKeyPress';
import './Game.css';
import Info from './Info';
import Snake from './Snake';
import Target from './Target';


const DIRECTIONS = {
    UP: 2,
    DOWN: -2,
    RIGHT: 1,
    LEFT: -1,
};

const Crashed = (props: any) => {
    return <div className="Crashed">
        <h2>Crashed 🔥</h2>
        <button onClick={props.onRestart}>Start again</button>
    </div>
}

const hasIntrersection = (snake: number[][], target: number[]): boolean  => {
    return snake.some((item: any) => item[0] === target[0] && item[1] === target[1])
}

function getTargetPosition(size: number[], snake: number[][]): number[] {
    const randonPoint = [
        Math.floor(Math.random() * size[0]),
        Math.floor(Math.random() * size[1])
    ];

    if (hasIntrersection(snake, randonPoint)) {
        return getTargetPosition(size, snake);
    } else {
    return randonPoint;
    }
        
}

const checkForHit = (snake:any, target:any) => {
    if (!snake[0] || !target) {
        return false;
    }
    return (target[0] === snake[0][0]) && (target[1] === snake[0][1]);
}

function moveSnake(direction: number | false, snake: number[][], size: number[], step: number, target: any): any {
    const headPosition = snake[0];
    let newHeadPosition: any;
    let isCrash = false;
    if (!direction) {
        return snake;
    }

    switch(direction) {
        case DIRECTIONS.LEFT:
            if (headPosition[0]-1<0) {
                isCrash = true;
            }

            newHeadPosition = [headPosition[0]-1, headPosition[1]];
        break;
        case DIRECTIONS.RIGHT:
            if (headPosition[0]+1>=size[0]) {
                isCrash = true;
            }
            
            newHeadPosition = [headPosition[0]+1, headPosition[1]];
        break;
        case DIRECTIONS.UP:
            if (headPosition[1]-1<0) {
                isCrash = true;
            }
            
            newHeadPosition = [headPosition[0], headPosition[1]-1];
        break;
        case DIRECTIONS.DOWN:
            if (headPosition[1]+1>=size[1]) {
                isCrash = true;
            }
            
            newHeadPosition = [headPosition[0], headPosition[1]+1];
        break;
    }

    // Crashed into wall or into snake itself
    if (isCrash || hasIntrersection(snake, newHeadPosition)) {
        return false;
    }

    // If target is not hit keep the same length
    if (!checkForHit([newHeadPosition], target)) {
        snake.pop();
    }
    return [newHeadPosition, ...snake];
}

const Game = () => {
    const size = [30, 30];
    const step = 20;
    const initialSpeed = 200;
    const leftPressed: boolean = useKeyPress('ArrowLeft');
    const rightPressed: boolean = useKeyPress('ArrowRight');
    const upPressed: boolean = useKeyPress('ArrowUp');
    const downPressed: boolean = useKeyPress('ArrowDown');
    
    const moveTo = (leftPressed && DIRECTIONS.LEFT) ||
    (rightPressed && DIRECTIONS.RIGHT) ||
    (upPressed && DIRECTIONS.UP) ||
    (downPressed && DIRECTIONS.DOWN) || null;

    const initialSnake = [[0, 0]]
    const [snake, setSnake] = useState(initialSnake);
    const [score, setScore] = useState(0);
    const [isCrash, setIsCrash] = useState(false);
    const [direction, setDirection] = useState<any>();
    const [speed, setSpeed] = useState<number>(initialSpeed)
    const [targetPosition, setTargetPosition] = useState(getTargetPosition(size, snake));

    const processHit = (newSnake: number[][]) => {
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
    }, [direction]);

    useEffect(() => {
        let timeout: any;
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
        {isCrash && <Crashed onRestart={restartHandler} /> }
    </div>
}

export default Game;
