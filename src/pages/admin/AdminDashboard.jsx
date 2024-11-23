/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
//import hook react
import React, { useState, useEffect } from 'react';

//import hook useHitory from react router dom
import { useNavigate } from 'react-router';

//import axios
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function AdminDashboard() {

    //state user
    const [user, setUser] = useState({});

    //define navigate
    const navigate = useNavigate();

    //token
    const token = localStorage.getItem("token");

    //function "fetchData"
    const fetchData = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
            // Fetch user data
            const response = await axios.get('http://localhost:8000/api/user');
            const userData = response.data;

            // Check if user has a profile
            const profileResponse = await axios.get('http://localhost:8000/api/user/check-profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!profileResponse.data.hasProfile) {
                // Redirect to login if no profile
                await logoutHanlder();
                return;
            }

            // Check if role is admin
            if (userData.role !== 'admin') {
                navigate('/user'); // Redirect to user dashboard if not admin
                return;
            }

            // Set user data to state
            setUser(userData);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                navigate('/');
            }
        }
    }

    //hook useEffect
    useEffect(() => {

        //check token empty
        if (!token) {

            //redirect login page
            navigate('/');
        }

        //call function "fetchData"
        fetchData();
    }, []);

    //function logout
    const logoutHanlder = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch Rest API
        await axios.post('http://localhost:8000/api/logout')
            .then(() => {

                //remove token from localStorage
                localStorage.removeItem("token");

                //redirect halaman login
                navigate('/');
            });
    };

    return (
        <>
            <AdminNavbar user={user} />
            <div className="container" style={{ marginTop: "50px" }}>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card border-0 rounded shadow-sm">
                            <div className="card-body">
                                SELAMAT DATANG ADMIN <strong className="text-uppercase">{user.name}</strong>
                                <hr />
                                <button onClick={logoutHanlder} className="btn btn-md btn-danger">LOGOUT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default AdminDashboard;