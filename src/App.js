import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SnakeLadder from './SnakeLadder'; // Import SnakeLadder game component
import Home from './Home'; // Home screen with the game launcher

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Main launcher */}
        <Route path="/snake-ladder" element={<SnakeLadder />} /> {/* Snake & Ladder game */}
      </Routes>
    </Router>
  );
}

export default App;
