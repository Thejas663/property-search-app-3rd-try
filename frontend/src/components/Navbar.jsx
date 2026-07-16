import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = ({containerStyles}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
      if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setUsername(user?.name || user?.username || '');
      } else {
        setUsername('');
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <nav className={`${containerStyles}`}>
      <NavLink to={"/"} className={({isActive})=>isActive? "active-link py-1":"py-1"}>
        Home
      </NavLink>
      <NavLink to={"/listing"} className={({isActive})=>isActive? "active-link py-1":"py-1"}>
        Listing
      </NavLink>
      <NavLink to={"/contact"} className={({isActive})=>isActive? "active-link py-1":"py-1"}>
        Contact
      </NavLink>
      <NavLink to={"/add-property"} className={({isActive})=>isActive? "active-link py-1":"py-1"}>
        Add Property
      </NavLink>
      {loggedIn ? (
        <>
          <NavLink to={"/profile"} className={({isActive})=>isActive? "active-link py-1 ml-4":"py-1 ml-4"}>
            Profile
          </NavLink>
          <button onClick={handleLogout} className="ml-4 text-red-500 font-medium">Logout</button>
        </>
      ) : (
        <>
          <NavLink to={"/login"} className={({isActive})=>isActive? "active-link py-1 ml-4":"py-1 ml-4"}>
            Login
          </NavLink>
          <NavLink to={"/register"} className={({isActive})=>isActive? "active-link py-1 ml-2":"py-1 ml-2"}>
            Register
          </NavLink>
        </>
      )}
    </nav>
  )
}

export default Navbar