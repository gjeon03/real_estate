import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapView from "./Components/MapView";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapView />} />
      </Routes>
    </Router>
  );
}

export default App;