import jwt_decode from "jwt-decode";

const AdminRoute = ({ children }) => {
  //does the same as Protected Component but also check for the role of the user stored in the token
  try {
    const token = localStorage.getItem("token");
    if (token) {
      let decoded = jwt_decode(token);
      //verify if token is valid
      if (decoded.exp > Date.now() / 1000) {
        if (decoded.user.role === "admin") {
          return children;
        } else {
          window.location.href = "/";
        }
      } else {
        localStorage.removeItem("token");
      }
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

export default AdminRoute;
