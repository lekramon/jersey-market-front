import { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
// import { Product } from '../../contexts/CartContext';
import { Product } from '../ProductCard';
import { ProductController } from '../ProductController';
import styles from './styles.module.scss';

export const OrderResume = () => {
  const { products } = useContext(CartContext);

  return (
    <div>
      <ul>
        {products.map((product: Product) => (
          <li key={product.id}>
            <img src={product.imageSrc} alt="" />
            <div>
              <span>{product.name}</span>
              <div>
                <ProductController product={product} pageType="cart" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
