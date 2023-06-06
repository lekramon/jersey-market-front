import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Product } from '../../../../components/ProductCard';
import styles from './styles.module.scss';
import { CartContext } from '../../../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>()
    const [selectedImage, setSelectedImage] = useState(0);
    const [temProximo, setTemProximo] = useState(false);
    const [temAnterior, setTemAnterior] = useState(false);
    const [images, setImages] = useState<any[]>([])
    const { addNewProductToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const getProduct = async () => {
        const { data } = await axios.get('https://jersey-market-api-production.up.railway.app/product/list');
        let idNumber = id ? parseInt(id) : -1;
        let filteredProduct = data.filter((item: Product) => item.id === idNumber);
        setProduct(filteredProduct[0]);
        await getImages(filteredProduct[0].id);
    };

    const getImages = async (id: number) => {
        const { data } = await axios.get(`https://jersey-market-api-production.up.railway.app/product/img/id${id}`);
        if (data.length > 0) {
            if (data.length > 1) {
                setTemProximo(true);
            }
            setImages(data);
        }
    }

    const paginar = (proximaPagina: boolean) => {
        if (proximaPagina) {
            setSelectedImage(selectedImage + 1);
            setTemAnterior(true);
            if (selectedImage + 1 === images.length - 1) {
                setTemProximo(false);
            }
        } else {
            setSelectedImage(selectedImage - 1);
            setTemProximo(true);
            if (selectedImage - 1 == 0) {
                setTemAnterior(false);
            }
        }
    }

    const adicionarCarrinho = () => {
        let produto = { ...product, amount: 1 }

        addNewProductToCart(produto, 'cart');
        navigate('/cart');
    }

    useEffect(() => {
        getProduct();
    }, []);
    return (
        <div className='ml-4 mt-10 flex flex-row items-center'>
            <div className='flex flex-row items-center'>
                <button onClick={() => paginar(false)} disabled={!temAnterior} className='border-2 bg-green-500 disabled:bg-zinc-200 rounded-full py-2 px-4 '>
                    <span>{'<'}</span>
                </button>
                <div className='flex flex-col flex-grow items-center w-1/2 h-fit justify-center'>
                    <div className='ml-12 mr-12 w-96 h-96 rounded-md shadow-md'>
                        <img className='w-fit h-fit' src={images.length > 0 ? `data:image/${images[selectedImage].type};base64,${images[selectedImage].data}` : ''} alt={product?.name} />
                    </div>
                    <div className='pt-4'>
                        <span >Preço: {product?.price.toLocaleString()}</span>
                    </div>
                </div>
                <button onClick={() => paginar(true)} disabled={!temProximo} className='border-2 bg-green-500 disabled:bg-zinc-200 rounded-full py-2 px-4'>
                    <span>{'>'}</span>
                </button>
            </div>
            <div className='flex flex-col flex-grow items-center'>
                <span className='text-xl mb-4'>{product?.name}</span >
                <div className='flex w-1/2 h-fit flex-col items-center space-y-8 shadow-lg border-t-2 bg-zinc-100 rounded-lg p-12'>
                    <div className='flex-1 ml-4'>
                        <span>{product?.description}</span>
                    </div>
                </div>
                <div className='mt-4 border bg-green-500 rounded-lg p-2'>
                    <button onClick={adicionarCarrinho}>
                        Adicionar ao carrinho
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductPage