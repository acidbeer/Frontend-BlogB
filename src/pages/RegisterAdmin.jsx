import { useState } from "react";
import { registerAdmin } from "../services/authService";
import { toast } from "react-toastify";

const RegisterAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAdmin({ nombre, username, email, password });
      toast.success("Administrador registrado correctamente!");
    } catch (error) {
      toast.error("Error en el registro");
    }
  };

  return (
    <div>
      <h2>Registro de Administrador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre Completo"
          required
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre de Usuario"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterAdmin;