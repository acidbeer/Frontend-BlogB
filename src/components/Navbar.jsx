import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.navbar}>
    <Link to="/" style={styles.link}>Home</Link>

    {/*  Mostrar "Publicaciones" solo si el usuario ha iniciado sesión */}
    {user && <Link to="/posts" style={styles.link}>Publicaciones</Link>}

    {/*  Mostrar "Registrar Admin" solo si el usuario tiene ROLE_ADMIN */}
    {user?.roles.includes("ROLE_ADMIN") && (
      <Link to="/register-admin" style={styles.link}>Registrar Admin</Link>
    )}

    {user ? (
      <>
        <span style={styles.user}>Bienvenido, {user.username}</span>
        <button onClick={logout} style={styles.button}>Cerrar sesión</button>
      </>
    ) : (
      <>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/register-user" style={styles.link}>Registro</Link>
      </>
    )}
  </nav>
);
};

// Estilos inline para el Navbar
const styles = {
navbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "white",
},
link: {
  color: "white",
  textDecoration: "none",
  marginRight: "15px",
},
button: {
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
},
user: {
  marginRight: "15px",
}
};

export default Navbar;