import React from 'react';
import logo from '../../assets/image/logo/logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Register from '../../register/register';
import Dashboard from '../dashboard/dashboard';
import Login from '../login/login';
import Laporan from '../laporan/laporan'; // tambahkan ini
import Admin from '../admin/admin'; // Pastikan path ini benar sesuai struktur folder kamu
import { app, auth } from '../../config/firebase';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from '../../reducers'; // Pastikan file reducers/index.js ada
import PrivateRoute from '../../components/PrivateRoute'; // pastikan path benar

const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/laporan"
              element={
                <PrivateRoute>
                  <Laporan />
                </PrivateRoute>
              }
            />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
