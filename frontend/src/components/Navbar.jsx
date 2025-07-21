import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = ({containerStyles}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(isLoggedIn);
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      setUsername(user?.username || '');
    } else {
      setUsername('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    setLoggedIn(false);
    setUsername('');
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
          <span className="ml-4">Hello, {username}</span>
          <button onClick={handleLogout} className="ml-2 text-red-500 underline">Logout</button>
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