import jwt_decode from "jwt-decode";
const Protected = ({ children }) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      let decoded = jwt_decode(token);
      if (decoded.exp > Date.now() / 1000) {
        return children;
      } else {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
};
export default Protected;
