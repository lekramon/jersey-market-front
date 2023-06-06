import { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '../../contexts/CartContext';
// import { Product } from '../../contexts/CartContext';
import { Product } from '../ProductCard';
import { ProductController } from '../ProductController';
import './OrderResume.css'
import { CalcularFrete } from '../../services/CalcularFrete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Payment from '../Payment/Payment';
import { ToastContainer, toast } from 'react-toastify';

interface FormData {
  name: string;
  numero: string;
  mes: number;
  ano: number;
}

export const OrderResume = () => {
  const { products, totalPrice, totalPriceNumber, isLoged, userLoged, cleanCart } = useContext(CartContext);
  const [frete, setFrete] = useState(0);
  const [cep, setCep] = useState('');
  const [cepInvalido, setCepInvalido] = useState(false);
  const [freteIndisponivel, setFreteIndisponivel] = useState(false);
  const [enderecoPadrao, setEnderecoPadrao] = useState<any>();
  const [pagamento, setPagamento] = useState(false);

  const refCep = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const onlyNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let regex = /\d+/g
    if (regex.test(e.currentTarget.value)) {
      setCep(e.currentTarget.value);
    }
  }

  const buscarEndereco = async (id: number) => {
    const { data } = await axios.get(`https://jersey-market-api-production-1377.up.railway.app/client/address/id${id}`);
    if (data.length > 0) {
      let enderecoFiltrado = data.filter((item: any) => item.type === 'DEFAULT');
      let endereco = enderecoFiltrado.length > 0 ? enderecoFiltrado[0] : data[0];

      setEnderecoPadrao(endereco);
      let cepPadrao = endereco.cep ? endereco.cep.replace('-', '') : '';
      setCep(cepPadrao);
      calcularFrete(cepPadrao);
    }
  }
  const calcularFrete = (cepAux?: string) => {
    let cepCalcular = cepAux || cep;
    if (cepCalcular.length < 8) {
      setCepInvalido(true);
    } else {
      setCepInvalido(false);
      let valorFrete = CalcularFrete(cepCalcular);
      if (valorFrete < 0) {
        setFreteIndisponivel(true);
      } else {
        setFreteIndisponivel(false);
        setFrete(valorFrete);
      }
    }
  }

  const irPagamento = () => {
    if (!isLoged) {
      navigate('/client/register');
    }
    setPagamento(true);
  }

  const finalizarCompra = async (tipo: number, dadosCartao?: FormData) => {
    const itensPedido = products.map((item: Product) => {
      return {
        produtoId: item.id,
        quantidade: item.amount,
        precoUnitario: item.price
      }
    });
    const data = {
      clientId: userLoged.id,
      frete,
      pagamento: tipo,
      addressId: enderecoPadrao.id,
      itensPedido
    };

    try {
      await axios.post('https://jersey-market-api-production-1377.up.railway.app/pedidos', data);
      toast.success('Pedido realizado com sucesso !', {
        position: toast.POSITION.TOP_RIGHT,
      });
      cleanCart();
      setTimeout(() => { navigate('/') }, 1500);
    } catch (e) {
      toast.error('Houve um erro inesperado, tente novamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(e);
    }
  }

  useEffect(() => {
    if (isLoged && !enderecoPadrao) {
      buscarEndereco(userLoged.id);
    }
  }, [])

  return (
    <>
      <ToastContainer />
      {
        products.length > 0
          ? <div className='flex flex-row'>
            {
              pagamento
                ? <div className='w-1/2 flex flex-col items-center'>
                  <Payment finalizarCompra={finalizarCompra} />
                </div>
                : <div className='w-1/2 flex flex-col items-center'>
                  <span className='text-2xl pb-4 pr-8'>Produtos</span>
                  <ul className='space-y-4 text-lg overflow-y-scroll pr-8 pb-4'>
                    {products.map((product: Product) => (
                      <li className='w-96 shadow-lg p-2' key={product.id}>
                        <img src={product.imagemSrc} alt="" />
                        <div>
                          <span>{product.name}</span>
                          <div className='mt-2'>
                            <ProductController product={product} pageType="cart" />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
            }
            <div className='ml-24'>
              <div className='w-80 flex flex-col items-center shadow-lg p-12 rounded-lg'>
                <span className='mb-4'>Subtotal</span>
                <div className='flex items-start flex-col'>
                  <div className='flex flex-row w-48 justify-between flex-grow'>
                    <span>Produtos:  </span>
                    <span className='ml-1 text-green-600'> R$ {totalPrice}</span>
                  </div>
                  <div className='flex flex-row w-48 justify-between flex-grow'>
                    <span>Frete:  </span>
                    <span className='ml-1 text-green-600'>R$ {frete.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className='flex flex-row w-48 mt-2 justify-between flex-grow border-t-2'>
                    <span>Total:  </span>
                    <span className='ml-1 text-green-600'>R$ {Number(totalPriceNumber + frete).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className='mt-4 flex w-80 justify-center items-center flex-col border rounded-lg p-2 '>
                <span className='flex flex-grow'>Frete</span>
                <input ref={refCep} value={cep} onChange={onlyNumber} type='text' maxLength={8} className='border-2 border-green-600 rounded-md flex flex-grow text-center w-full' />
                {cepInvalido && <span className='mt-1 text-xs text-red-500'>CEP inválido</span>}
                <button onClick={() => calcularFrete()} className='flex w-full mt-2 p-2 justify-center rounded-xl bg-green-600 text-white'>
                  Calcular
                </button>
              </div>
              <div className='w-80 mt-12 flex items-center flex-col'>
                {
                  !pagamento
                    ? <button disabled={freteIndisponivel} onClick={irPagamento} className='w-full flex flex-grow justify-center p-4 rounded-xl bg-green-600 text-white disabled:bg-zinc-400'>
                      Ir Para Pagamento
                    </button>
                    : <button disabled={freteIndisponivel} onClick={() => setPagamento(false)} className='w-full flex flex-grow justify-center p-4 rounded-xl bg-green-600 text-white disabled:bg-zinc-400'>
                      Voltar
                    </button>
                }
                {freteIndisponivel && <span className='text-lg text-red-500'>Frete indisponível para região</span>}
              </div>
            </div>
          </div>
          : <div>
            <h1 className='flex flex-grow items-center justify-center text-2xl'>O carrinho está vazio.</h1>
          </div>
      }
    </>
  );
};
