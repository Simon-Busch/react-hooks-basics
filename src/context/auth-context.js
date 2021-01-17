import React, {useState} from 'react';
// import Auth from '../components/Auth';

export const AuthContext = React.createContext ({
  isAuth:false,
  login: () => {}
})

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logingHandler =() => {
    setIsAuthenticated(true);
  }

  return (
    <AuthContext.Provider value={{login: logingHandler, isAuth: isAuthenticated}}>
      { props.children }
    </AuthContext.Provider>
  );
};

export default AuthContextProvider