/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [currentMenu, setCurrentMenu] = useState({
        id: null,
        kat_id: '',
        menu: '',
        image: null,
        harga: '',
        deskripsi: '',
        stok: '',
    });
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {

        //check token empty
        if (!token) {

            //redirect login page
            navigate('/');
        }
        fetchMenus();
        fetchCategories();
    }, []);

    // Fetch menus and categories
    const fetchMenus = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
            const response = await axios.get('http://localhost:8000/api/admin/menu');
            setMenus(response.data.data);
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/kategori');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    // Handle Add Menu
    const handleAddMenu = async () => {
        const formData = new FormData();
        Object.entries(currentMenu).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        try {
            const response = await axios.post('http://localhost:8000/api/admin/menu', formData);
            setMenus([...menus, response.data.data]);
            toast.success('Menu added successfully!');
            resetCurrentMenu();
        } catch (error) {
            console.error('Failed to add menu:', error);
            toast.error('Failed to add menu!');
        }
    };

    // Handle Edit Menu
    // Handle Edit Menu
    const handleEditMenu = async () => {
        const formData = new FormData();

        // Debugging perubahan data
        const originalMenu = menus.find((menu) => menu.id === currentMenu.id);
        if (!originalMenu) {
            console.error('Original menu not found for editing.');
            toast.error('Menu not found for editing!');
            return;
        }

        // Append only modified fields to FormData
        Object.keys(currentMenu).forEach((key) => {
            if (key === 'image' && currentMenu.image instanceof File) {
                formData.append(key, currentMenu.image);
            } else if (currentMenu[key] !== originalMenu[key]) {
                formData.append(key, currentMenu[key]);
            }
        });

        // Debug isi FormData
        console.log('FormData being sent:');
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/admin/menu/${currentMenu.id}?_method=PUT`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Update menu di state
            setMenus(
                menus.map((menu) =>
                    menu.id === currentMenu.id ? response.data.data : menu
                )
            );

            resetCurrentMenu();
            toast.success('Menu updated successfully!');
        } catch (error) {
            console.error('Failed to update menu:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to update menu!');
        }
    };



    // Handle Delete Menu
    const handleDeleteMenu = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/menu/${id}`);
            setMenus(menus.filter((menu) => menu.id !== id));
            toast.success('Menu deleted successfully!');
        } catch (error) {
            console.error('Failed to delete menu:', error);
            toast.error('Failed to delete menu!');
        }
    };

    const resetCurrentMenu = () => {
        setCurrentMenu({
            id: null,
            kat_id: '',
            menu: '',
            harga: '',
            deskripsi: '',
            stok: '',
            image: null,
        });
        setModalType('add');
    };

    return (
        <div>
            <AdminNavbar />
            <div className="container mt-4">
                <h3>Manage Menus</h3>
                <button
                    className="btn btn-primary my-3"
                    data-bs-toggle="modal"
                    data-bs-target="#menuModal"
                    onClick={resetCurrentMenu}
                >
                    Add Menu
                </button>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Menu Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Stock</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menus.map((menu, index) => (
                            <tr key={menu.id}>
                                <td>{index + 1}</td>
                                <td>{menu.menu}</td>
                                <td>{menu.category.kategori}</td>
                                <td>{menu.harga}</td>
                                <td>{menu.deskripsi}</td>
                                <td>{menu.stok}</td>
                                <td>
                                    <img
                                        src={`http://localhost:8000/storage/${menu.image}`}
                                        alt={menu.menu}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#menuModal"
                                        onClick={() => {
                                            setModalType('edit');
                                            setCurrentMenu(menu);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteMenu(menu.id)}
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
                id="menuModal"
                tabIndex="-1"
                aria-labelledby="menuModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="menuModalLabel">
                                {modalType === 'add' ? 'Add Menu' : 'Edit Menu'}
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
                                    <label>Category</label>
                                    <select
                                        className="form-control"
                                        value={currentMenu.kat_id}
                                        onChange={(e) =>
                                            setCurrentMenu({
                                                ...currentMenu,
                                                kat_id: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.kategori}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Menu Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={currentMenu.menu}
                                        onChange={(e) =>
                                            setCurrentMenu({
                                                ...currentMenu,
                                                menu: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={currentMenu.harga}
                                        onChange={(e) =>
                                            setCurrentMenu({
                                                ...currentMenu,
                                                harga: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        value={currentMenu.deskripsi}
                                        onChange={(e) =>
                                            setCurrentMenu({
                                                ...currentMenu,
                                                deskripsi: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={currentMenu.stok}
                                        onChange={(e) =>
                                            setCurrentMenu({
                                                ...currentMenu,
                                                stok: e.target.value,
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
                                            setCurrentMenu({
                                                ...currentMenu,
                                                image: e.target.files[0],
                                            })
                                        }
                                    />
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
                                onClick={modalType === 'add' ? handleAddMenu : handleEditMenu}
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
