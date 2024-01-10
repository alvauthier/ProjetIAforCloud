import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "@css/NavBar.css";

function NavBar({ isConnected, handleDisconnect, isAdmin, isManager }) {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const location = useLocation();
  const links = document.querySelectorAll(".header__links");

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      setIsMenuVisible(false);
    } else {
      setIsMenuVisible(true);
    }

    links.forEach((link) => {
      if (link.pathname === location.pathname) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }, [location]);

  return (
    <>
      {isMenuVisible && (
        <header className="header">
          <nav>
            <ul>
              <li>
                <Link to="/">
                  <h1>WeCook</h1>
                </Link>
              </li>
              <div className="header__center">
                {isConnected ? (
                  <>
                    <li>
                      <Link to="/profile" className="header__links">
                        Profil
                      </Link>
                    </li>
                  </>
                )
                : <></>
              }
              </div>
              <div className="header__right">
                {isConnected ? (
                  <li>
                    <Link to="/" onClick={handleDisconnect}>
                      Déconnexion
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/login">
                        Se connecter
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup" className="signup">
                        Inscription
                      </Link>
                    </li>
                  </>
                )}
              </div>
            </ul>
          </nav>
        </header>
      )}

      <Outlet />
    </>
  );
}

export default NavBar;
