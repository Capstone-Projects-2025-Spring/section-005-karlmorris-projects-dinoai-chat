import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from './layouts/Header';
import Sidebar from "./layouts/SideBar";

function App() {
  return (
    <Router>
      <div className="drawer min-h-screen">

        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <Header />
          <main>
            <AppRoutes />
          </main>
        </div>

        <Sidebar />

      </div>
    </Router>
  );
}

export default App;

