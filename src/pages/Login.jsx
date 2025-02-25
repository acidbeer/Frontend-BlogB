import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // Importar el módulo CSS

const Login = () => {
    const { login } = useAuth(); // Ahora useAuth() no será undefined
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      usernameOrEmail: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await login(formData.usernameOrEmail, formData.password);
      navigate("/posts"); // Redirigir tras login
    };
  
    return (
      <div className={styles.container}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          name="usernameOrEmail"
          placeholder="Usuario o Email"
          required
          onChange={handleChange}
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          onChange={handleChange}
        />
        <button className={styles.button} type="submit">
          Iniciar Sesión
        </button>
      </form>
    </div>
    );
  };
  
  export default Login;