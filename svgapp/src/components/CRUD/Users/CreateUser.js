import React, { useState, useEffect } from "react";

const CreateUser = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    civility: "",
    email: "",
    telephone: "",
    password: "",
    password2: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      console.log("No errors, submit callback called!");
    }
  }, [errors]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mt-5 mx-auto">
          <form noValidate onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">Créer un utilisateur</h1>
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                placeholder="Prénom"
                value={user.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                placeholder="Nom"
                value={user.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="civility">Civilité</label>
              <select
                className="form-control"
                name="civility"
                value={user.civility}
                onChange={handleChange}
              >
                <option value="">Choisir...</option>
                <option value="M">M</option>
                <option value="Mme">Mme</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telephone">N°Tel</label>
              <input
                type="tel"
                className="form-control"
                name="telephone"
                placeholder="Téléphone"
                value={user.telephone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Mot de passe"
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password2">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="password2"
                placeholder="Confirmer le mot de passe"
                value={user.password2}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                className="form-control"
                name="role"
                value={user.role}
                onChange={handleChange}
              >
                <option value="">Choisir...</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button type="submit" className="btn btn-lg btn-primary btn-block">
              Creer l'utilisateur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
