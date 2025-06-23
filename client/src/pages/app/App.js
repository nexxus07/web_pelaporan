import React, { lazy, Suspense } from "react";
import logo from "../../assets/image/logo/logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { app, auth } from "../../config/firebase";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../reducers";
import PrivateRoute from "../../components/PrivateRoute";

const store = createStore(rootReducer);

// without lazy-loading
import Login from "../login/login";
import Dashboard from "../dashboard/dashboard";
import Laporan from "../laporan/laporan";

// Lazy-loaded pages
const Register = lazy(() => import("../../register/register"));
const LoginAdmin = lazy(() => import("../loginAdmin/loginAdmin"));
const Admin = lazy(() => import("../admin/admin"));
const UserProfile = lazy(() => import("../user/UserProfile"));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<div>Loading halaman...</div>}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route
              path="/laporan"
              element={
                <PrivateRoute>
                  <Laporan />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
