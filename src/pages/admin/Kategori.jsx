/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Kategori() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState({ id: null, name: '' });
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [selectedId, setSelectedId] = useState(null);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch categories
    const fetchCategories = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
            const response = await axios.get('http://localhost:8000/api/admin/kategori');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        //check token empty
        if (!token) {

            //redirect login page
            navigate('/');
        }
        fetchCategories();
    }, []);

    // Handle Add
    const handleAddCategory = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/admin/kategori', {
                kategori: newCategory,
            });
            setCategories([...categories, response.data.data]);
            setNewCategory('');
            toast.success('Category added successfully!');
        } catch (error) {
            console.error('Failed to add category:', error);
            toast.error('Failed to add category!');
        }
    };


    // Handle Edit
    const handleEditCategory = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/api/admin/kategori/${editCategory.id}`, {
                kategori: editCategory.name,
            });
            setCategories(
                categories.map((cat) =>
                    cat.id === editCategory.id ? response.data.data : cat
                )
            );
            setEditCategory({ id: null, name: '' });
            toast.success('Category updated successfully!');
        } catch (error) {
            console.error('Failed to update category:', error);
            toast.error('Failed to update category!');
        }
    };


    // Handle Delete
    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/kategori/${id}`);
            setCategories(categories.filter((cat) => cat.id !== id));
            toast.success('Category deleted successfully!');
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Failed to delete category!');
        }
    };


    return (
        <div>
            <AdminNavbar />
            <div className="container mt-4">
                <h3>Manage Categories</h3>
                <button
                    className="btn btn-primary my-3"
                    data-bs-toggle="modal"
                    data-bs-target="#categoryModal"
                    onClick={() => setModalType('add')}
                >
                    Add Category
                </button>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat.id}>
                                <td>{index + 1}</td>
                                <td>{cat.kategori}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#categoryModal"
                                        onClick={() => {
                                            setModalType('edit');
                                            setEditCategory({ id: cat.id, name: cat.kategori });
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteCategory(cat.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit */}
            <div
                className="modal fade"
                id="categoryModal"
                tabIndex="-1"
                aria-labelledby="categoryModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="categoryModalLabel">
                                {modalType === 'add' ? 'Add Category' : 'Edit Category'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Category Name"
                                value={
                                    modalType === 'add'
                                        ? newCategory
                                        : editCategory.name
                                }
                                onChange={(e) =>
                                    modalType === 'add'
                                        ? setNewCategory(e.target.value)
                                        : setEditCategory({
                                            ...editCategory,
                                            name: e.target.value,
                                        })
                                }
                            />
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
                                onClick={
                                    modalType === 'add'
                                        ? handleAddCategory
                                        : handleEditCategory
                                }
                                data-bs-dismiss="modal"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
