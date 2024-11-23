/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import UserNavbar from "./UserNavbar";

function OrderPaket() {
    const [user, setUser] = useState({});
    const [pakets, setPakets] = useState([]); // Updated state to hold paket data
    const [cart, setCart] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPaket, setSelectedPaket] = useState(null); // Store the selected paket for modal
    const [alamat, setAlamat] = useState('');
    const [metodePembayaran, setMetodePembayaran] = useState('Tunai');
    const [pakaiNasi, setPakaiNasi] = useState(true);
    const [catatan, setCatatan] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
            const userResponse = await axios.get("http://localhost:8000/api/user");
            setUser(userResponse.data);

            const paketResponse = await axios.get("http://localhost:8000/api/admin/paket");
            setPakets(paketResponse.data.data); // Set paket data
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    };

    useEffect(() => {
        if (!token) navigate("/");
        fetchData();
    }, [token, navigate]);

    const addToCart = (paket) => {
        setSelectedPaket(paket); // Set selected Paket
        setShowModal(true); // Open the modal
    };

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const placeOrder = async () => {
        if (!selectedPaket) {
            toast.error("Paket belum dipilih.");
            return;
        }

        let totalHarga = selectedPaket.harga;
        if (pakaiNasi) {
            totalHarga += 5000;
        }

        const items = [{
            menu_id: null, // Karena yang dipesan adalah paket
            paket_id: selectedPaket.id, // ID paket yang dipesan
            jumlah: 1, // Jumlah paket
            harga_total: selectedPaket.harga + (pakaiNasi ? 5000 : 0), // Harga total untuk paket
        }];        

        const orderData = {
            tipe_pesanan: "paket",
            total_harga: totalHarga,
            alamat_pesanan: alamat,
            status: "dipesan",
            catatan: catatan,
            nasi: pakaiNasi,
            metode_pembayaran: metodePembayaran,
            items,
        };

        try {
            const response = await axios.post("http://localhost:8000/api/user/pesanan", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.data) {
                toast.success("Pesanan berhasil dibuat!", { position: "bottom-right" });
                setAlamat('');
                setCatatan('');
                setMetodePembayaran('Tunai');
                setShowModal(false);
                fetchData();
            }
        } catch (error) {
            console.error(error.response.data);
            toast.error("Terjadi kesalahan saat membuat pesanan.", { position: "bottom-right" });
        }
    };



    return (
        <>
            <UserNavbar />
            <div className="container" style={{ marginTop: "60px" }}>
                <div className="row mt-4">
                    {pakets.map((paket) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={paket.id}>
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={`http://localhost:8000/storage/${paket.image}`}
                                    alt={paket.paket}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{paket.paket}</h5>
                                    <p className="card-text">{paket.deskripsi}</p>
                                    <p className="card-text text-success">
                                        <strong>Rp {paket.harga}</strong>
                                    </p>

                                    {/* Add Menu List */}
                                    <div>
                                        <h6>Menu dalam Paket:</h6>
                                        <ul>
                                            {paket.menus.map((menu) => (
                                                <li key={menu.id}>
                                                    {menu.menu}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => addToCart(paket)} // Open modal with selected Paket
                                        className="btn btn-primary btn-sm w-100 mt-2"
                                    >
                                        Pesan Paket
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Cart */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Keranjang Pesanan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPaket && selectedPaket.menus.length > 0 ? (
                        <>
                            <div className="mb-3">
                                <h4>{selectedPaket.paket}</h4>
                            </div>

                            {/* Opsi Pakai Nasi */}
                            <div className="mb-3">
                                <div className="btn-group">
                                    <button
                                        className={`btn btn-sm ${pakaiNasi ? 'btn-success' : 'btn-outline-secondary'}`}
                                        onClick={() => setPakaiNasi(true)}
                                    >
                                        Pakai Nasi
                                    </button>
                                    <button
                                        className={`btn btn-sm ${!pakaiNasi ? 'btn-danger' : 'btn-outline-secondary'}`}
                                        onClick={() => setPakaiNasi(false)}
                                    >
                                        Tanpa Nasi
                                    </button>
                                </div>
                            </div>

                            {/* Daftar Menu Dipesan */}
                            {selectedPaket.menus.map((menu, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                                    <div>
                                        <strong>{menu.menu}</strong>
                                        <br />
                                    </div>
                                    <div className="d-flex align-items-center">
                                        Harga: Rp {menu.harga}
                                        <br />
                                    </div>
                                </div>
                            ))}

                            {/* Tambahkan Nasi jika Pakai Nasi aktif */}
                            {pakaiNasi && (
                                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                                    <div>
                                        <strong>Nasi</strong>
                                        <br />
                                    </div>
                                    <div className="d-flex align-items-center">
                                        Harga: Rp 5000
                                        <br />
                                    </div>
                                </div>
                            )}

                            {/* Total Harga Keseluruhan */}
                            <div className="mb-3">
                                <strong>Total Harga:</strong> Rp{" "}
                                {selectedPaket.harga + (pakaiNasi ? 5000 : 0)}
                            </div>


                            {/* Catatan */}
                            {/* Input untuk Alamat */}
                            <div className="mb-3">
                                <label htmlFor="alamat" className="form-label">Alamat Pengiriman</label>
                                <textarea
                                    id="alamat"
                                    className="form-control"
                                    value={alamat}
                                    onChange={(e) => setAlamat(e.target.value)}
                                    placeholder="Masukkan alamat pengiriman"
                                    rows="3"
                                    required
                                />
                            </div>

                            {/* Input untuk Catatan */}
                            <div className="mb-3">
                                <label htmlFor="catatan" className="form-label">Catatan</label>
                                <textarea
                                    id="catatan"
                                    className="form-control"
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                    placeholder="Masukkan catatan tambahan (opsional)"
                                    rows="3"
                                />
                            </div>

                            {/* Input untuk Metode Pembayaran */}
                            <div className="mb-3">
                                <label htmlFor="metodePembayaran" className="form-label">Metode Pembayaran</label>
                                <select
                                    id="metodePembayaran"
                                    className="form-select"
                                    value={metodePembayaran}
                                    onChange={(e) => setMetodePembayaran(e.target.value)}
                                >
                                    <option value="Tunai">Tunai</option>
                                    <option value="Debit">Debit</option>
                                    <option value="Kartu Kredit">Kartu Kredit</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <p>No items in the paket.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Tutup
                    </Button>
                    <Button variant="primary" onClick={placeOrder}>
                        Pesan
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* <ToastContainer /> */}
        </>
    );
}

export default OrderPaket;
