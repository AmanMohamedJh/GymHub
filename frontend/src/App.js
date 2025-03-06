import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  <div class="App">
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route>path="/" element={<Home />}</Route>
        </Routes>
      </div>
    </BrowserRouter>
  </div>;
}

export default App;
