import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();  //  Hook para redirigir

  const handleLogout = () => {
    logout();
    navigate("/");  //  Redirigir al Home después de cerrar sesión
  };

  return (
    <nav style={styles.navbar}>
      <div>
        <Link to="/" style={styles.link}>Home</Link>

        {/*  Mostrar "Publicaciones" solo si el usuario ha iniciado sesión */}
        {user && <Link to="/posts" style={styles.link}>Publicaciones</Link>}

        {/*  Mostrar "Registrar Admin" solo si el usuario es ADMIN */}
        {user?.roles.includes("ROLE_ADMIN") && (
          <>
            <Link to="/register-admin" style={styles.link}>Registrar Admin</Link>
            <Link to="/crear-publicacion" style={styles.createButton}>Crear Publicación</Link>
          </>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span style={styles.user}>Bienvenido, {user.username}</span>
            <button onClick={handleLogout}  style={styles.button}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register-user" style={styles.link}>Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Estilos mejorados
// Estilos mejorados
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
  createButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 12px",
    textDecoration: "none",
    borderRadius: "5px",
    marginLeft: "10px",
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