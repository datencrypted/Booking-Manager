import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Rooms_CRUD = () => {
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

  const editHandler = (e) => {
    navigate(`/admin/edit/room/${e.target.value}`);
  };

  const deleteHandler = (e) => {
    fetch(`http://localhost:5000/api/rooms/${e.target.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
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
        }
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Rooms CRUD</h1>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((room) => (
                <tr key={room._id}>
                  <td>{room.etage}</td>
                  <td>{room.nom}</td>
                  <td>{room.code}</td>
                  <td>{room.capacite}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      value={room._id}
                      onClick={editHandler}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      value={room._id}
                      onClick={deleteHandler}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5">
                  <button
                    className="btn btn-success"
                    onClick={() => navigate("/admin/create/rooms")}
                  >
                    Create
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rooms_CRUD;
