/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import UserNavbar from "./UserNavbar";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Histori() {
    const [pesanans, setPesanans] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate

    // Fetch data pesanan
    const fetchPesanans = async () => {
        setLoading(true);
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get("http://localhost:8000/api/user/pesanan");
            const filteredPesanans = response.data.filter((pesanan) => pesanan.status === "selesai");
            setPesanans(filteredPesanans);
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengambil data pesanan.", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel order
    const cancelOrder = async (id) => {
        try {
            // Send delete request to the server (this calls the 'destroy' function)
            await axios.delete(`http://localhost:8000/api/user/pesanan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Pesanan berhasil dibatalkan.", { position: "bottom-right" });
            fetchPesanans(); // Refresh data after cancellation
        } catch (error) {
            console.error(error);
            toast.error("Gagal membatalkan pesanan.", { position: "bottom-right" });
        }
    };

    useEffect(() => {
        if (!token) navigate("/");
        fetchPesanans();
    }, [token, navigate]);

    return (
        <div>
            <UserNavbar />
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
                            {/* Detail Pesanan */}
                            <div style={{ flex: "2" }}>
                                <p className="mb-1" style={{fontWeight: 'lighter'}}>{new Date(pesanan.updated_at).toLocaleString("id-ID")}</p>
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

                            {/* Detail Menu/Paket */}
                            <div style={{ flex: "2" }}>
                                <br></br>
                                <strong>Detail Menu/Paket:</strong>
                                <div className="mt-2">
                                    {pesanan.items.map((item, index) => (
                                        <p key={index} className="mb-1" style={{ fontSize: "0.9rem" }}>
                                            {item.menu ? item.menu.nama : item.paket.nama} x {item.jumlah}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Tombol Batalkan */}
                            <div style={{ flex: "1", textAlign: "end" }}>
                                <br></br>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => cancelOrder(pesanan.id)}
                                >
                                    Hapus Histori
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <p>Tidak ada pesanan yang telah Anda lakukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
