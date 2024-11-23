/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import UserNavbar from "./UserNavbar";

function UserDashboard() {
    const [user, setUser] = useState({});
    const [menus, setMenus] = useState([]);
    const [cart, setCart] = useState([]); // State untuk keranjang pesanan
    const [showModal, setShowModal] = useState(false); // State untuk modal
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

            const menuResponse = await axios.get("http://localhost:8000/api/admin/menu");
            setMenus(menuResponse.data.data);
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

    const addToCart = (menu) => {
        let notificationType = null; // Variabel untuk jenis notifikasi
        let notificationMessage = ""; // Variabel untuk pesan notifikasi

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === menu.id);

            if (existingItem) {
                if (existingItem.jumlah < menu.stok) {
                    // Tambahkan jumlah jika stok tersedia
                    notificationType = "success";
                    notificationMessage = `"${menu.menu}" telah ditambahkan ke pesanan!`;

                    return prevCart.map((item) =>
                        item.id === menu.id
                            ? { ...item, jumlah: item.jumlah + 1 }
                            : item
                    );
                } else {
                    // Jika stok penuh, tetapkan notifikasi error
                    notificationType = "error";
                    notificationMessage = "Stok telah penuh! Tidak bisa menambah lebih banyak.";
                    return prevCart;
                }
            } else {
                // Jika item belum ada di keranjang
                notificationType = "success";
                notificationMessage = `"${menu.menu}" telah ditambahkan ke pesanan!`;
                return [...prevCart, { ...menu, jumlah: 1 }];
            }
        });

        // Gunakan nilai di luar callback setCart
        setTimeout(() => {
            if (notificationType === "success") {
                toast.success(notificationMessage, { position: "top-right" });
            } else if (notificationType === "error") {
                toast.error(notificationMessage, { position: "top-right" });
            }
        }, 0);
    };

    const updateCartQuantity = (id, newQuantity) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id ? { ...item, jumlah: newQuantity } : item
                )
                .filter((item) => item.jumlah > 0) // Remove item if quantity becomes 0
        );
        if (newQuantity === 0) {
            toast.info("Item telah dihapus dari keranjang.");
        }
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        toast.info("Item telah dihapus dari keranjang.");
    };

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const viewOrders = () => {
        handleModalShow();
    };

    const logoutHandler = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.post("http://localhost:8000/api/logout").then(() => {
            localStorage.removeItem("token");
            navigate("/");
        });
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
            toast.error("Keranjang pesanan kosong, tambahkan menu terlebih dahulu.");
            return;
        }

        // Hitung total harga dari item di keranjang
        let totalHarga = cart.reduce((total, item) => total + item.harga * item.jumlah, 0);

        // Jika pakai nasi, tambahkan biaya tambahan 5000
        if (pakaiNasi) {
            totalHarga += 5000;
        }

        // Format items sesuai dengan struktur yang dibutuhkan di controller (menu_id atau paket_id)
        const items = cart.map((item) => ({
            menu_id: item.id, // Pastikan 'menu_id' merujuk pada atribut ID yang valid
            paket_id: item.paket_id, // Jika ada paket, paket_id juga akan dikirim
            jumlah: item.jumlah,
            harga_total: item.harga * item.jumlah,
        }));

        // Data untuk pesanan
        const orderData = {
            tipe_pesanan: 'menu', // Misalnya, selalu 'menu', bisa disesuaikan jika memungkinkan
            total_harga: totalHarga, // Total harga sudah dihitung termasuk biaya nasi (jika ada)
            alamat_pesanan: alamat, // Mengambil alamat dari state
            status: 'dipesan', // Status default
            catatan: catatan, // Mengambil catatan dari state
            nasi: pakaiNasi, // Menyimpan pilihan nasi
            metode_pembayaran: metodePembayaran, // Mengambil metode pembayaran dari state
            items, // Daftar item yang dipesan
        };

        try {
            const response = await axios.post('http://localhost:8000/api/user/pesanan', orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (response.data && response.data.data) {
                toast.success("Pesanan berhasil dibuat!");
                setAlamat('');
                setCatatan('');
                setMetodePembayaran('Tunai');
                setCart([]);
                handleModalClose();
        
                // Refresh data menu untuk mendapatkan stok terbaru
                await fetchData();
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat membuat pesanan.");
        }
        
    };

    return (
        <>
            <UserNavbar />
            {/* <ToastContainer/> */}
            <div className="container" style={{ marginTop: "50px" }}>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card border-0 rounded shadow-sm">
                            <div className="card-body">
                                SELAMAT DATANG USER{" "}
                                <strong className="text-uppercase">
                                    {user.name}
                                </strong>
                                <hr />
                                <button onClick={logoutHandler} className="btn btn-md btn-danger">
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    {menus.map((menu) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={menu.id}>
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={`http://localhost:8000/storage/${menu.image}`}
                                    alt={menu.menu}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{menu.menu}</h5>
                                    <p className="card-text">{menu.deskripsi}</p>
                                    <p className="card-text text-success">
                                        <strong>Rp {menu.harga}</strong>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">Stok: {menu.stok}</small>
                                    </p>
                                    <button
                                        onClick={() => addToCart(menu)}
                                        className="btn btn-primary btn-sm w-100 mt-2"
                                    >
                                        Pesan
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="btn btn-warning position-fixed"
                    style={{
                        bottom: "20px",
                        right: "20px",
                        borderRadius: "50%",
                        width: "60px",
                        height: "60px",
                        fontSize: "24px",
                        lineHeight: "1.2",
                    }}
                    onClick={viewOrders}
                >
                    🛒
                </button>
            </div>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Keranjang Pesanan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cart.length > 0 ? (
                        <>
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
                            {cart.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                                    <div>
                                        <strong>{item.menu}</strong>
                                        <br />
                                        Harga: Rp {item.harga}
                                        <br />
                                        Total Harga: Rp {item.harga * item.jumlah}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <button
                                            className="btn btn-sm"
                                            onClick={() => updateCartQuantity(item.id, item.jumlah - 1)}
                                            disabled={item.jumlah <= 1}
                                            style={{
                                                marginRight: "5px",
                                                color: item.jumlah <= 1 ? "#6c757d" : "#dc3545",
                                                cursor: item.jumlah <= 1 ? "not-allowed" : "pointer",
                                                backgroundColor: "transparent",
                                                fontWeight: 'bolder',
                                            }}
                                        >
                                            -
                                        </button>
                                        <span>{item.jumlah}</span>
                                        <button
                                            className="btn btn-sm"
                                            onClick={() => updateCartQuantity(item.id, item.jumlah + 1)}
                                            disabled={item.jumlah >= item.stok}
                                            style={{
                                                marginLeft: "5px",
                                                color: item.jumlah >= item.stok ? "#6c757d" : "#28a745",
                                                cursor: item.jumlah >= item.stok ? "not-allowed" : "pointer",
                                                backgroundColor: "transparent",
                                                fontWeight: 'bolder',
                                            }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="btn btn-sm"
                                            onClick={() => removeFromCart(item.id)}
                                            style={{
                                                marginLeft: "10px",
                                                color: "#dc3545",
                                                cursor: "pointer",
                                                backgroundColor: "transparent",
                                                fontWeight: 'bolder',
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Total Harga Keseluruhan */}
                            <div className="mb-3">
                                <strong>Total Harga:</strong> Rp{" "}
                                {cart.reduce((total, item) => total + item.harga * item.jumlah, 0) + (pakaiNasi ? 5000 : 0)}
                            </div>


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
                        <p>Keranjang pesanan kosong.</p>
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


        </>
    );
}

export default UserDashboard;
