import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SnakeLadder from './SnakeLadder';
import TicTacToe from './TicTacToe';
import ChessGame from './ChessGame'; 
import SnakeFood from './SnakeFood';
import StonePaperScissors from './StonePaperScissors'; 
import SudokuGame from './SudokuGame';
import DragonGame from './DragonGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snake-ladder" element={<SnakeLadder />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/chess" element={<ChessGame />} />
        <Route path="/snake-food" element={<SnakeFood />} />
        <Route path="/stone-paper-scissors" element={<StonePaperScissors />} /> 
        <Route path="/sudoku" element={<SudokuGame />} />
        <Route path="/dragon" element={<DragonGame />} />
      </Routes>
    </Router>
  );
}

export default App;
