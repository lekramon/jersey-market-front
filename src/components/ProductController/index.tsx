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
  const [productAmount, setProductAmount] = useState(product.amount || 1);
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

  const editProductAmountCart = (increase: boolean) => {
    if (increase) {
      addNewProductToCart(productProps, pageType);
      increaseProductAmount();
    } else {
      addNewProductToCart(productProps, pageType, true);
      decreaseProductAmount();
    }
  }

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
            pageType === 'cart' ? editProductAmountCart(false) : decreaseProductAmount();
          }}
          disabled={productAmount === 1}
        >
          -
        </button>
        <span>{productAmount}</span>
        <button
          onClick={() => {
            pageType === 'cart' ? editProductAmountCart(true) : increaseProductAmount();
          }}
        >
          +
        </button>
      </div>
      <button
        className='flex flex-row'
        onClick={() => {
          addProductToCart();
        }}
      >
        <img className='w-8 h-8 pt-2 pr-2' src={buttonIcon} alt="" />
        {pageType === 'cart' && <span className='pt-1.5'>Remover</span>}
      </button>
    </div>
  );
};
