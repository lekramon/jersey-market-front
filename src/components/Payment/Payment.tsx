import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import styles from './styles.module.scss';
import * as yup from 'yup';

interface FormData {
    name: string;
    numero: string;
    mes: number;
    ano: number;
}

const Payment = (props: any) => {
    const { finalizarCompra } = props;
    const [tipo, setTipo] = useState(0);
    const validarNumeroCartao = (value: string) => {
        let regex = /[^0-9]+/g;
        if (regex.test(value)) {
            return false;
        }
        return true;
    }

    const onlyNumber = (e: any) => {
        let regex = /\d+/g
        if (e.keyCode != 8 && !regex.test(e.key)) {
            e.preventDefault();
        }
    }

    const schema = yup.object().shape({
        name: yup.string().required('Nome é obrigatório'),
        numero: yup.string().min(16, 'O Número deve conter 16 caracteres numéricos').required('Número é obrigatório.').test('test-number', 'Número do cartão inválido.', validarNumeroCartao),
        mes: yup.number().min(1, 'Mês não pode ser zero.').max(12, 'Mês não pode ser maior que 12').required('Mês é obrigatório.'),
        ano: yup.number().min(new Date().getFullYear(), 'Ano não pode ser no passado.').required('Ano é obrigatório.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data: FormData) => {
        finalizarCompra(tipo, data);
    }

    const alterarTipo = (e: any) => {
        if (e.currentTarget) {
            setTipo(+e.currentTarget.value);
            console.log(e.currentTarget.value);
        }
    }

    return (
        <div className='ml-6 mt-4'>
            <div className='w-full flex justify-center'>
                <input checked={tipo === 0} onChange={alterarTipo} type='radio' name='rdTipoPagamento' value={0} />
                <label className='pl-2'>PIX</label>
                <input className='ml-8' checked={tipo === 1} onChange={alterarTipo} type='radio' name='rdTipoPagamento' value={1} />
                <label className='pl-2'>Cartão de Crédito</label>
                <input className='ml-8' checked={tipo === 2} onChange={alterarTipo} type='radio' name='rdTipoPagamento' value={2} />
                <label className='pl-2'>Boleto</label>
            </div>
            <div>
                {tipo === 1 ?
                    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
                        <ToastContainer />

                        <div className={styles.formContent}>
                            <div className={styles.inputContainer}>
                                <div>
                                    <label>
                                        Nome
                                        <input
                                            type="text"
                                            {...register('name')}
                                            placeholder="Nome"
                                            className={errors.name ? styles.error : ''}
                                        />
                                    </label>
                                    {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <div>
                                    <label>
                                        Número do Cartão
                                        <input
                                            type="text"
                                            {...register('numero')}
                                            onKeyDown={onlyNumber}
                                            placeholder="Número do Cartão"
                                            className={errors.numero ? styles.error : ''}
                                        />
                                    </label>
                                    {errors.numero && <p className={styles.errorMessage}>{errors.numero.message}</p>}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <div>
                                    <label>
                                        Mês de Vencimento
                                        <input
                                            id='mes'
                                            type='number'
                                            placeholder="Mês de Vencimento"
                                            {...register('mes')}
                                        />
                                    </label>
                                    {errors.mes && <p className={styles.errorMessage}>{errors.mes.message}</p>}
                                </div>
                                <div>
                                    <label>
                                        Ano de Vencimento
                                        <input
                                            id='ano'
                                            type='number'
                                            placeholder="Ano de Vencimento"
                                            {...register('ano')}
                                        />
                                    </label>
                                    {errors.ano && <p className={styles.errorMessage}>{errors.ano.message}</p>}
                                </div>
                            </div>
                            <button type="submit">Finalizar Compra</button>
                        </div>
                    </form>
                    : <div className='w-full mt-12 flex flex-col'>
                        <button className='w-80 flex flex-grow justify-center p-4 rounded-xl bg-green-600 text-white disabled:bg-zinc-400' onClick={() => finalizarCompra(tipo)}>Finalizar Compra</button>
                    </div>}

            </div>
        </div>
    )
}

export default Payment
