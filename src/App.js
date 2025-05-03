import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SnakeLadder from './SnakeLadder';
import TicTacToe from './TicTacToe';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snake-ladder" element={<SnakeLadder />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
      </Routes>
    </Router>
  );
}

export default App;
