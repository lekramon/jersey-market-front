import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import { CartContext } from '../../contexts/CartContext';

type Product = {
    quantity: string;
    price: string;
    name: string;
    status: number;
    description: string
}

const EditProductForm = (props: any) => {
    const { product, callBack, inclusao } = props;
    const { userLoged } = useContext(CartContext);
    const admin = userLoged.userGroup && userLoged.userGroup === 'ADMIN';
    const classesInput = `py-1 px-4 border border-green-600 rounded-md disabled:bg-zinc-200`;
    const classesLabel = 'w-20 pt-1';
    const classesErro = 'text-red-500 text-xs pt-1 ml-24';
    const initialStatus = !product || product.status === 'ACTIVE' ? 1 : 0;

    const onlyNumber = (e: any) => {
        let regex = /[^0-9\.]/g
        if (e.keyCode != 8 && regex.test(e.key)) {
            e.preventDefault();
        }
    }

    const validarPositivo = (value: string) => {
        let numberValue = +value;
        if (!numberValue || numberValue <= 0) {
            return false;
        }
        return true;
    }

    const schema = yup.object().shape({
        quantity: yup.string().required('Quantidade é obrigatória').test('test-date', 'Quantidade inválida ou negativa.', validarPositivo).default(product.quantity.toString()),
        price: yup.string().required('Preço é obrigatório.').test('test-date', 'Preço inválido ou negativo.', validarPositivo).default(product.price.toString()),
        name: yup.string().required('Nome é obrigatório.').default(product.name),
        description: yup.string().required('Descrição é obrigatório.').default(product.description),
        status: yup.number().default(initialStatus)
    });

    const initialValues = schema.cast({});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Product>({
        resolver: yupResolver(schema),
        defaultValues: initialValues
    });

    const onSubmit = async (data: Product) => {
        try {
            if (inclusao) {
                await axios.post(`https://jersey-market-api-production.up.railway.app/product/register`, data);
            } else {
                await axios.put(`https://jersey-market-api-production.up.railway.app/product/id${product.id}/update`, data);
            }
            callBack();

        } catch (e) {
            toast.error('Houve um erro inesperado, tente novamente!', {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(e);
        }
    }

    return (
        <form className='w-full pt-16 pl-20 pr-20 pb-8 space-y-4 rounded-md' onSubmit={handleSubmit(onSubmit)}>
            <ToastContainer />
            <div className='flex flex-col'>
                <div className='flex flex-row space-x-4'>
                    <label className={classesLabel}>
                        Nome:
                    </label>
                    <input
                        disabled={!admin}
                        size={60}
                        className={`${classesInput} ${errors.name && 'border-red-500'}`}
                        id='name'
                        type='text'
                        placeholder="Nome"
                        {...register('name')}
                    />
                </div>
                {errors.name && <p className={classesErro}>{errors.name.message}</p>}
            </div>
            <div className='flex flex-col'>
                <div className='flex flex-row space-x-4'>
                    <label className={classesLabel}>
                        Descrição:
                    </label>
                    <textarea
                        disabled={!admin}
                        rows={4}
                        cols={62}
                        className={`${classesInput} ${errors.name && 'border-red-500'}`}
                        id='description'
                        placeholder="Descrição"
                        {...register('description')}
                    />
                </div>
                {errors.description && <p className={classesErro}>{errors.description.message}</p>}
            </div>
            <div className='flex flex-row'>
                <div className='flex flex-col'>
                    <div className='flex flex-row space-x-4'>
                        <label className={classesLabel}>
                            Quantidade:
                        </label>
                        <input
                            onKeyDown={onlyNumber}
                            className={`${classesInput} ${errors.quantity && 'border-red-500'}`}
                            id='quantity'
                            type='text'
                            placeholder="Quantidade"
                            {...register('quantity')}
                        />
                    </div>
                    {errors.quantity && <p className={classesErro}>{errors.quantity.message}</p>}
                </div>
                <div className='flex flex-col ml-4'>
                    <div className='flex flex-row space-x-4'>
                        <label className='pt-1'>
                            Preço:
                        </label>
                        <input
                            disabled={!admin}
                            onKeyDown={onlyNumber}
                            className={`${classesInput} ${errors.price && 'border-red-500'}`}
                            id='price'
                            type='text'
                            placeholder="Preço"
                            {...register('price')}
                        />
                    </div>
                    {errors.price && <p className='text-red-500 text-xs pt-1 ml-16'>{errors.price.message}</p>}
                </div>
            </div>
            <div className='flex flex-row space-x-4'>
                <label className={classesLabel}>
                    Status:
                </label>
                <select
                    disabled={!admin || inclusao}
                    className={`${classesInput} ${errors.status && 'border-red-500'}`}
                    id='status'
                    placeholder="Status"
                    {...register('status')}
                >
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                </select>
            </div>
            <div className='w-full flex justify-center'>
                <button type='submit' className='p-2 w-40 bg-green-500 text-white rounded-md'>{inclusao ? 'Adicionar' : 'Salvar'}</button>
            </div>
        </form>
    )
}

export default EditProductForm