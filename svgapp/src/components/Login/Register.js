import React, { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [civility, setCivility] = useState("");

  //email regex case insensitive
  const emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@afpa.fr$/);

  //password regex must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const data = {
      email,
      phone,
      password,
      firstName,
      lastName,
      civility,
    };
    //check passwords
    if (password !== password2) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
    } else {
      if (emailRegex.test(email) && passwordRegex.test(password)) {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        fetch("http://localhost:5000/api/auth/register", options)
          .then((res) => res.json())
          .then((data) => {
            setLoading(false);
            if (data.error) {
              setError(data.error);
              console.log(data);
            } else {
              //set message
              setMessage(data.msg);

              //set token in local storage
              localStorage.setItem("token", data.token);
              //redirect to home page
              window.location.href = "/";
            }
          });
      } else {
        if (!emailRegex.test(email)) {
          setError("Votre email ne respecte pas le format");
        }
        if (!passwordRegex.test(password)) {
          setError(
            "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre"
          );
        }
        setLoading(false);
      }
    }
  };

  return (
    //useBootstrap for styling
    <div className="register_container">
      <div className="row">
        <div className="register_form">
          <h3 className="text-center mb-4">Inscription</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <form onSubmit={handleSubmit} className="">
            <div className="form-group">
              <label htmlFor="civility">Civilité : </label>
              <select
                name="civility"
                id="civility"
                onChange={(e) => setCivility(e.target.value)}
                required
              >
                <option value=""></option>
                <option value="Mme">Mme.</option>
                <option value="M">M.</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="nom">Nom : </label>
              <input
                type="text"
                name="lastname"
                id="nom"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prénom : </label>
              <input
                type="text"
                name="firstname"
                id="prenom"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email : </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Téléphone : </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe : </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password2">Confirmer le mot de passe : </label>
              <input
                type="password"
                name="password2"
                id="password2"
                value={password2}
                required
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              {loading ? (
                <div className="spinner-border text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>

    // <div className="register_container">
    //   <form className="register_form" onSubmit={handleSubmit}>
    //     <div className="register_title">
    //       <h1>Inscription</h1>
    //     </div>
    //     <label htmlFor="civility">Civilité</label>
    //     <select
    //       name="civility"
    //       id="civility"
    //       onChange={(e) => setCivility(e.target.value)}
    //       required
    //     >
    //       <option value=""></option>
    //       <option value="Mme">Mme.</option>
    //       <option value="M">M.</option>
    //     </select>

    //     <label htmlFor="nom">Nom</label>
    //     <input
    //       type="text"
    //       name="lastname"
    //       id="nom"
    //       value={lastName}
    //       required
    //       onChange={(e) => setLastName(e.target.value)}
    //     />
    //     <label htmlFor="prenom">Prénom</label>
    //     <input
    //       type="text"
    //       name="firstname"
    //       id="prenom"
    //       value={firstName}
    //       required
    //       onChange={(e) => setFirstName(e.target.value)}
    //     />
    //     <label htmlFor="email">Email</label>
    //     <input
    //       type="email"
    //       name="email"
    //       id="email"
    //       value={email}
    //       required
    //       onChange={(e) => setEmail(e.target.value)}
    //     />

    //     <label htmlFor="phone">Téléphone</label>
    //     <input
    //       type="tel"
    //       name="phone"
    //       id="phone"
    //       value={phone}
    //       required
    //       onChange={(e) => setPhone(e.target.value)}
    //     />
    //     <label htmlFor="password">Mot de passe</label>
    //     <input
    //       type="password"
    //       name="password"
    //       id="password"
    //       value={password}
    //       required
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     {/* confirm password */}
    //     <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
    //     <input
    //       type="password"
    //       name="confirmPassword"
    //       id="confirmPassword"
    //       value={password2}
    //       required
    //       onChange={(e) => setPassword2(e.target.value)}
    //     />
    //     <button className="register_button" type="submit">
    //       S'inscrire
    //     </button>
    //   </form>
    //   {loading && <p>Chargement...</p>}
    //   {error && <p>{error}</p>}
    //   {message && <p>{message}</p>}
    // </div>
  );
};

export default Register;
