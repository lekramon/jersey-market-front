import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Orders = (props: any) => {
    const navigate = useNavigate();
    const { userLoged } = useContext(CartContext);
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [enderecos, setEnderecos] = useState<any[]>([]);
    const [alterarPedidos, setAlterarPedidos] = useState<any[]>([]);

    const carregaDados = async () => {
        if (userLoged.userGroup) {
            const { data } = await axios.get(`https://jersey-market-api-production-1377.up.railway.app/pedidos/all`);
            setPedidos(data);

            const response = await axios.get('https://jersey-market-api-production-1377.up.railway.app/product/list');
            setProdutos(response.data.filter((product: any) => product.status === 'ACTIVE'));

            let usuarios: any[] = [];
            data.forEach((item: any) => {
                if (usuarios.filter((idCliente) => idCliente == item.clientId).length == 0) {
                    usuarios.push(item.clientId);
                }
            });
            for (let i = 0; i < usuarios.length; i++) {
                const addressResponse = await axios.get(`https://jersey-market-api-production-1377.up.railway.app/client/address/id${usuarios[i]}`);
                if (addressResponse.status === 200) {
                    setEnderecos([...enderecos, ...addressResponse.data]);
                }
            }
            ;

        } else {
            const { data } = await axios.get(`https://jersey-market-api-production-1377.up.railway.app/pedidos/cliente/id${userLoged.id}`);
            setPedidos(data);

            const response = await axios.get('https://jersey-market-api-production-1377.up.railway.app/product/list');
            setProdutos(response.data.filter((product: any) => product.status === 'ACTIVE'));

            const addressResponse = await axios.get(`https://jersey-market-api-production-1377.up.railway.app/client/address/id${userLoged.id}`);
            setEnderecos(addressResponse.data);
        }
    }

    const buscaEndereco = (id: any): string => {
        if (enderecos.length > 0) {
            let endereco = enderecos.find((item) => item.id == id);
            if (endereco) {
                return `${endereco.logradouro}, ${endereco.numero}, Bairro: ${endereco.bairro} - ${endereco.localidade}`;
            }
        }
        return '';
    }

    const getStatus = (statusBase: string): string => {
        switch (statusBase) {
            case 'PREPARATION':
                return 'Em Preparação';
            case 'DELIVERY':
                return 'Em Transporte';
            case 'DELIVERED':
                return 'Entregue';
            default:
                return '';
        }
    }

    const getStatusString = (statusBase: number): string => {
        switch (statusBase) {
            case 0:
                return 'PREPARATION';
            case 1:
                return 'DELIVERY';
            case 2:
                return 'DELIVERED';
            default:
                return '';
        }
    }

    const getTotalItens = (itensPedidos: any[]) => {
        let soma = 0
        itensPedidos.forEach((item) => soma += item.quantidade);
        return soma;
    }

    const getProduto = (id: any) => {
        if (produtos.length > 0) {
            return produtos.find(produto => produto.id == id);
        }
        return null;
    }

    const alterarStatus = (e: any, idPedido: any) => {
        if (e.currentTarget) {
            let valorStatus = e.currentTarget.value;
            if (idPedido && valorStatus !== '') {
                let alteracao = {
                    status: valorStatus,
                    idPedido
                }
                if (alterarPedidos.length > 0) {
                    let indexPedido = alterarPedidos.findIndex((pedido) => pedido.idPedido == idPedido);
                    if (indexPedido >= 0) {
                        alterarPedidos[indexPedido] = alteracao;
                        setAlterarPedidos(alterarPedidos);
                    } else {
                        setAlterarPedidos([...alterarPedidos, alteracao])
                    }
                } else {
                    setAlterarPedidos([...alterarPedidos, alteracao]);
                }
            }
        }
    }

    const salvarStatus = async (idPedido: any) => {
        let alteracao = alterarPedidos.find((pedido) => pedido.idPedido == idPedido);
        if (alteracao) {
            try {
                const data = { status: +alteracao.status }
                await axios.put(`https://jersey-market-api-production-1377.up.railway.app/pedidos/id${idPedido}/update`, data);
                toast.success('Pedido alterado com sucesso !', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                let indexPedidoAlterado = pedidos.findIndex((item) => item.pedidoId == idPedido);
                if (indexPedidoAlterado >= 0) {
                    pedidos[indexPedidoAlterado].statusDelivery = getStatusString(+alteracao.status);
                    setPedidos(pedidos);
                }
            } catch (e) {
                toast.error('Houve um erro inesperado, tente novamente!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.log(e);
            }
        }
    }

    useEffect(() => {
        carregaDados()
    }, [pedidos])

    return (
        <>
            <ToastContainer />
            <div className='mb-8 flex flex-1 justify-center w-full'>
                <h1 className='font-bold text-2xl border-b-2 w-full flex justify-center'>
                    {userLoged.userGroup ? 'Pedidos dos Clientes' : 'Meus Pedidos'}
                </h1>
            </div>
            <div className='space-y-4 mx-8'>
                {
                    pedidos.length > 0 ? pedidos.map((item) => (
                        <div key={item.id} className='flex w-full h-fit flex-col rounded-xl shadow-md'>
                            <div className='w-full h-24 space-y-4 shadow-xl bg-green-100 flex flex-col items-center justify-center rounded-lg'>
                                <div className='flex flex-row w-full'>
                                    <div className='flex ml-4 justify-center flex-row'>
                                        <span className='font-bold pr-2'>Pedido:</span>
                                        <span>{item.pedidoId.toString().padStart(4, '0')}</span>
                                    </div>
                                    <div className='flex flex-1 justify-center flex-row'>
                                        <span className='font-bold pr-2'>Realizado em:</span>
                                        <span>{item.registrationDate && new Date(item.registrationDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className='flex flex-1 justify-center flex-row'>
                                        <span className='font-bold pr-2'>Valor: </span>
                                        <span>R$ {item.valorTotal.toLocaleString()}</span>
                                    </div>
                                    <div className='flex flex-1 justify-center flex-row'>
                                        <span className='font-bold pr-2'>Total de itens: </span>
                                        <span>{getTotalItens(item.itensPedido)}</span>
                                    </div>
                                    <div className='flex flex-1 justify-center flex-row'>
                                        <span className='font-bold pr-2'>Pagamento: </span>
                                        <span>
                                            {item.pagamento === 'CREDIT' ? 'Cartão de Crédito' : item.pagamento}
                                        </span>
                                    </div>
                                    <div className='flex flex-1 justify-center flex-row'>
                                        <span className='font-bold pr-2'>Status: </span>
                                        <span>{getStatus(item.statusDelivery)}</span>
                                    </div>
                                </div>
                                <div className='flex w-full flex-row justify-between ml-8'>
                                    <div>
                                        <span className='font-bold pr-2'>Endereço:</span>
                                        <span>{buscaEndereco(item.addressId)}</span>
                                    </div>
                                    {userLoged.userGroup &&
                                        <div className='pr-12'>

                                            <span className='font-bold pr-2'>Alterar Status:</span>
                                            <select className='bg-green-200 p-1 rounded-lg' onChange={(e) => alterarStatus(e, item.pedidoId)}>
                                                <option value=''>Novo status</option>
                                                <option value={0}>Em Preparação</option>
                                                <option value={1}>Em Transporte</option>
                                                <option value={2}>Entregue</option>
                                            </select>
                                            <button className='py-1 px-4 bg-green-200 ml-4 rounded-lg' onClick={() => salvarStatus(item.pedidoId)}>Salvar</button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='mx-4 my-8 space-y-4'>
                                {
                                    item.itensPedido.length > 0 && item.itensPedido.map((itemPedido: any) => {
                                        let produto = getProduto(itemPedido.produtoId);
                                        return (
                                            <>
                                                {produto &&
                                                    <div key={itemPedido.produtoId} className='flex flex-row flex-grow'>
                                                        <div className='flex-1'>
                                                            <span>{produto.name}</span>
                                                        </div>
                                                        <div className='flex-1 flex justify-center'>
                                                            <span>R$ {produto.price.toLocaleString()}</span>
                                                        </div>
                                                        <div className='flex-1'>
                                                            <span>Quantidade: {itemPedido.quantidade}</span>
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                        : <div>
                            <h1 className='flex flex-grow items-center justify-center text-2xl'>Não há pedidos cadastros.</h1>
                        </div>
                }
            </div>
        </>
    );
}


export default Orders