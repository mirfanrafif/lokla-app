import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';

const LoginPage = () => {
  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center bg-gray-800"
      style={{
        backgroundImage: 'url(/bg_login.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <LoginForm />
    </div>
  );
};

export default LoginPage;
