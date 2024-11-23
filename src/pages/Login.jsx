/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
//import hook react
import React, { useState, useEffect } from 'react';

//import hook useHitory from react router dom
import { useLocation, useNavigate } from 'react-router';

//import axios
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function Login() {
    const location = useLocation();

    //define state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //define state validation
    const [validation, setValidation] = useState([]);

    //define navigate
    const navigate = useNavigate();

    //hook useEffect
    useEffect(() => {

        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token) {
            // Redirect based on role
            if (role == 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        }
    }, []);

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    //function "loginHanlder"
    const loginHandler = async (e) => {
        e.preventDefault();

        //initialize formData
        const formData = new FormData();

        //append data to formData
        formData.append('email', email);
        formData.append('password', password);

        try {
            const loginResponse = await axios.post('http://localhost:8000/api/login', formData);

            // Set token ke localStorage
            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('role', loginResponse.data.user.role); // Assuming role is part of the user object


            // Cek profil pengguna
            const profileResponse = await axios.get('http://localhost:8000/api/user/check-profile', {
                headers: {
                    Authorization: `Bearer ${loginResponse.data.token}`,
                },
            });

            if (!profileResponse.data.hasProfile) {
                // Jika tidak memiliki profil, redirect ke halaman create-profile
                navigate('/create-profile');
            } else {
                // Arahkan berdasarkan role
                const role = loginResponse.data.user.role; // Pastikan role disediakan dari API login
                if (role == 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            }
        } catch (error) {
            setValidation(error.response?.data || {});
            toast.error(error.response?.data?.message || "Login failed", {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="container" style={{ marginTop: "120px" }}>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-body">
                            <h4 className="fw-bold">HALAMAN LOGIN</h4>
                            <hr />
                            {
                                validation.message && (
                                    <div className="alert alert-danger">
                                        {validation.message}
                                    </div>
                                )
                            }
                            <form onSubmit={loginHandler}>
                                <div className="mb-3">
                                    <label className="form-label">ALAMAT EMAIL</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan Alamat Email" />
                                </div>
                                {
                                    validation.email && (
                                        <div className="alert alert-danger">
                                            {validation.email[0]}
                                        </div>
                                    )
                                }
                                <div className="mb-3">
                                    <label className="form-label">PASSWORD</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan Password" />
                                </div>
                                {
                                    validation.password && (
                                        <div className="alert alert-danger">
                                            {validation.password[0]}
                                        </div>
                                    )
                                }
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">LOGIN</button>
                                </div>
                            </form>
                            <div className='mt-3 text-center'>
                                Belum Memiliki Akun? silahkan <Link to={'/register'} className='text-decoration-none'>Register</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Login;