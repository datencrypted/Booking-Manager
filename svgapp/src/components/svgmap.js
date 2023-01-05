import React from "react";

const SvgMap = ({ height = "150" }) => {
  const clickHandler = (e) => {
    let fill = e.target.getAttribute("fill");
    let color = fill === "tomato" ? "lightgreen" : "tomato";
    e.target.setAttribute("fill", color);
  };
  return (
    <div>
      <svg
        height={height}
        id="eqoBtlUk4um1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        <rect
          width="1693.821109"
          height="897.95204"
          rx="0"
          ry="0"
          transform="translate(101.746894 100.192543)"
          fill="#d2dbed"
          strokeWidth="0"
        />

        <rect
          onClick={clickHandler}
          width="260.878696"
          height="138.001051"
          rx="0"
          ry="0"
          transform="translate(101.746894 100.192543)"
          fill="#d2dbed"
          stroke="#000"
        />

        <rect
          onClick={clickHandler}
          width="260.878696"
          height="582.251006"
          rx="0"
          ry="0"
          transform="translate(101.746894 404.551024)"
          fill="#d2dbed"
          stroke="#000"
        />

        <rect
          onClick={clickHandler}
          width="724.032908"
          height="138.001051"
          rx="0"
          ry="0"
          transform="translate(1071.535095 100.192543)"
          fill="#d2dbed"
          stroke="#000"
        />

        <rect
          onClick={clickHandler}
          width="432.907404"
          height="138.001051"
          rx="0"
          ry="0"
          transform="translate(638.627691 100.192543)"
          fill="#d2dbed"
          stroke="#000"
        />

        <rect
          onClick={clickHandler}
          width="276.002101"
          height="130.439349"
          rx="0"
          ry="0"
          transform="matrix(1.025632 0 0 1.057972 362.62559 100.192479)"
          fill="#d2dbed"
          stroke="#000"
        />

        <line
          onClick={clickHandler}
          x1="0"
          y1="-83.178683"
          x2="0"
          y2="83.178683"
          transform="translate(113.089445 321.372341)"
          fill="none"
          stroke="#3f5787"
          strokeWidth="3"
        />

        <line
          onClick={clickHandler}
          x1="0"
          y1="-83.178683"
          x2="0"
          y2="83.178683"
          transform="translate(139.5554 321.372341)"
          fill="none"
          stroke="#3f5787"
          strokeWidth="3"
        />

        <line
          onClick={clickHandler}
          x1="0"
          y1="-83.178715"
          x2="0"
          y2="83.178715"
          transform="translate(179.254332 321.372309)"
          fill="none"
          stroke="#3f5787"
          strokeWidth="3"
        />

        <line
          onClick={clickHandler}
          x1="0.945213"
          y1="-83.178683"
          x2="-0.945213"
          y2="83.178683"
          transform="translate(253.926133 321.372341)"
          fill="none"
          stroke="#3f5787"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

export default SvgMap;
