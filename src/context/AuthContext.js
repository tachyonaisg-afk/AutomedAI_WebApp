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

  const login = async (username, password) => {
    try {
      // ERPNext login expects form data, not JSON
      const formData = new URLSearchParams();
      formData.append('usr', username);
      formData.append('pwd', password);

      const response = await fetch(`https://hms.automedai.in/api/method/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies in request and save cookies from response
        body: formData,
      });

      // Get response text first to check what we're receiving
      const responseText = await response.text();
      console.log('Login response text:', responseText);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Login response data:', { status: response.status, data });
      } catch (e) {
        console.error('Failed to parse JSON, received HTML instead');
        console.log('First 500 chars:', responseText.substring(0, 500));
        throw new Error('Server returned HTML instead of JSON. The endpoint might be incorrect.');
      }

      // ERPNext returns 200 OK on successful login with cookies set
      // Response structure: { message: "Logged In", home_page: "/app/home", full_name: "User Name" }
      if (response.ok) {
        const userData = {
          username,
          full_name: data.full_name || username,
          home_page: data.home_page || '/dashboard',
          message: data.message
        };

        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ Login successful! User:', userData);
        return true;
      } else {
        console.log('❌ Login failed:', data);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call ERPNext logout endpoint to clear server-side session
      await fetch(`https://hms.automedai.in/api/method/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies to clear the session
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with client-side logout even if server logout fails
    } finally {
      // Clear client-side state and storage
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
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

