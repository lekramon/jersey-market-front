import logoBackoffice from '../../assets/logoXGames.png';
import logoStore from '../../assets/logo.svg';

import locationIcon from '../../assets/location-icon.svg';
import cartIcon from '../../assets/cart-icon.svg';
import styles from './styles.module.scss';
import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { pathname } = useLocation();
  const isBackOffice = pathname.includes('admin');

  const { totalProductsInCart } = useContext(CartContext);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img
          src={isBackOffice ? logoBackoffice : logoStore}
          alt="Logo do Coffe Delivery"
          className={styles.headerLogo}
        />

        {!isBackOffice && (
          <>
            <div>
              <img src={locationIcon} alt="" />
              <span>São Paulo, SP</span>
            </div>
            <Link to="/cart">
              <button>
                <img src={cartIcon} alt="" />
                {totalProductsInCart > 0 && <span>{totalProductsInCart}</span>}
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
