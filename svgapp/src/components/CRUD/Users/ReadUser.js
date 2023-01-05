import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReadUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/auth/user/${id}`, {
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
  }, [id]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  return (
    <div className="user_profile">
      <h1>Profil d'utilisateur</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Telephone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.firstName}</td>
            <td>{data.lastName}</td>
            <td>{data.email}</td>
            <td>{data.telephone}</td>
            <td>{data.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReadUser;
