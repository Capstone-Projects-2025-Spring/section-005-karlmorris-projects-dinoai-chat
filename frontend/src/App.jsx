import {BrowserRouter as Router, useLocation} from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from './layouts/Header';
import Sidebar from "./layouts/SideBar";
import GlassBackground from "./components/GlassBackground";

function App() {

  const location = useLocation();

  let hideNavbar = false;
  if(location.pathname === '/login' || location.pathname === '/signup') {
    hideNavbar = true;
  }

  return (
      <GlassBackground>
          <div className="drawer min-h-screen">

            <input id="my-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content">
              {!hideNavbar && <Header />}
              <main>
                <AppRoutes />
              </main>
            </div>

            <Sidebar />

          </div>
      </GlassBackground>
  );
}

export default App;

