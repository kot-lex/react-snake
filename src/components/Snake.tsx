import './Snake.css';

type SnakeSegmentProps = {
    position: number[],
    step: number,
}

function SnakeSegment({ position, step }: SnakeSegmentProps) {
    return <div className="SnakeSegment" style={{
        width: step+'px',
        height: step+'px',
        left: position[0]*step+'px',
        top: position[1]*step+'px',
    }}></div>
}

type SnakeProps = {
    snake: number[][],
    step: number
};

function Snake(props: SnakeProps) {
    const { snake, step } = props;
    return <>
    {snake.map((segment, i) => <SnakeSegment position={segment} step={step} key={i} />)}
    </>
}

export default Snake;