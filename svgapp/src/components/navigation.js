import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Navigation = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hamburgerActive, setHamburgerActive] = useState(false);

  //hamburger menu
  const hamburgerHandler = () => {
    setHamburgerActive(!hamburgerActive);
  };

  //hamberger active class
  const hamburgerActiveClass = () => {
    if (hamburgerActive) {
      return "open";
    }

    return "";
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let decoded = jwt_decode(token);
        //verify if token is valid
        if (decoded.exp > Date.now() / 1000) {
          setIsConnected(true);
          if (decoded.user.role === "admin") {
            setIsAdmin(true);
          }
        }
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.removeItem("token");
    }
  }, [isConnected]);

  return (
    <div id="nav_bar">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/carte"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              Carte
            </NavLink>
          </li>
          {!isConnected
            ? hamburgerActive && (
                <div className="hamburger-menu">
                  <ul>
                    <li>
                      <NavLink
                        to="/login"
                        className={(nav) => (nav.isActive ? "nav-active" : "")}
                      >
                        Login
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/register"
                        className={(nav) => (nav.isActive ? "nav-active" : "")}
                      >
                        Register
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )
            : hamburgerActive && (
                <div className="hamburger-menu">
                  <ul>
                    <li>
                      <NavLink
                        to="/profile"
                        className={(nav) => (nav.isActive ? "nav-active" : "")}
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/logout"
                        className={(nav) => (nav.isActive ? "nav-active" : "")}
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}
          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                className={(nav) => (nav.isActive ? "nav-active" : "")}
              >
                Admin
              </NavLink>
            </li>
          )}
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2516/2516745.png"
              width={"45px"}
              alt="burger icon"
              title="Icone créée par 'Freepik' du site 'www.flaticon.com'"
              onClick={() => hamburgerHandler()}
              className={"hamburger " + hamburgerActiveClass()}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
