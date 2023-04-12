import { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import styles from './styles.module.scss';
import { Product } from '../ProductCard';
import cartIcon from '../../assets/cart-icon-3.svg';
import trashIcon from '../../assets/trash-icon.svg';

interface ProductControllerProps {
  product: Product;
  pageType: string;
}

export const ProductController = ({ product, pageType }: ProductControllerProps) => {
  const [productAmount, setProductAmount] = useState(1);
  const { addNewProductToCart, removeProductToCart } = useContext(CartContext);

  const buttonIcon = pageType === 'cart' ? trashIcon : cartIcon;

  const productProps = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageSrc: product.imageSrc,
    amount: productAmount,
  };

  const addProductToCart = () => {
    if (pageType === 'cart') {
      removeProductToCart(productProps);
    } else {
      addNewProductToCart(productProps);
    }
  };

  const increaseProductAmount = () => {
    setProductAmount((amount) => amount + 1);
  };

  const decreaseProductAmount = () => {
    setProductAmount((amount) => amount - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.productControllers}>
        <button
          onClick={() => {
            pageType === 'cart' ? addNewProductToCart(productProps) : decreaseProductAmount();
          }}
          disabled={productAmount === 1}
        >
          -
        </button>
        <span>{productAmount}</span>
        <button
          onClick={() => {
            pageType === 'cart' ? addNewProductToCart(productProps) : increaseProductAmount();
          }}
        >
          +
        </button>
      </div>
      <button
        onClick={() => {
          addProductToCart();
        }}
      >
        <img src={buttonIcon} alt="" />
        {pageType === 'cart' && 'Remover'}
      </button>
    </div>
  );
};
