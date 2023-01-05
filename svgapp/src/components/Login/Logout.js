import React from "react";

const Logout = () => {
  function clickHandler() {
    localStorage.removeItem("token");
    //redirect to login page
    window.location.href = "/login";
  }

  return (
    <div id="logout">
      <button onClick={clickHandler}>
        <div className="logout">
          <h1>Logout</h1>
        </div>
      </button>
    </div>
  );
};

export default Logout;
