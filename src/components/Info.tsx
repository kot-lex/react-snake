type InfoProps = {
    score: number
};

function Info({ score }: InfoProps) {
    return (<div style={{
        position: 'absolute',
        bottom: '-70px',
        
    }}>
        <h1>Score: {score}</h1>
    </div>)
}

export default Info;
