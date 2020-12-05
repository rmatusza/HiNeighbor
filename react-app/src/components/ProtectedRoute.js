import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = (props) => {

  if (props.authenticated === false) {
    return <Redirect to="/login"/>
  }

  return (
    <Route {...props}/>
  );
}

export default ProtectedRoute;
