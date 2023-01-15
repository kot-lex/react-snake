function Info({ score, isCrash }: any) {
    return (<div style={{
        position: 'absolute',
        bottom: '-70px',
        
    }}>
        <h1>Score: {score}</h1>
        {isCrash && <h1>CRASH!</h1>}
    </div>)
}

export default Info;
