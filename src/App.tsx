import './App.css';
import Game from './components/Game';

function App() {
  return (
    <>
    <div className="AppHeader">
      <h1>Snake</h1>
      <p>
        Snake game written in react. <br />
        Source code <a href="https://github.com/kot-lex/react-snake">https://github.com/kot-lex/react-snake</a>
      </p>
    </div>
    <Game />
    </>
  );
}

export default App;
