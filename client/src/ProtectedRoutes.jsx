import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ Component, isUserLoggedIn }) => {
  return isUserLoggedIn ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;