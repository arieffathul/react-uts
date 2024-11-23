/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Paket() {
    const [pakets, setPakets] = useState([]);
    const [menus, setMenus] = useState([]);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [currentPaket, setCurrentPaket] = useState({
        id: null,
        paket: '',
        harga: '',
        deskripsi: '',
        image: null,
        menus: [],
    });
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {

        //check token empty
        if (!token) {

            //redirect login page
            navigate('/');
        }
        fetchPakets();
        fetchMenus();
    }, []);

    // Fetch pakets and menus
    const fetchPakets = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
            const response = await axios.get('http://localhost:8000/api/admin/paket');
            setPakets(response.data.data);
        } catch (error) {
            console.error('Failed to fetch pakets:', error);
        }
    };

    const fetchMenus = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/menu');
            setMenus(response.data.data);
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        }
    };

    // Handle Add Paket
    const handleAddPaket = async () => {
        const formData = new FormData();
        Object.entries(currentPaket).forEach(([key, value]) => {
            if (key === 'menus') {
                value.forEach((menu) => formData.append('menus[]', menu));
            } else if (value) {
                formData.append(key, value);
            }
        });

        try {
            const response = await axios.post('http://localhost:8000/api/admin/paket', formData);
            setPakets([...pakets, response.data.data]);
            toast.success('Paket added successfully!');
            resetCurrentPaket();
        } catch (error) {
            console.error('Failed to add paket:', error);
            toast.error('Failed to add paket!');
        }
    };

    // Handle Edit Paket
    const handleEditPaket = async () => {
        const formData = new FormData();

        Object.entries(currentPaket).forEach(([key, value]) => {
            if (key === 'menus') {
                value.forEach((menu) => formData.append('menus[]', menu));
            } else if (key === 'image') {
                // Tambahkan hanya jika ada file gambar baru
                if (value instanceof File) {
                    formData.append(key, value);
                }
            } else if (value) {
                formData.append(key, value);
            }
        });

        try {
            const response = await axios.post(
                `http://localhost:8000/api/admin/paket/${currentPaket.id}?_method=PUT`,
                formData
            );

            setPakets(
                pakets.map((paket) =>
                    paket.id === currentPaket.id ? response.data.data : paket
                )
            );
            toast.success('Paket updated successfully!');
            resetCurrentPaket();
        } catch (error) {
            console.error('Failed to update paket:', error);
            toast.error('Failed to update paket!');
        }
    };


    // Handle Delete Paket
    const handleDeletePaket = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/paket/${id}`);
            setPakets(pakets.filter((paket) => paket.id !== id));
            toast.success('Paket deleted successfully!');
        } catch (error) {
            console.error('Failed to delete paket:', error);
            toast.error('Failed to delete paket!');
        }
    };

    const resetCurrentPaket = () => {
        setCurrentPaket({
            id: null,
            paket: '',
            harga: '',
            deskripsi: '',
            image: null,
            menus: [],
        });
        setModalType('add');
    };

    return (
        <div>
            <AdminNavbar />
            <div className="container mt-4">
                <h3>Manage Pakets</h3>
                <button
                    className="btn btn-primary my-3"
                    data-bs-toggle="modal"
                    data-bs-target="#paketModal"
                    onClick={resetCurrentPaket}
                >
                    Add Paket
                </button>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Paket Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Menus</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pakets.map((paket, index) => (
                            <tr key={paket.id}>
                                <td>{index + 1}</td>
                                <td>{paket.paket}</td>
                                <td>{paket.harga}</td>
                                <td>{paket.deskripsi}</td>
                                <td>
                                    <img
                                        src={`http://localhost:8000/storage/${paket.image}`}
                                        alt={paket.paket}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>
                                    {paket.menus.length > 0 ? (
                                        <ul>
                                            {paket.menus.map((menu, index) => (
                                                <li key={index}>{menu.menu}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'No menus assigned'
                                    )}
                                </td>

                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#paketModal"
                                        onClick={() => {
                                            setModalType('edit');
                                            setCurrentPaket({
                                                ...paket,
                                                menus: paket.menus.map((menu) => menu.id),
                                            });
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeletePaket(paket.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="paketModal"
                tabIndex="-1"
                aria-labelledby="paketModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="paketModalLabel">
                                {modalType === 'add' ? 'Add Paket' : 'Edit Paket'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label>Paket Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={currentPaket.paket}
                                        onChange={(e) =>
                                            setCurrentPaket({
                                                ...currentPaket,
                                                paket: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={currentPaket.harga}
                                        onChange={(e) =>
                                            setCurrentPaket({
                                                ...currentPaket,
                                                harga: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        value={currentPaket.deskripsi}
                                        onChange={(e) =>
                                            setCurrentPaket({
                                                ...currentPaket,
                                                deskripsi: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) =>
                                            setCurrentPaket({
                                                ...currentPaket,
                                                image: e.target.files[0],
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Menus</label>
                                    <select
                                        multiple
                                        className="form-control"
                                        value={currentPaket.menus}
                                        onChange={(e) =>
                                            setCurrentPaket({
                                                ...currentPaket,
                                                menus: [...e.target.selectedOptions].map(
                                                    (option) => option.value
                                                ),
                                            })
                                        }
                                    >
                                        {menus.map((menu) => (
                                            <option key={menu.id} value={menu.id}>
                                                {menu.menu}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={modalType === 'add' ? handleAddPaket : handleEditPaket}
                                data-bs-dismiss="modal"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
