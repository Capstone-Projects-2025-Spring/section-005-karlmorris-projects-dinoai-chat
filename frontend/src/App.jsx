import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from './layouts/Header';

function App() {

  return (
      <Router>
        <div className="min-h-screen">
          <Header />
          <main>
            <AppRoutes />
          </main>
        </div>
      </Router>
  )
}

export default App
