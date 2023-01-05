import React, { useEffect } from "react";

const UserCRUD = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const [filter2, setFilter2] = React.useState("");
  const [filteredData, setFilteredData] = React.useState([]);
  const [deleting, setDeleting] = React.useState(false);

  const deleteWarning = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      setDeleting(true);
      fetch(`http://localhost:5000/api/auth/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setDeleting(false);
            window.location.reload();
          }
        })
        .catch((err) => {
          setError(err);
          console.log(err);
        });
    }
  };

  const getUser = (id) => {
    window.location.href = `/user/${id}`;
  };

  const updateUser = (id) => {
    window.location.href = `/admin/edit/user/${id}`;
  };

  React.useEffect(() => {
    fetch("http://localhost:5000/api/auth/users", {
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

  const filterData = (event) => {
    const value = event.target.value;
    setFilter(value);
    const result = data.filter((item) =>
      item.firstName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(result);
  };

  const filterData2 = (event) => {
    const value = event.target.value;
    setFilter2(value);
    const result = data.filter((item) =>
      item.lastName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(result);
  };

  return (
    error && <p>{error.message}</p>,
    (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title"> Users</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  Rechercher un utilisateur
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          placeholder="Nom"
                          value={filter2}
                          onChange={filterData2}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder="Prénom"
                          value={filter}
                          onChange={filterData}
                        />
                      </div>
                    </div>
                  </div>
                  <table className="table">
                    <thead className=" text-primary">
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0
                        ? filteredData.map((item) => (
                            <tr key={item._id}>
                              <td>{item.lastName}</td>
                              <td>{item.firstName}</td>

                              <td>{item.email}</td>
                              <td>{item.role}</td>
                              <td>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => getUser(item._id)}
                                >
                                  View
                                </button>
                                <button
                                  className="btn btn-warning"
                                  onClick={() => updateUser(item._id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => deleteWarning(item._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        : data.map((item) => (
                            <tr key={item._id}>
                              <td>{item.lastName}</td>
                              <td>{item.firstName}</td>

                              <td>{item.email}</td>
                              <td>{item.role}</td>
                              <td>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => getUser(item._id)}
                                >
                                  View
                                </button>
                                <button
                                  className="btn btn-warning"
                                  onClick={() => updateUser(item._id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => deleteWarning(item._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      <tr>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() =>
                              (window.location.href = "/admin/create/user")
                            }
                          >
                            Create User
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
    )
  );
};

export default UserCRUD;
