/* eslint-disable no-unused-vars */
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateProfile from './pages/CreateProfile';
import Kategori from './pages/admin/Kategori';
import Menu from './pages/admin/Menu';
import Paket from './pages/admin/Paket';
import OrderPaket from './pages/user/OrderPaket';
import Pesanan from './pages/user/Pesanan';
import PesananAntar from './pages/user/PesananAntar';
import PesananGagal from './pages/user/PesananGagal';
import Histori from './pages/user/Histori';
import OrderList from './pages/admin/OrderList';



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/user' element={<UserDashboard />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/create-profile' element={<CreateProfile />} />
        <Route path='/kelola-kategori' element={<Kategori />} />
        <Route path='/kelola-menu' element={<Menu />} />
        <Route path='/kelola-paket' element={<Paket />} />
        <Route path='/paket' element={<OrderPaket/>}/>
        <Route path='/pesanan' element={<Pesanan/>}/>
        <Route path='/pesanan-diantar' element={<PesananAntar/>}/>
        <Route path='/pesanan-ditolak' element={<PesananGagal/>}/>
        <Route path='/histori' element={<Histori/>}/>
        <Route path='/kelola-pesanan' element={<OrderList/>}/>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
      />
    </div>
  );
}

export default App;
