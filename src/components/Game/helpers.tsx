export const DIRECTIONS = {
    UP: 2,
    DOWN: -2,
    RIGHT: 1,
    LEFT: -1,
};

export type Snake = number[][] | false;
export const hasIntrersection = (snake: Snake, target: number[]): boolean  => {
    if (!snake) {
        return false;
    }

    return snake.some((item: number[]) => item[0] === target[0] && item[1] === target[1])
}

export function getTargetPosition(size: number[], snake: Snake): number[] {
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

export const checkForHit = (snake: Snake, target: number[]) => {
    if (!snake || !snake[0] || !target) {
        return false;
    }
    return (target[0] === snake[0][0]) && (target[1] === snake[0][1]);
}

export function moveSnake(direction: number | null, snake: number[][], fieldSize: number[], step: number, target: number[]): number[][] | false {
    const headPosition = snake[0];
    let newHeadPosition = snake[0];
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
            if (headPosition[0]+1>=fieldSize[0]) {
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
            if (headPosition[1]+1>=fieldSize[1]) {
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
