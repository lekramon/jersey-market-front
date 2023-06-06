import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ReactInputMask from 'react-input-mask';
import styles from './styles.module.scss';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoIMG from '../../assets/logoXgames.png';

export interface Adress {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    numero: number;
    complemento?: string;
    type: number
}

export default function AdressForm(props: any) {
    const navigate = useNavigate();
    const { type, idCliente, createUser, callBack } = props;

    const schema = yup.object().shape({
        cep: yup.string().required('CEP é obrigatório'),
        numero: yup.number().required('Número é obrigatório.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Adress>({
        resolver: yupResolver(schema),
    });

    const buscaCep = async (e: any) => {
        let cepApenasNumeros = e.currentTarget.value.replace(/[^0-9]+/g, '');
        if (cepApenasNumeros.length === 8) {
            await axios.get(`https://viacep.com.br/ws/${cepApenasNumeros}/json/`).then(
                (response) => {
                    popularCampos(response.data);
                }
            )
        } else {
            popularCampos()
        }
    }

    const popularCampos = (data?: Adress) => {
        let input = document.getElementById('logradouro') as HTMLInputElement;
        input.value = (data ? data.logradouro : '');

        input = document.getElementById('bairro') as HTMLInputElement;
        input.value = (data ? data.bairro : '');

        input = document.getElementById('uf') as HTMLInputElement;
        input.value = (data ? data.uf : '');

        input = document.getElementById('localidade') as HTMLInputElement;
        input.value = (data ? data.localidade : '');
    }

    const popularDadosCamposDesabilitados = (data: Adress) => {
        let input = document.getElementById('logradouro') as HTMLInputElement;
        data.logradouro = input.value;

        input = document.getElementById('bairro') as HTMLInputElement;
        data.bairro = input.value;

        input = document.getElementById('uf') as HTMLInputElement;
        data.uf = input.value;

        input = document.getElementById('localidade') as HTMLInputElement;
        data.localidade = input.value;

    }

    const onlyNumber = (e: any) => {
        let regex = /\d+/g
        if (e.keyCode != 8 && !regex.test(e.key)) {
            e.preventDefault();
        }
    }

    const onSubmit = async (data: Adress) => {
        data.type = type || 0;
        let id = 0;
        if (idCliente) {
            id = idCliente;
        } else {
            let user = await createUser(true);
            id = user.id;
        }
        try {
            popularDadosCamposDesabilitados(data);
            await axios.post(`https://jersey-market-api-production-1377.up.railway.app/client/address/id${id}/register`, data);
            toast.success('Usuário cadastrado com sucesso !', {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (callBack) {
                callBack();
            } else {
                setTimeout(() => { navigate('/admin/login') }, 2000);
            }
        } catch (e) {
            toast.error('Houve um erro inesperado, tente novamente!', {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(e);
        }
    };

    const classesDesabilitados = 'disabled:bg-zinc-200';

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
            <ToastContainer />

            <div className={styles.formContent}>
                <div className='flex flex-row space-x-4'>
                    <img
                        className='w-12 h-12'
                        src={logoIMG}
                        alt='Logo'
                    />
                    <h1 className='pt-1'>Adicionar Endereço</h1>
                </div>
                <div className={styles.inputContainer}>
                    <div>
                        <label>
                            CEP*
                            <ReactInputMask
                                onKeyUp={buscaCep}
                                mask={'99999-999'}
                                type="text"
                                {...register('cep')}
                                placeholder="CEP*"
                                className={errors.cep ? styles.error : ''}
                            />
                        </label>
                        {errors.cep && <p className={styles.errorMessage}>{errors.cep.message}</p>}
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <div>
                        <label>
                            Logradouro
                            <input
                                id='logradouro'
                                disabled
                                type='text'
                                placeholder="Logradouro"
                                {...register('logradouro')}
                                className={classesDesabilitados}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Bairro
                            <input
                                id='bairro'
                                disabled
                                type='text'
                                placeholder="Bairro"
                                {...register('bairro')}
                                className={classesDesabilitados}
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.inputContainer}>
                    <div>
                        <label>
                            Localidade
                            <input
                                id='localidade'
                                disabled
                                type='text'
                                placeholder="Localidade"
                                {...register('uf')}
                                className={classesDesabilitados}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            UF
                            <input
                                id='uf'
                                disabled
                                type='text'
                                placeholder="UF"
                                {...register('uf')}
                                className={classesDesabilitados}
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.inputContainer}>
                    <div>
                        <label>
                            Número*
                            <input
                                maxLength={8}
                                type='text'
                                onKeyDown={onlyNumber}
                                placeholder="Número*"
                                {...register('numero')}
                                className={errors.numero ? styles.error : ''}
                            />
                        </label>
                        {errors.numero && <p className={styles.errorMessage}>{errors.numero.message}</p>}
                    </div>
                    <div>
                        <label>
                            Complemento
                            <input
                                // input options
                                type='text'
                                placeholder="Complemento"
                                {...register('complemento')}
                            />
                        </label>
                    </div>
                </div>
                <button type="submit">{!idCliente ? 'Confirmar Cadastro' : 'Adicionar'}</button>
            </div>
        </form>
    );
};
