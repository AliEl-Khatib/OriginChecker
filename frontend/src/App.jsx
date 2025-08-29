import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/Homepage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App
