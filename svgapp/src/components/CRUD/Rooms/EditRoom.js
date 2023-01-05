import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoomEdit = () => {
  const [oldRoom, setOldRoom] = useState({});
  const [room, setRoom] = useState({
    etage: "",
    code: "",
    capacite: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/rooms/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOldRoom(data);
        setRoom(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [id]);

  const submitHandler = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/rooms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(room),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          navigate("/admin/edit/rooms");
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  const changeHandler = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  return (
    // display old room data on the left and new room data on the right

    <div className="container">
      <div className="row">
        <div className="col-6">
          <h1>Salle : {oldRoom.nom}</h1>
          <p>etage: {oldRoom.etage}</p>
          <p>code: {oldRoom.code}</p>
          <p>capacite: {oldRoom.capacite}</p>
        </div>
        <div className="col-6">
          <h1>Modifier</h1>
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="etage">Etage</label>
              <select
                className="form-control"
                name="etage"
                id="etage"
                value={room.etage}
                onChange={changeHandler}
              >
                <option value="RDC">RDC</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="code">Code</label>
              <input
                type="text"
                className="form-control"
                name="code"
                id="code"
                value={room.code}
                onChange={changeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="capacite">Capacite</label>
              <input
                type="number"
                className="form-control"
                name="capacite"
                id="capacite"
                value={room.capacite}
                onChange={changeHandler}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RoomEdit;
