import React from 'react';
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn />
    </div>
  );
};

export default Login;