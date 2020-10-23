import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import Cookies from 'js-cookie';
import authReducer from './authReducer';
import {
  REGISTER_FAIL,
  USER_LOADED,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';
import setAuthToken from '../../utils/setAuthToken';

const AuthState = (props) => {
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      // console.log('dsfsfsdfsfsf d sfdf');
      // console.log(localStorage.token);
    }
    const jwt = Cookies.get('jwt');
    if (typeof jwt !== 'undefined') {
      setAuthToken(jwt);
      console.log(jwt);
      console.log('Google auth');
    }
    try {
      const res = await axios.get('/api/auth');
      // console.log(res);
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  const jwt = Cookies.get('jwt');
  let auth_Token = '';
  if (typeof jwt !== 'undefined') {
    auth_Token = jwt;
    console.log(jwt);
    console.log('Google auth');
    loadUser();
  } else {
    auth_Token = localStorage.getItem('token');
    console.log('native authentication');
    console.log(localStorage.getItem('token'));
  }
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log(auth_Token);
  const initialState = {
    token: auth_Token,
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Actions
  // REgister
  const register = async (FormData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post('/api/users', FormData, config);
      console.log(res.data);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg,
      });
    }
  };
  //Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });
  // Load User

  const login = async (FormData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      console.log(FormData);
      const res = await axios.post('/api/auth', FormData, config);
      console.log(res.data);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      console.log(err);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg,
      });
    }
  };
  const logout = () => {
    dispatch({ type: LOGOUT });
  };
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        clearErrors,
        loadUser,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthState;
