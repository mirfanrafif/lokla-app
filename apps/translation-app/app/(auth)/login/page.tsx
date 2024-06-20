'use client';

import React from 'react';

import login from '../actions/login';
import LoginForm from './components/LoginForm/LoginForm';

const page = () => {
  return <LoginForm onSubmit={login} />;
};

export default page;
