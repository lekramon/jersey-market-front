import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../../../contexts/CartContext';
import Modal from '../../../../components/Modal/Modal';
import AdressForm from '../../../../components/AdressForm/AdressForm';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import ReactInputMask from 'react-input-mask';

interface FormData {
    name: string;
    dataNascimento: string;
    gender: number,
    password?: string
}

const ClientPage = (props: any) => {
    const { userLoged, signIn } = useContext(CartContext);
    const [enderecos, setEnderecos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [estadoAlteracao, setEstadoAlteracao] = useState(false);
    const [enderecoPadrao, setEnderecoPadrao] = useState();

    const gender = userLoged.gender === 'MASCULINE' ? 1 : 2;
    const validarData = (value: string) => {
        value = value.replaceAll('_', '');
        var date_regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
        if (!(date_regex.test(value))) {
            return false;
        }
        if (new Date(value.split('/').reverse().join('-')) > new Date()) {
            return false;
        }
        return true;
    }

    const schema = yup.object().shape({
        name: yup.string().required('Nome é obrigatório').matches(/^([A-Za-z]{3,})+ ([A-Za-z]{3,})$/, 'É necessário informar Nome Completo.').default(userLoged.name),
        // confirmPassword: yup
        //     .string()
        //     .required('Confirmar senha é obrigatório')
        //     .oneOf([yup.ref('password')], 'As senhas não coincidem.').default(''),
        dataNascimento: yup.string().required('Data de Nascimento é obrigatória.').test('test-date', 'Data inválida ou maior que a atual.', validarData).default(userLoged.date || userLoged.dataNascimento),
        gender: yup.number().required().default(gender)
    });

    const initialValues = schema.cast({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: initialValues
    });

    const classesDiv = 'flex flex-1 border border-green-600 shadow-xl h-96 m-12 rounded-lg flex-col items-center';
    const classesInput = `py-1 px-4 border border-green-600 rounded-md w-60 disabled:bg-zinc-200`;
    const classesDivInput = 'flex flex-col w-full relative';
    const classesBotoes = 'w-full flex flex-grow justify-center p-2 rounded-xl bg-green-600 text-white disabled:bg-zinc-400';
    const classesErro = 'text-xs text-red-500 absolute top-14 pt-1';

    const buscarEnderecos = async () => {
        const { data } = await axios.get(`https://jersey-market-api-production.up.railway.app/client/address/id${userLoged.id}`);
        let enderecosAlterados = data.map((item: any) => {
            return {
                ...item,
                checked: item.type === 'DEFAULT'
            }
        });

        setEnderecos(enderecosAlterados);

    }

    const fecharModal = () => {
        if (showModal) {
            setShowModal(false);
        }
    }

    const cancelarAlteracao = () => {
        resetField('name');
        resetField('dataNascimento');
        resetField('gender');
        setEstadoAlteracao(false);
    }

    const alterarEnderecoPadrao = (e: any) => {
        if (e.currentTarget) {
            setEnderecoPadrao(e.currentTarget.value);
            e.currentTarget.checked = true;
        }
    }

    const onSubmit = async (data: FormData) => {
        try {
            if (!data.password || data.password === '') {
                delete data.password;
            }
            await axios.put(`https://jersey-market-api-production.up.railway.app/client/id${userLoged.id}/update`, data)
                .then((response) => signIn(response.data));
            toast.success('Usuário alterado com sucesso!', {
                position: toast.POSITION.TOP_RIGHT,
            });
            setEstadoAlteracao(false);
        } catch (e) {
            toast.error('Houve um erro inesperado, tente novamente!', {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(e);
        }
    }

    const callBackEndereco = async () => {
        setShowModal(false);
        await buscarEnderecos();
    }
    useEffect(() => {
        buscarEnderecos();
    }, []);

    return (
        <>
            <div onClick={() => fecharModal()} className={`flex flex-col justify-center w-full h-ful ${showModal ? 'opacity-25' : ''}`}>
                <ToastContainer />
                <span className='border-b-2 flex flex-1 justify-center pb-2'>Dados do Cliente</span>
                <div className='flex flex-row gap-12'>
                    <div className={classesDiv}>
                        <span className='p-2 border-b-2'>Informações Pessoais</span>
                        <div className='flex flex-col justify-between items-center flex-1 mb-4'>
                            <div className='grid grid-cols-2 gap-6 mt-4'>
                                <div className={classesDivInput}>
                                    <label className='pl-1'>Nome</label>
                                    <input {...register('name')} disabled={!estadoAlteracao} className={`${classesInput} ${errors.name && 'border-red-500'}`} />
                                    {errors.name && <p className={classesErro}>{errors.name.message}</p>}
                                </div>
                                <div className={classesDivInput}>
                                    <label className='pl-1'>Data de Nascimento</label>
                                    <ReactInputMask
                                        mask={'99/99/9999'} autoComplete='off' {...register('dataNascimento')} type='text' disabled={!estadoAlteracao} className={`${classesInput} ${errors.dataNascimento && 'border-red-500'}`} />
                                    {errors.dataNascimento && <p className={classesErro}>{errors.dataNascimento.message}</p>}
                                </div>
                                <div className={classesDivInput}>
                                    <label className='pl-1'>CPF</label>
                                    <input disabled value={userLoged.cpf} className={classesInput} />
                                </div>
                                <div className={classesDivInput}>
                                    <label className='pl-1'>E-mail</label>
                                    <input disabled value={userLoged.email} className={classesInput} />
                                </div>
                                <div className={classesDivInput}>
                                    <label className='pl-1'>Gênero</label>
                                    <select {...register('gender')} disabled={!estadoAlteracao} className={`${classesInput} ${errors.dataNascimento && 'border-red-500'}`}>
                                        <option value="1">Masculino</option>
                                        <option value="2">Feminino</option>
                                    </select>
                                    {errors.gender && <p className={classesErro}>{errors.gender.message}</p>}
                                </div>
                                {estadoAlteracao && <div className={classesDivInput}>
                                    <label className='pl-1'>Nova Senha</label>
                                    <input {...register('password')} disabled={!estadoAlteracao} className={`${classesInput} ${errors.password && 'border-red-500'}`} />
                                    {errors.password && <p className={classesErro}>{errors.password.message}</p>}
                                </div>
                                }
                            </div>
                            <div>
                                {
                                    estadoAlteracao
                                        ? <div className='flex flex-row gap-8 w-full'>
                                            <div className='w-40'>
                                                <button onClick={handleSubmit(onSubmit)} className={classesBotoes}>
                                                    Salvar
                                                </button>
                                            </div>
                                            <div className='w-40'>
                                                <button onClick={cancelarAlteracao} className={classesBotoes}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                        : <div className='w-40'>
                                            <button onClick={() => setEstadoAlteracao(true)} className={classesBotoes}>
                                                Alterar Dados
                                            </button>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={classesDiv}>
                        <span className='p-2 border-b-2'>Endereços</span>
                        <div className='flex flex-col justify-between items-center flex-1 mb-4'>
                            <div className='flex flex-col w-full mt-4 space-y-4'>
                                {
                                    enderecos.map((endereco: any) => {
                                        return (
                                            <div key={endereco.id} className='flex justify-start'>
                                                <input name='rdEnderecoPadrao' type="radio" onChange={alterarEnderecoPadrao} value={endereco.id} />
                                                <span className='ml-2'>{endereco.logradouro}</span>
                                                <span>, {endereco.numero}</span>
                                                <span>, {endereco.bairro}</span>
                                                <span>, {endereco.localidade}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='flex flex-row gap-8'>
                                <div className='w-40'>
                                    <button onClick={() => setShowModal(true)} className={classesBotoes}>Adicionar Endereço</button>
                                </div>
                                <div className='w-40'>
                                    <button disabled className={classesBotoes}>Salvar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Modal showModal={showModal} setShowModal={setShowModal} component={<AdressForm idCliente={userLoged.id} type={1} callBack={callBackEndereco} />} />
        </>
    )
}

export default ClientPage