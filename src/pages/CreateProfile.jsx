 
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateProfile() {
    const [formData, setFormData] = useState({
        user_id: "", // Akan diisi otomatis dari token
        name: "",
        image: null,
        no_telp: "",
        alamat: "",
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Ambil data user dari token
    const fetchUserData = async () => {
        if (!token) {
            navigate("/"); // Redirect jika token tidak ada
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFormData((prevData) => ({
                ...prevData,
                user_id: response.data.id, // Set user_id dari API
            }));
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            navigate("/"); // Redirect jika token invalid
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, image: file }));
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            const response = await axios.post(
                "http://localhost:8000/api/user/profiles",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(response.data.message || "Profile created successfully!", {
                position: "bottom-right",
                autoClose: 3000,
            });

            navigate("/user"); // Redirect setelah sukses
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors); // Simpan pesan error ke state
            }
            toast.error(
                error.response?.data?.message || "Failed to create profile!",
                { position: "bottom-right", autoClose: 3000 }
            );
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h4 className="text-center mb-4">Create Your Profile</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 text-center">
                                    <label htmlFor="image" className="form-label d-block">
                                        <div
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                margin: "0 auto",
                                                border: "2px solid #ddd",
                                            }}
                                        >
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        height: "100%",
                                                        fontSize: "12px",
                                                        color: "#aaa",
                                                    }}
                                                >
                                                    Add Photo
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="form-control"
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                    {errors.image && (
                                        <div className="alert alert-danger mt-2">{errors.image}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="alert alert-danger mt-2">{errors.name}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="no_telp"
                                        value={formData.no_telp}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                    {errors.no_telp && (
                                        <div className="alert alert-danger mt-2">{errors.no_telp}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        placeholder="Enter your address"
                                        rows="3"
                                        required
                                    ></textarea>
                                    {errors.alamat && (
                                        <div className="alert alert-danger mt-2">{errors.alamat}</div>
                                    )}
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Save Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
