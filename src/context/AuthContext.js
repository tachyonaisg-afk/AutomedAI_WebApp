import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Initialize state from localStorage synchronously
const getInitialAuthState = () => {
  if (typeof window !== 'undefined') {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    if (authStatus === 'true' && userData) {
      try {
        return {
          isAuthenticated: true,
          user: JSON.parse(userData),
        };
      } catch (e) {
        return { isAuthenticated: false, user: null };
      }
    }
  }
  return { isAuthenticated: false, user: null };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialAuthState();
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [user, setUser] = useState(initialState.user);

  const login = (username, password) => {
    // Simulate authentication - replace with actual API call
    if (username && password) {
      setIsAuthenticated(true);
      setUser({ username });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ username }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

