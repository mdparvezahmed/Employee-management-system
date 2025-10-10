import axios from 'axios';
import React, { useEffect } from 'react'

const userContext = React.createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const login = (userData) => {
    setUser(userData);
  }

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:7000/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setUser(response.data.user);
          }

        } else {
          setUser(null);
          setLoading(false);
        }

      } catch (error) {
        if (error.response && !error.response.data.error) {
          setUser(null);
        }
      } finally{
        setLoading(false);
      }
    }
    verifyUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  }

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  )
}


export const useAuth = () => React.useContext(userContext);

export default AuthContext
