import React from 'react'
import "./App.css";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import Layout from './Components/Layout'
import Register from './Components/Register'
import Message from './Components/Message'
import Login from './Components/Login'
import Profile from './Components/Profile'
import UserProfile from './Components/UserProfile'
import CreatePost from './Components/CreatePost'
import Notification from './Components/Notification'
import Search from './Components/Search'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoutes from "./ProtectedRoutes";

const App = () => {
  const isUserLoggedIn = !!Cookies.get('token');
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes Component={Layout} isUserLoggedIn={isUserLoggedIn} />
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoutes Component={CreatePost} isUserLoggedIn={isUserLoggedIn} />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes Component={Profile} isUserLoggedIn={isUserLoggedIn} />
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoutes Component={Message} isUserLoggedIn={isUserLoggedIn} />
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoutes Component={Search} isUserLoggedIn={isUserLoggedIn} />
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoutes Component={UserProfile} isUserLoggedIn={isUserLoggedIn} />
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoutes Component={Notification} isUserLoggedIn={isUserLoggedIn} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App