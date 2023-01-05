import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookingCRUD = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/bookings`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //convert each date to a readable format
        data.forEach((booking) => {
          booking.date_debut = new Date(booking.date_debut).toLocaleString();
          booking.date_fin = new Date(booking.date_fin).toLocaleString();
        });
        setBookings(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const editHandler = (id) => {
    navigate(`/admin/edit/booking/${id}`);
  };

  const deleteWarning = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
      deleteHandler(id);
    }
  };

  const deleteHandler = (id) => {
    fetch(`http://localhost:5000/api/bookings/${id}`, {
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
          fetch(`http://localhost:5000/api/bookings`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setBookings(data);
              setLoading(false);
            })
            .catch((err) => {
              setError(err);
              setLoading(false);
            });
        }
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Bookings</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table ">
                  <thead>
                    <tr>
                      <th>Salle</th>
                      <th>Date début</th>
                      <th>Date fin</th>
                      <th>Motif</th>
                      <th>Utilisateur</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.room_id.nom}</td>
                        <td>{booking.date_debut}</td>
                        <td>{booking.date_fin}</td>
                        <td>{booking.motif}</td>
                        <td>
                          {booking.user.civility}.{booking.user.lastName}{" "}
                          {booking.user.firstName}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => editHandler(booking._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteWarning(booking._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="6">
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            (window.location.href = "/create/bookings")
                          }
                        >
                          Créer une réservation
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCRUD;
