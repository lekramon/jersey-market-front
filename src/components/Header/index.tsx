import logoBackoffice from '../../assets/logoXGames.png';

import cartIcon from '../../assets/cart-icon.svg';
import styles from './styles.module.scss';
import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { totalProductsInCart } = useContext(CartContext);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img
          src={logoBackoffice}
          alt="Logo da XSports"
          className={styles.headerLogo}
        />
        <Link to="/admin/user/list">
          <button >
            Users
          </button>
        </Link>
        <Link to="/admin/login">
          <button >
             Login
          </button>
        </Link>
        <Link to="/admin/user/register">
          <button >
            Register
          </button>
        </Link>
        <Link to="/cart">
          <button className={styles.headerCart}>
            <img src={cartIcon} alt="" />
              {totalProductsInCart > 0 && <span>{totalProductsInCart}</span>}
          </button>
        </Link>
      </div>
    </div>
  );
};
