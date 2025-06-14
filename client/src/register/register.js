import React, { Component } from "react";
import "./register.scss";
import { app, auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

class Register extends Component {
    state = {
        email: "",
        password: "",
    };

    handlechangetext = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    }
    handleregistersubmit = () => {
        const { email, password } = this.state;
        if (!email || !password) {
            alert('Email and password are required');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert('Akun berhasil dibuat! Silakan login.');
                window.location.href = '/login'; // redirect ke halaman login
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert('Gagal register: ' + errorMessage);
            });
    }
    render() {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <p className="auth-title">kalo ini register</p>
                    <input className="auth-input" id="email" placeholder="Email" type="email" onChange={this.handlechangetext} />
                    <input className="auth-input" id="password" placeholder="Password" type="password" onChange={this.handlechangetext} />
                    <button onClick={this.handleregistersubmit} className="auth-button">Register</button>
                </div>
            </div>
        )
    }
}
export default Register;