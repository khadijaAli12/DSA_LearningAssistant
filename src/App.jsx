// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import DSALearningPlatform from './DSALearningPlatform';
// import Topics from './pages/Topics';
// import Progress from './pages/Progress';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DSALearningPlatform />} />
      {/* <Route path="/topics" element={<Topics />} /> */}
      {/* <Route path="/progress" element={<Progress />} /> */}
    </Routes>
  );
}

export default App;
