import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

const EditBooking = () => {
  const [oldBooking, setOldBooking] = useState({});
  const [newBooking, setNewBooking] = useState({});
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOldBooking(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    //fetch rooms
    fetch(`http://localhost:5000/api/rooms`, {
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

  const submitHandler = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(newBooking),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          navigate("/admin/edit/bookings");
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  const changeHandler = (e) => {
    setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h1>Modifier une réservation</h1>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      {!loading && !error && (
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="date">Date début</label>
            <input
              type="date"
              className="form-control"
              id="date_debut"
              name="date_debut"
              value={newBooking.date_debut}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date fin</label>
            <input
              type="date"
              className="form-control"
              id="date_fin"
              name="date_fin"
              value={newBooking.date_fin}
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="room">Salle</label>
            <select
              className="form-control"
              id="room"
              name="room"
              value={newBooking.room}
              onChange={changeHandler}
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
            Modifier
          </button>
        </form>
      )}
    </div>
  );
};

export default EditBooking;
