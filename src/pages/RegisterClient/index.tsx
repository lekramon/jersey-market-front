import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ReactInputMask from 'react-input-mask';
import styles from './styles.module.scss';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdressForm from '../../components/AdressForm/AdressForm';
import logoIMG from '../../assets/logoXgames.png';
import { useState } from 'react';

interface FormData {
  id: number;
  name: string;
  cpf: number;
  password: string;
  confirmPassword?: string;
  email: string;
  dataNascimentoValidar?: Date;
  dataNascimento: string;
  gender: number
}

export const RegisterClient = () => {
  const navigate = useNavigate();
  const [dataCreate, setDataCreate] = useState<FormData>();
  const [createAdress, setCreateAdress] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatório'),
    name: yup.string().required('Nome é obrigatório').matches(/^[A-Z]([A-Za-z])+(\s[A-Za-z]{3,}){0,3}$/, 'É necessário informar Nome Completo.'),
    confirmPassword: yup
      .string()
      .required('Confirmar senha é obrigatório')
      .oneOf([yup.ref('password')], 'As senhas não coincidem.'),
    cpf: yup.string().required('CPF é obrigatório.'),
    dataNascimentoValidar: yup.date().required('Data de Nascimento é obrigatória.').max(new Date(), 'Data de nascimento não pode ser futura.'),
    gender: yup.number().required()
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const createUser = async (naoRedirecionar?: boolean) => {
    try {
      let dadoRetorno = {};
      await axios.post('https://jersey-market-api-production-1377.up.railway.app/client/register', dataCreate)
        .then((response) => {
          dadoRetorno = response.data
        });
      if (!naoRedirecionar) {
        toast.success('Usuário cadastrado com sucesso !', {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => { navigate('/admin/login') }, 2000);
      } else {
        return dadoRetorno;
      }
    } catch (e) {
      toast.error('Houve um erro inesperado, tente novamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(e);
    }
  }

  const onSubmit = async (data: FormData) => {
    delete data.confirmPassword;

    data.dataNascimento = data.dataNascimentoValidar ? data.dataNascimentoValidar.toLocaleDateString() : '';
    delete data.dataNascimentoValidar;

    setDataCreate(data);
    setCreateAdress(true);
    // try {
    //   await axios.post('https://jersey-market-api-production-1377.up.railway.app/client/register', data);
    //   toast.success('Usuário cadastrado com sucesso !', {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    //   setTimeout(() => { navigate('/admin/login') }, 2000);
    // } catch (e) {
    //   toast.error('Houve um erro inesperado, tente novamente!', {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    //   console.log(e);
    // }
  };

  return (
    <>
      {
        createAdress
          ? <AdressForm createUser={createUser} type={0} insert={true} />
          : <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
            <ToastContainer />

            <div className={styles.formContent}>
              <div className='flex flex-row space-x-4'>
                <img
                  className='w-12 h-12'
                  src={logoIMG}
                  alt='Logo'
                />
                <h1 className='pt-1'>Cadastra-se</h1>
              </div>
              <div className={styles.inputContainer}>
                <div>
                  <label>
                    Nome*
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
                    CPF*
                    <ReactInputMask
                      // mask options
                      mask={'999.999.999-99'}
                      alwaysShowMask={false}
                      maskPlaceholder=""
                      // input options
                      type={'text'}
                      placeholder="CPF*"
                      // react hook form register
                      {...register('cpf', { required: true })}
                      className={errors.cpf ? styles.error : ''}
                    />
                  </label>
                  {errors.cpf && <p className={styles.errorMessage}>{errors.cpf.message}</p>}
                </div>
                <div>
                  <label>
                    Gênero*
                    <select {...register('gender')} >
                      <option selected value="1">Masculino</option>
                      <option value="2">Feminino</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div>
                  <label>
                    Email*
                    <input
                      type="text"
                      {...register('email')}
                      placeholder="Email*"
                      className={errors.email ? styles.error : ''}
                    />
                  </label>
                  {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
                </div>
                <div>
                  <label>
                    Data de Nascimento*
                    <input
                      type="date"
                      {...register('dataNascimentoValidar')}
                      placeholder="Email*"
                      className={errors.email ? styles.error : ''}
                    />
                  </label>
                  {errors.dataNascimentoValidar && <p className={styles.errorMessage}>{errors.dataNascimentoValidar.message}</p>}
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div>
                  <label>
                    Senha*
                    <input
                      type="password"
                      {...register('password')}
                      placeholder="Senha"
                      className={errors.password ? styles.error : ''}
                    />
                  </label>
                  {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
                </div>
                <div>
                  <label>
                    Confirmar senha*
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      placeholder="Confirmar senha"
                      className={errors.confirmPassword ? styles.error : ''}
                    />
                  </label>
                  {errors.confirmPassword && (
                    <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              <button type="submit">Cadastrar</button>
            </div>
          </form>
      }
    </>
  );
};
