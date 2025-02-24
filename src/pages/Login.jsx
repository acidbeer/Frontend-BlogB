import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="usernameOrEmail" placeholder="Usuario o Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    );
  };
  
  export default Login;