import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

const EditUser = () => {
  const [oldUser, setOldUser] = useState({});
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    telephone: "",
  });
  const { id } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    fetch(`http://localhost:5000/api/auth/user/${id}`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOldUser(data);
          setUser(data);
        }
      });
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:5000/api/auth/user/${id}`, {
        headers: {
          "Content-Type": "application/json ",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, role, telephone } = user;
    const userToSubmit = { firstName, lastName, email, role, telephone };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(userToSubmit),
    };
    fetch(`http://localhost:5000/api/auth/user/${id}`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          window.location.href = "/admin/edit/users";
        }
      });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    // old user info on the left and new user info on the right
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h1>Infos de l'utilisateur</h1>
          <p>
            <b>Nom</b>: {oldUser.lastName}
          </p>
          <p>
            <b>Prénom</b>: {oldUser.firstName}
          </p>
          <p>
            <b>Email</b>: {oldUser.email}
          </p>
          <p>
            <b>Role</b>: {oldUser.role}
          </p>
        </div>
        <div className="col-md-6">
          <h1>Modifier</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Telephone</label>
              <input
                type="telephone"
                className="form-control"
                id="telephone"
                name="telephone"
                value={user.telephone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                className="form-control"
                id="role"
                name="role"
                value={user.role}
                onChange={handleChange}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Update User
            </button>
          </form>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default EditUser;
