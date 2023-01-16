type TargetProps = {
    position: number[],
    step: number;
}
const Target = (props: TargetProps) => {
    const { position, step } = props;
    return <div style={{
        width: step+'px',
        height: step+'px',
        backgroundColor: '#063970',
        position: 'absolute',
        left: position[0]*step+'px',
        top: position[1]*step+'px',
    }}></div>
}

export default Target;
