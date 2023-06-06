import logoBackoffice from '../../assets/logoXGames.png';
import cartIcon from '../../assets/cart-icon.svg';
import styles from './styles.module.scss';
import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { totalProductsInCart, userLoged, isLoged, signOut } = useContext(CartContext);
  const classesLink = 'pt-3'
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link to="/">
          <img
            src={logoBackoffice}
            alt="Logo da XSports"
            className={styles.headerLogo}
          />
        </Link>
        {
          isLoged && userLoged.userGroup && userLoged.userGroup === 'ADMIN'
            ? < Link className={classesLink} to="/admin/user/list">
              <button >
                Users
              </button>
            </Link>
            : ''
        }
        {
          isLoged
            ?
            userLoged.userGroup &&
            userLoged.userGroup === 'ADMIN' &&
            <Link className={classesLink} to="/admin/user/register">
              <button >
                Register
              </button>
            </Link>
            :
            <Link className={classesLink} to="/client/register">
              <button >
                Register
              </button>
            </Link>
        }
        {
          isLoged
            ? <>
              {
                userLoged.userGroup
                  ? <>
                    <Link className={classesLink} to={`/admin/user/${userLoged.id}/edit`}>
                      <button >
                        Dados
                      </button>
                    </Link>
                    <Link className={classesLink} to='/storage'>
                      <button >
                        Storage
                      </button>
                    </Link>
                  </>
                  :
                  (<>
                    <Link className={classesLink} to="/client/:id/edit">
                      <button >
                        Dados
                      </button>
                    </Link>
                  </>)

              }
              <Link className={classesLink} to="/orders">
                <button >
                  Pedidos
                </button>
              </Link>
              <Link className={classesLink} to="/admin/login" onClickCapture={signOut}>
                <button >
                  Sair
                </button>
              </Link>
            </>
            : <Link className={classesLink} to="/admin/login">
              <button >
                Login
              </button>
            </Link>
        }
        <Link className={classesLink} to="/cart">
          <button className={styles.headerCart}>
            <img src={cartIcon} alt="" />
            {totalProductsInCart > 0 && <span>{totalProductsInCart}</span>}
          </button>
        </Link>
      </div>
    </div >
  );
};
