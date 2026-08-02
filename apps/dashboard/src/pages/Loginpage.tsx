import { LoginForm } from '@/components/LoginForm';
import React from 'react'

const Loginpage = () => {
  return (
    <section
      id="login"
      className="h-screen grid place-content-center"
    >
        <LoginForm />
    </section>
  );
}

export default Loginpage