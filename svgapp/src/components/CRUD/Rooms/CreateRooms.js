import React, { useEffect, useState } from "react";

const CreateRooms = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState({
    nom: "",
    code: "",
    etage: "",
    capacite: "",
    equipements: "",
  });
  const { nom, code, etage, capacite, equipements } = room;

  const onChange = (e) => setRoom({ ...room, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(room),
    };
    fetch("http://localhost:5000/api/rooms/create", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch("http://localhost:5000/api/rooms", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 m-auto">
          <div className="card card-body mt-5">
            <h2 className="text-center">Ajouter une salle</h2>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  className="form-control"
                  name="nom"
                  onChange={onChange}
                  value={nom}
                />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  onChange={onChange}
                  value={code}
                />
              </div>

              <div className="form-group">
                <label>Etage</label>
                <input
                  type="text"
                  className="form-control"
                  name="etage"
                  onChange={onChange}
                  value={etage}
                />
              </div>
              <div className="form-group">
                <label>Capacité</label>
                <input
                  type="text"
                  className="form-control"
                  name="capacite"
                  onChange={onChange}
                  value={capacite}
                />
              </div>
              <div className="form-group">
                <label>Equipements</label>
                <input
                  type="text"
                  className="form-control"
                  name="equipements"
                  onChange={onChange}
                  value={equipements}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRooms;
