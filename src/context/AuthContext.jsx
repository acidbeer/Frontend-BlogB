import { createContext, useState, useContext,useEffect } from "react";
import jwtDecode from "jwt-decode"; 

export const AuthContext = createContext(); //  Exporta bien el contexto

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      try {
        // Validar si el token tiene 3 partes antes de decodificar
        if (token.split(".").length !== 3) {
          console.error("Token inválido (no tiene las 3 partes):", token);
          logout();
          return;
        }

        const decodedToken = jwtDecode(token);

        // Verificar si el token contiene la clave "roles"
        if (!decodedToken.roles|| !Array.isArray(decodedToken.roles)) {
          console.error("Token no contiene roles válidos:", decodedToken);
          logout();
          return;
        }
         // Validar si el token ha expirado
         const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
         if (decodedToken.exp < currentTime) {
           console.warn("El token ha expirado.");
           logout();
           return;
         }

        setUser({
          username: decodedToken.sub,
          roles: decodedToken.roles 
        });
      } catch (error) {
        cconsole.error("Error al decodificar el token:", error);
        logout();
      }
    }
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/auth/iniciarSesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();
      if (response.ok && data.tokenDeAcceso) {
        localStorage.setItem("token", data.tokenDeAcceso);
        setToken(data.tokenDeAcceso);

        //  Validar token antes de decodificar
        if (data.tokenDeAcceso.split(".").length !== 3) {
          console.error("Token inválido recibido:", data.tokenDeAcceso);
          return;
        }

        const decodedToken = jwtDecode(data.tokenDeAcceso);

        //  Validar roles correctamente
        if (!decodedToken.roles || !Array.isArray(decodedToken.roles)) {
          console.error("Token sin roles válidos:", decodedToken);
          logout();
          return;
        }
          
        setUser({
          username: decodedToken.sub,
          roles: decodedToken.roles || []
        });
      } else {
        throw new Error(data.message || "Error en login");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};