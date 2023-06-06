import { Routes, Route } from 'react-router-dom';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { UserList } from '../pages/User/List';
import { Register } from '../pages/User/Register';
import { RegisterProduct } from '../pages/RegisterProduct';
import { UserEdit } from '../pages/User/[id]/edit';
import ProductPage from '../pages/Product/[id]/view';
import { RegisterClient } from '../pages/RegisterClient';
import ClientPage from '../pages/Client/[id]/edit';
import StoragePage from '../pages/Storage';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/user/register" element={<Register />} />
        <Route path="/admin/user/registerProduct" element={<RegisterProduct />} />
        <Route path="/admin/user/list" element={<UserList />} />
        <Route path="/admin/user/:id/edit" element={<UserEdit />} />
        <Route path="/product/:id/view" element={<ProductPage />} />
        <Route path="/client/register" element={<RegisterClient />} />
        <Route path="/client/:id/edit" element={<ClientPage />} />
        <Route path="/storage" element={<StoragePage />} />
      </Route>
    </Routes>
  );
};
