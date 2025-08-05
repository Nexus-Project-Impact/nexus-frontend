// DENTRO DE: src/components/PrivateRoute/index.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Usando "export function" para criar uma exportação nomeada
export function PrivateRoute() {
  const { token } = useSelector((state) => state.auth);

  return token ? <Outlet /> : <Navigate to="/login" />;
}