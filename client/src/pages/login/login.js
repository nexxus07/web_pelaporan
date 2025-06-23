import React, { Component } from "react";
import "./login.scss";
import { connect } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase'; // pastikan path sudah benar

class Login extends Component {
    state = {
        email: "",
        password: "",
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    handleLogin = () => {
        const { email, password } = this.state;
        if (!email || !password) {
            alert('Email dan password wajib diisi');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Set status login
                localStorage.setItem('isLogin', 'true');
                // Redirect ke laporan
                window.location.href = '/laporan';
            })
            .catch((error) => {
                alert('Login gagal: ' + error.message);
            });
    };

    render() {
        return (
            <div>
                <div className="auth-container">
                    <div className="auth-card">
                        <p className="auth-title">Login</p>
                        <input className="auth-input" id="email" placeholder="Email" type="email" onChange={this.handleChange} />
                        <input className="auth-input" id="password" placeholder="Password" type="password" onChange={this.handleChange} />
                        <button className="auth-button" onClick={this.handleLogin}>Login</button>
                        <a href="/register" className="auth-link">Belum punya akun? Daftar di sini</a>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        popup: state.popup,
        isLogin: state.isLogin
    };
};

export default connect(mapStateToProps, null)(Login);