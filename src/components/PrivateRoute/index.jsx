import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export function PrivateRoute() {
  // Pega o token do estado do Redux
  const { token } = useSelector((state) => state.auth);

  // Se o token existe, renderiza o componente filho (a página protegida)
  // Se não, redireciona para a página de login
  return token ? <Outlet /> : <Navigate to="/login" />;
}