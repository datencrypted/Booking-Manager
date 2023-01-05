import React, { useState, useEffect } from "react";
import FirstFloor from "./FirstFloor";
import SecondFloor from "./SecondFloor";
import jwt_decode from "jwt-decode";

const Map = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const date = dd + "-" + mm + "-" + yyyy;

  const [floor, setFloor] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const floorHandler = (e) => {
    setFloor(e);
  };
  const decodedToken = jwt_decode(localStorage.getItem("token"));

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.map((room) => {
          room.reservations.map((reservation) => {
            const date_debut = new Date(reservation.date_debut);
            const date_fin = new Date(reservation.date_fin);
            const dd_debut = String(date_debut.getDate()).padStart(2, "0");
            const mm_debut = String(date_debut.getMonth() + 1).padStart(2, "0");
            const yyyy_debut = date_debut.getFullYear();
            const dd_fin = String(date_fin.getDate()).padStart(2, "0");
            const mm_fin = String(date_fin.getMonth() + 1).padStart(2, "0");
            const yyyy_fin = date_fin.getFullYear();
            reservation.date_debut =
              dd_debut + "-" + mm_debut + "-" + yyyy_debut;
            reservation.date_fin = dd_fin + "-" + mm_fin + "-" + yyyy_fin;
          });
          return room;
        });

        setRooms(data);
      });
    document.querySelectorAll(".room").forEach((room) => {
      room.addEventListener("click", (e) => {
        setSelectedRoom(parseInt(e.target.id));
      });
    });
  }, [floor, selectedRoom]);

  useEffect(() => {
    document.querySelectorAll(".room").forEach((room) => {
      rooms.map((dbroom) => {
        if (dbroom.code === parseInt(room.id)) {
          room.style.fill = "green";
          dbroom.reservations.map((reservation) => {
            if (
              reservation.date_debut <= date &&
              reservation.date_fin >= date
            ) {
              room.style.fill = "red";
            }
          });
        }
      });
    });
  }, [rooms, date]);
  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Plan de l'établissement</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {floor === 0 ? <h2>Choisissez un étage</h2> : <h2>Etage {floor}</h2>}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button onClick={() => floorHandler(1)}>1</button>
            <button onClick={() => floorHandler(2)}>2</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">{floor === 1 && <FirstFloor />}</div>
        <div className="col-12">{floor === 2 && <SecondFloor />}</div>
      </div>

      <div className="row">
        <div className="col-12">
          <h2>Informations de la salle: </h2>
          <p></p>
          {selectedRoom &&
            rooms.map((room) => {
              if (room.code === selectedRoom) {
                return (
                  <>
                    <p>
                      <strong>Nom:</strong> {room.nom}
                    </p>
                    <p>
                      <strong>Code:</strong> {room.code}
                    </p>
                    <p>
                      <strong>Capacité:</strong> {room.capacite} personne.s
                    </p>
                    <p>
                      <strong>Equipements:</strong> {room.equipements}
                    </p>
                    <p>
                      <strong>Reservations:</strong>{" "}
                    </p>
                    <ul>
                      {room.reservations.map((reservation) => {
                        return (
                          <li>
                            Du {reservation.date_debut} au{" "}
                            {reservation.date_fin}
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        window.location.href = `/create/bookings/${decodedToken.user.id}`;
                      }}
                    >
                      Réserver
                    </button>
                  </>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default Map;
