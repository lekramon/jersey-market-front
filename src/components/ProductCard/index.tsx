import styles from './styles.module.scss';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { ProductController } from '../ProductController';
import { Link } from 'react-router-dom';
import axios from 'axios';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imagemSrc: string;
  amount: number;
};
interface ProductCardProps {
  product: Product;
  pageType: string;
}

export const ProductCard = ({ product, pageType }: ProductCardProps) => {
  const productTag = (text: string) => <span key={text}>{text}</span>;
  const { name, description, price, tags } = product;
  const [imagem, setImage] = useState('');

  const getImages = async () => {
    const { data } = await axios.get(`https://jersey-market-api-production-1377.up.railway.app/product/img/id${product.id}`);
    if (data.length > 0) {
      let imagem = data[0];
      setImage(`data:image/${imagem.type};base64,${imagem.data}`);
    }
  }

  useEffect(() => {
    getImages();
  }, [])

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardContent}>
        <Link to={`/product/${product.id}/view`}>
          <img src={imagem} alt="Falha ao carregar imagem" className='w-56 h-56' />

          <div className={styles.productInfo}>
            <div className={styles.productTag}>{tags && tags.map((tag) => productTag(tag))}</div>
            <h3>{name}</h3>
            {/* <p>{formataDescricao(description)}</p> */}
          </div>
        </Link>

        <div className={styles.priceContainer}>
          <span>
            R$ <b>{price}</b>
          </span>
          <ProductController product={product} pageType={pageType} />
        </div>
      </div>
    </div>
  );
};
function setSelectedImage(arg0: string) {
  throw new Error('Function not implemented.');
}

