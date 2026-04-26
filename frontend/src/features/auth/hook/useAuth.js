import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, loginUser, registerUser, logout as logoutAction, logoutUserAction } from '../state/auth.slice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isInitialized, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized && !loading) {
      dispatch(fetchMe());
    }
  }, [dispatch, isInitialized, loading]);

  const login = (email, password) => dispatch(loginUser({ email, password }));
  const register = (data) => dispatch(registerUser(data));
  const logout = async () => {
    try {
      await dispatch(logoutUserAction()).unwrap();
    } catch (e) {
      dispatch(logoutAction());
    }
  };

  return { user, isAuthenticated, isInitialized, loading, error, login, logout, register };
}
