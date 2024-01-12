import { useEffect, useState } from 'react';
import './assets/css/App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { accountService } from './services/account.service.js';

import NavBar from './Components/NavBar';
import Login from './Components/Authentication/Login';
import SignUp from './Components/Authentication/SignUp';
import Profile from './Components/Profile';
import HomePage from './Components/HomePage';
import Recipe from './Components/Recipe';
import Favorites from './Components/Favorites';

function App() {
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('token'));

  const handleDisconnect = () => {
    localStorage.removeItem('token');
    setIsConnected(false);
  }

  const handleConnect = () => {
    setIsConnected(true);
  }

  useEffect(() => {
    // console.log('token', localStorage.getItem('token'));
    // console.log('exp', accountService.getValuesToken().exp_jwt);
    if (localStorage.getItem('token') && accountService.getValuesToken().exp_jwt < Date.now()) {
      localStorage.removeItem('token');
    }

    const token = localStorage.getItem('token');
    setIsConnected(token !== null);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar isConnected={isConnected} handleDisconnect={handleDisconnect} />}>
            <Route index element={<HomePage isConnected={isConnected}/>} />
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login handleConnect={handleConnect} />} />

            <Route path="profile" element={<Profile />} />
            <Route path="recipe/:id" element={<Recipe/>} />

            <Route path="favorites" element={<Favorites />} />

            {/* Route doesn't exist */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
