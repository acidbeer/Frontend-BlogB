import { useState } from "react";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";
import styles from "./RegisterUser.module.css"; // Importar CSS

const RegisterUser = () => {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ nombre, username, email, password });
      toast.success("Usuario registrado correctamente!");
    } catch (error) {
      toast.error("Error en el registro");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Nombre Completo"
          required
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Nombre de Usuario"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Contraseña"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;