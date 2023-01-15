import { useState } from "react";

function SnakeSegment({ position, step, index }: any) {
    return <div style={{
        width: '20px',
        height: '20px',
        backgroundColor: '#eab676',
        textAlign: 'center',
        'position': 'absolute',
        left: position[0]*step+'px',
        top: position[1]*step+'px',
    }}></div>
}
function Snake(props: any) {
    const { snake, step } = props;
    return <>
    {snake.map((segment: number[], i: number) => <SnakeSegment position={segment} step={step} key={i} index={i} />)}
    </>
}

export default Snake;