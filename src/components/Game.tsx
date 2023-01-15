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

const hasIntrersection = (snake: any, target: any)  => {
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
    const secondSegment = snake[1];
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

    if (isCrash || hasIntrersection(snake, newHeadPosition)) {
        return false;
    }

    // If target is not hit do not add element
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
    console.log('Game RENDERED');
    console.log('leftPressed', leftPressed);
    const moveTo = (leftPressed && DIRECTIONS.LEFT) ||
    (rightPressed && DIRECTIONS.RIGHT) ||
    (upPressed && DIRECTIONS.UP) ||
    (downPressed && DIRECTIONS.DOWN);

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

    console.log(moveTo);
    useEffect(() => {

    console.log(moveTo);

        if (moveTo !== false) {
            // check if direction is alloed one (cannot move in the opposite direction)
            if (direction && (Math.abs(direction) === Math.abs(moveTo))) {
                return;
            }
            console.log(moveTo);
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
            // timeout = setTimeout(() => doMove(), 1000);
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
            setScore(0);
            setDirection(null);
            setSpeed(initialSpeed);
            setSnake(initialSnake);
        }
    }, [isCrash])
    return <div className="Game" style={{
        width: step*size[0],
        height: step*size[1],
    }}>
        <Snake step={step} snake={snake} />
        <Target step={step} position={targetPosition} />
        <Info score={score} isCrash={isCrash} />
    </div>
}

export default Game;
