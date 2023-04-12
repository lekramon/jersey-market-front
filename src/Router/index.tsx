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
      </Route>
    </Routes>
  );
};
