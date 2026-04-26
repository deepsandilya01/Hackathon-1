import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app.store';
import { router } from './app.routes';
import { ToastProvider } from '../components/ui/Toast';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  );
}

export default App;
