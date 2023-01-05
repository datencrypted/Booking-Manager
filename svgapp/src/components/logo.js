import React from "react";

const Logo = () => {
  function clickHandler() {
    window.location.href = "/";
  }

  return (
    <div id="logo">
      <button onClick={clickHandler}>
        <img src="/logo-afpa-hd.jpg" className="logo_img" alt="logo" />
      </button>
    </div>
  );
};

export default Logo;
