import React, { useContext, useEffect, useState } from 'react'
import { CartContext, Product } from '../../contexts/CartContext';
import axios from 'axios';
import Modal from '../../components/Modal/Modal';
import EditProductForm from '../../components/EditProductForm/EditProductForm';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AddImage from '../../components/AddImage/AddImage';

const StoragePage = () => {
    const { userLoged } = useContext(CartContext);
    let navigate = useNavigate();
    const admin = userLoged ? userLoged.userGroup && userLoged.userGroup === 'ADMIN' : navigate('/');
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalAddImagem, setShowModalAddImagem] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>();
    const [inclusao, setInclusao] = useState(false);

    const retrieveProducts = async () => {
        const { data } = await axios.get('https://jersey-market-api-production.up.railway.app/product/list');
        let ordenedData = data.sort(orderByRegistrationDate);
        setProducts(ordenedData);
        setFilteredProducts(ordenedData);
    };

    const orderByRegistrationDate = (a: any, b: any) => {
        let dateA = new Date(a.registrationDate);
        let dateB = new Date(b.registrationDate);

        if (dateA > dateB) {
            return 1;
        } else if (dateB > dateA) {
            return -1;
        } else {
            return 0;
        }
    }

    const filtrarProdutos = async () => {
        if (name !== '') {
            let filter = products.filter((product) => product.name.toLowerCase().includes(name))
            setFilteredProducts(filter);
        } else {
            await retrieveProducts();
        }
    }

    const setarName = (e: any) => {
        if (e.currentTarget) {
            setName(e.currentTarget.value);
        }
    }

    const openModal = (produto: any) => {
        setInclusao(false);
        setSelectedProduct(produto);
        setShowModal(true);
    }

    const openModalAddImagem = (produto: any) => {
        setSelectedProduct(produto);
        setShowModalAddImagem(true);
    }

    const openModalInsert = () => {
        setInclusao(true);
        setSelectedProduct({
            quantity: '',
            price: '',
            name: '',
            description: '',
            status: 'ACTIVE',
        });
        setShowModal(true);
    }

    const retornoAddImagem = () => {
        toast.success('Imagem incluída com sucesso!', {
            position: toast.POSITION.TOP_RIGHT,
        });
        setShowModalAddImagem(false);
    }

    const retornoAlterarProduto = () => {
        setShowModal(false);
        toast.success(`Produto ${inclusao ? 'incluído' : 'alterado'} com sucesso!`, {
            position: toast.POSITION.TOP_RIGHT,
        });
        return retrieveProducts();
    }

    useEffect(() => {
        retrieveProducts();
    }, []);

    return (
        <>
            <div className={`w-full flex justify-center flex-col ${showModal || showModalAddImagem ? 'opacity-25' : ''}`}>
                <ToastContainer />
                <div className='ml-12'>
                    <label>Nome:</label>
                    <input onChange={setarName} className='p-1 ml-2 border border-zinc-300 rounded-md w-96' />
                    <button onClick={filtrarProdutos} className='ml-2 w-24 bg-green-500 rounded-md text-white p-1'>
                        Pesquisar
                    </button>
                    {
                        admin &&
                        <button onClick={openModalInsert} className='ml-12 w-32 bg-green-500 rounded-md text-white p-1'>
                            Novo Produto
                        </button>
                    }
                </div>
                <div className='grid grid-cols-2 gap-12 m-12'>
                    {
                        filteredProducts &&
                        filteredProducts.length > 0 &&
                        filteredProducts.map((product) => {
                            return (
                                <div key={product.id} className='w-full h-fit p-4 border border-green-600 rounded-lg flex flex-col'>
                                    <div className='flex justify-center w-full border-b'>
                                        <span>{product.name}</span>
                                    </div>
                                    <div className='mt-2 justify-center w-full flex flex-row space-x-4'>
                                        <span>Código: {product.id}</span>
                                        <span>Quantidade: {product.quantity}</span>
                                        <span>Preço: {product.price}</span>
                                        <span>Status:</span>
                                        <span className={product.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>
                                            {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <div className='w-full flex justify-center mt-1 space-x-4'>
                                        <button onClick={() => openModal(product)} className='w-40 bg-green-500 rounded-md text-white' >
                                            Alterar
                                        </button>
                                        <button onClick={() => openModalAddImagem(product)} className='w-40 bg-green-500 rounded-md text-white' >
                                            Adicionar Imagem
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Modal showModal={showModal} setShowModal={setShowModal} component={<EditProductForm product={selectedProduct} callBack={retornoAlterarProduto} inclusao={inclusao} />} />
            <Modal showModal={showModalAddImagem} setShowModal={setShowModalAddImagem} component={<AddImage product={selectedProduct} callBack={retornoAddImagem} />} />
        </>
    )
}

export default StoragePage