import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProductCard } from '../../components/ProductCard';
import styles from './styles.module.scss';
export const ProductsList = () => {
  const [products, setProducts] = useState([]);

  const retrieveProducts = async () => {
    const { data } = await axios.get('http://localhost:3000/products');
    setProducts(data);
  };

  useEffect(() => {
    retrieveProducts();
  }, []);
  return (
    <section className={styles.productListContainer}>
      <h2>Nossos cafés</h2>
      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
};
