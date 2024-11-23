/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function OrderList() {
    const [pesanans, setPesanans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [rejectReason, setRejectReason] = useState(""); // Reason for rejection
    const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for rejection
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch data for all orders (including user name)
    const fetchPesanans = async () => {
        setLoading(true);
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get("http://localhost:8000/api/admin/pesanan");
            const filteredPesanans = response.data.filter((pesanan) => pesanan.status === "dipesan");
            setPesanans(filteredPesanans);
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengambil data pesanan.", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    // Handle reject order (Tolak Pesanan)
    const rejectOrder = (id) => {
        setSelectedOrder(id); // Set the selected order for rejection
        setIsModalOpen(true); // Open the modal
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason) {
            toast.error("Harap masukkan alasan penolakan.", { position: "bottom-right" });
            return;
        }
        try {
            await axios.put(
                `http://localhost:8000/api/user/pesanan/${selectedOrder}`,
                { status: "ditolak", balasan: rejectReason }, // Update status to 'ditolak' with rejection reason
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Pesanan berhasil ditolak.", { position: "bottom-right" });
            setIsModalOpen(false); // Close the modal
            setRejectReason(""); // Reset the reject reason
            fetchPesanans(); // Refresh data after rejection
        } catch (error) {
            console.error(error);
            toast.error("Gagal menolak pesanan.", { position: "bottom-right" });
        }
    };

    // Handle accept order (Terima Pesanan)
    const acceptOrder = async (id) => {
        try {
            await axios.put(
                `http://localhost:8000/api/user/pesanan/${id}`,
                { status: "diantar" }, // Update status to 'diantar' when accepted
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Pesanan berhasil diterima.", { position: "bottom-right" });
            fetchPesanans(); // Refresh data after acceptance
        } catch (error) {
            console.error(error);
            toast.error("Gagal menerima pesanan.", { position: "bottom-right" });
        }
    };

    useEffect(() => {
        if (!token) navigate("/");
        fetchPesanans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, navigate]);

    return (
        <div>
            <AdminNavbar />
            <div className="container" style={{ marginTop: "60px" }}>
                <h2 className="text-center mb-4">Daftar Pesanan</h2>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Sedang memuat pesanan...</p>
                    </div>
                ) : pesanans.length > 0 ? (
                    pesanans.map((pesanan) => (
                        <div
                            className="d-flex align-items-start border-bottom py-3 bg-white shadow-sm"
                            key={pesanan.id}
                            style={{
                                padding: "20px",
                                borderRadius: "8px",
                                marginBottom: "15px",
                                gap: "20px",
                            }}
                        >
                            {/* Pesanan Details */}
                            <div style={{ flex: "2" }}>
                                <p className="mb-1" style={{ fontWeight: 'lighter' }}>{new Date(pesanan.created_at).toLocaleString("id-ID")}</p>
                                <p className="mb-1">
                                    <strong>User:</strong> {pesanan.user_name}
                                </p>
                                <p className="mb-1">
                                    <strong>Alamat:</strong> {pesanan.alamat_pesanan}
                                </p>
                                <p className="mb-1">
                                    <strong>Total Harga:</strong> Rp {pesanan.total_harga.toLocaleString("id-ID")}
                                </p>
                                <p className="mb-1">
                                    <strong>Metode Pembayaran:</strong> {pesanan.metode_pembayaran}
                                </p>
                                <p className="mb-1">
                                    <strong>Catatan:</strong> {pesanan.catatan || "Tidak ada catatan"}
                                </p>
                                <p className="mb-1">
                                    <strong>Pakai Nasi:</strong> {pesanan.nasi ? "Ya" : "Tidak"}
                                </p>
                            </div>

                            {/* Item Details */}
                            <div style={{ flex: "2" }}>
                                <br />
                                <strong>Detail Menu/Paket:</strong>
                                <div className="mt-2">
                                    {pesanan.items.map((item, index) => (
                                        <p key={index} className="mb-1" style={{ fontSize: "0.9rem" }}>
                                            {item.menu ? item.menu.nama : item.paket.nama} x {item.jumlah}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Accept/Reject Buttons */}
                            <div style={{ flex: "1", textAlign: "end" }}>
                                <br />
                                {pesanan.status === "dipesan" && (
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => acceptOrder(pesanan.id)}
                                        >
                                            Terima Pesanan
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => rejectOrder(pesanan.id)}
                                        >
                                            Tolak Pesanan
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <p>Belum ada pesanan yang masuk</p>
                    </div>
                )}
            </div>

            {/* Simple Reject Reason Modal */}
            {isModalOpen && (
                <div className="simple-modal">
                    <div className="modal-content">
                        <h2>Tolak Pesanan</h2>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows="4"
                            className="form-control"
                            placeholder="Masukkan alasan penolakan..."
                        ></textarea>
                        <div className="button-group">
                            <button className="btn btn-danger" onClick={handleRejectSubmit}>Tolak Pesanan</button>
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Simple modal CSS */}
            <style>{`
                .simple-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    transition: opacity 0.3s ease;
                }

                .modal-content {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                }

                .button-group {
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }

                .button-group button {
                    width: 48%;
                }

                textarea.form-control {
                    width: 100%;
                    border-radius: 8px;
                    padding: 10px;
                    resize: none;
                }

                h2 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
}
