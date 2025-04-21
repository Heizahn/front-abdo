import { useState, useCallback } from 'react';

export const useEmailFormat = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = useCallback((value: string) => {
    // Si el usuario ya escribió @abdo.com, no hacer nada
    if (value.includes('@abdo.com')) {
      setEmail(value);
      return;
    }

    // Si el usuario escribió @, asumir que está escribiendo su propio dominio
    if (value.includes('@')) {
      setEmail(value);
      return;
    }

    // En cualquier otro caso, agregar @abdo.com
    setEmail(value);
  }, []);

  const getFormattedEmail = useCallback(() => {
    if (email.includes('@')) {
      return email;
    }
    return email ? `${email}@abdo.com` : '';
  }, [email]);

  return {
    email,
    setEmail,
    handleEmailChange,
    getFormattedEmail
  };
}; 