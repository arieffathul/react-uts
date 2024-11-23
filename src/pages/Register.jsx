/* eslint-disable no-unused-vars */
//import hook react
import React, { useState } from 'react';

//import hook useHitory from react router dom
import { useNavigate } from 'react-router';

//import axios
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function Register() {

    // Define state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    // Define state validation
    const [validation, setValidation] = useState([]);

    // Define navigate
    const navigate = useNavigate();

    // Function "registerHandler"
    const registerHandler = async (e) => {
        e.preventDefault();

        // Initialize formData
        const formData = new FormData();

        // Append data to formData
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);
        formData.append('role', 'user');

        // Send data to server
        await axios.post('http://localhost:8000/api/register', formData)
            .then(() => {
                toast.success("Registration successful! Please log in.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/');
            })
            .catch((error) => {
                setValidation(error.response.data);
                toast.error("Registration failed", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            });
    };

    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="row justify-content-center w-100">
                <div className="col-md-8">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-body">
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn btn-sm btn-primary"
                                    style={{ width: "40px", height: "40px", fontSize: "20px", fontWeight: "bolder" }}
                                >
                                    <i className="fa fa-chevron-left" style={{ fontSize: "20px", fontWeight: "lighter" }}></i>
                                </button>

                                <h4 className="fw-bold mb-0">
                                    HALAMAN REGISTER
                                </h4>
                            </div>
                            <hr />
                            <form onSubmit={registerHandler}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">NAMA LENGKAP</label>
                                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan Nama Lengkap" />
                                        </div>
                                        {
                                            validation.name && (
                                                <div className="alert alert-danger">
                                                    {validation.name[0]}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="col-md-6">
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
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
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
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">KONFIRMASI PASSWORD</label>
                                            <input type="password" className="form-control" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Masukkan Konfirmasi Password" />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">REGISTER</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
