import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const Profile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const id = jwt_decode(localStorage.getItem("token")).user.id;
    fetch(`http://localhost:5000/api/auth/user/${id}`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(data);
        }
      });
  }, []);

  return (
    <div className="container">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Prénom</th>
            <th scope="col">Email</th>
            <th scope="col">Téléphone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user.lastName}</td>
            <td>{user.firstName}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
