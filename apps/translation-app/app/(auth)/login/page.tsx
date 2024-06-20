'use client';

import React from 'react';

import LoginForm from './components/LoginForm/LoginForm';
import login from './LoginAction';

const page = () => {
  return <LoginForm onSubmit={login} />;
};

export default page;
