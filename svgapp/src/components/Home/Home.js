import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decodedToken, setDecodedToken] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      let decoded = jwtDecode(token);
      //verify if token is valid
      if (decoded.exp > Date.now() / 1000) {
        setDecodedToken(decoded);
        setUser(decoded.user);
        console.log(decoded.user);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      console.log("no token");
    }
  }, []);

  const toLogin = () => {
    console.log("login");
    navigate("/login");
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);
  return (
    //Home page displaying rooms infos using bootstrap cards
    <div className="container">
      <div className="row"></div>

      <h1>Home</h1>
      <h2>
        Bienvenue {user ? user.civility + ". " + user.lastName : "visiteur"}
      </h2>
      {user ? (
        //clickable div to go to link to rooms booking creation or Map
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Créer une réservation</h5>
                <p className="card-text">
                  Créer une réservation pour une salle
                </p>
                <a
                  href={`/create/bookings/${decodedToken.user.id}`}
                  className="btn btn-primary"
                >
                  Créer une réservation
                </a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Voir les salles</h5>
                <p className="card-text">Voir les salles disponibles</p>
                <a href="/rooms" className="btn btn-primary">
                  Voir les salles
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="alert alert-danger" role="alert">
            Veuillez vous connecter pour accéder à cette page
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => toLogin()}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
