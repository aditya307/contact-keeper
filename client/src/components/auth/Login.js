import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
const Login = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { login, error, clearErrors, isAuthenticated } = authContext;
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }
    if (error === 'invalid Credentials') {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslit -disable-next-line
  }, [error, isAuthenticated, props.history]);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { email, password } = user;
  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setAlert('PLease fill all fields', 'danger');
    } else {
      // console.log('##################################');
      // console.log(email, password);
      login({
        email,
        password,
      });
    }
  };
  const handleGoogleAuth = (e) => {
    e.preventDefault();
    window.location.href = '/login/google';
  };
  return (
    <div className='form-container'>
      <h1>
        Lo<span className='text-primary'>gin</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Enter Email</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input
          type='submit'
          value='Login'
          className='btn btn-primary btn-block'
        />
        <button
          onClick={handleGoogleAuth}
          // value='Google'
          className='btn btn-primary btn-block'
        >
          {' '}
          Google
        </button>
        <i className='fa fa-google ' />
      </form>
    </div>
  );
};

export default Login;
