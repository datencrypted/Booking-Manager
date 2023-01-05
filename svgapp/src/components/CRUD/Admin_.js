import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin_CRUD = () => {
  const clickHandler = (e) => {
    window.location.href = `admin/edit/${e.target.value}`;
  };

  return (
    //create three buttons to redirect to the CRUD pages of the three tables
    <div id="crud_select">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Admin CRUD</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <button
              className="btn btn-primary"
              value="users"
              onClick={clickHandler}
            >
              Users
            </button>
            <button
              className="btn btn-primary"
              value="rooms"
              onClick={clickHandler}
            >
              Rooms
            </button>
            <button
              className="btn btn-primary"
              value="bookings"
              onClick={clickHandler}
            >
              Réservations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_CRUD;
