/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

export default function UserNavbar({ user }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                {/* Brand Name */}
                <a className="navbar-brand fw-bold" href="/">
                    WarTech
                </a>

                {/* Toggle button for mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/user">
                                Menu
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/paket">
                                Paket
                            </a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Pesanan
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/pesanan">Dalam Pemesanan</a></li>
                                <li><a className="dropdown-item" href="/pesanan-diantar">Dalam Perjalanan</a></li>
                                <li><a className="dropdown-item" href="/pesanan-ditolak">Pesanan Ditolak</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/histori">
                                Histori
                            </a>
                        </li>
                    </ul>

                    {/* User Account Image */}
                    <div className="d-flex align-items-center">
                        <img
                            src={'https://www.shutterstock.com/image-vector/user-icon-flat-style-person-260nw-1212192763.jpg'}
                            alt="User"
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
