import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReadRooms = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/rooms", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Salles</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Etage</th>
                <th>Nom de la salle</th>
                <th>Code</th>
                <th>Capacité</th>
              </tr>
            </thead>
            <tbody>
              {data.map((room) => (
                <tr key={room._id}>
                  <td>{room.etage}</td>
                  <td>{room.nom}</td>
                  <td>{room.code}</td>
                  <td>{room.capacite} personne.s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReadRooms;
