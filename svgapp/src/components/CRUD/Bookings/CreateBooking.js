import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateBooking = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState({
    user: "",
    date_debut: "",
    date_fin: "",
    motif: "",
    room_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const onChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    console.log(booking);
    e.preventDefault();
    fetch("http://localhost:5000/api/bookings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(booking),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          console.log(data);
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">Créer une réservation</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="user">Utilisateur</label>
          <select
            name="user"
            id="user"
            className="form-control"
            onChange={onChange}
          >
            <option value="">-- Sélectionner un utilisateur --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.lastName + " " + user.firstName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date_debut">Date de début</label>
          <input
            type="date"
            className="form-control"
            id="date_debut"
            name="date_debut"
            onChange={onChange}
            value={booking.date_debut}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date_fin">Date de fin</label>
          <input
            type="date"
            className="form-control"
            id="date_fin"
            name="date_fin"
            onChange={onChange}
            value={booking.date_fin}
          />
        </div>
        <div className="form-group">
          <label htmlFor="motif">Motif</label>
          <input
            type="text"
            className="form-control"
            id="motif"
            name="motif"
            onChange={onChange}
            value={booking.motif}
          />
        </div>
        <div className="form-group">
          <label htmlFor="room_id">Salle</label>
          <select
            className="form-control"
            id="room_id"
            name="room_id"
            onChange={onChange}
            value={booking.room_id}
          >
            <option value="">Choisir une salle</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.nom}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateBooking;
