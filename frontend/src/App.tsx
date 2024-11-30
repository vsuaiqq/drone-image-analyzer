import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Intro from './pages/Intro';
import Main from './pages/Main';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Intro />}/>
          <Route path='/main' element={<Main />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
