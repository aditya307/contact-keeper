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
import Cookies from 'js-cookie';

export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      // console.log('dflhfkadkbakf kadbaksbdkabd');
      // console.log(action.payload);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        // token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      Cookies.remove('jwt');
      Cookies.remove('user');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,

        user: null,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
