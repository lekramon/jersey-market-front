import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import ReactInputMask from 'react-input-mask';
import styles from './styles.module.scss';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  name: string;
  cpf: number;
  password: string;
  confirmPassword?: string;
  userGroup: number;
  email: string;
}

export const Register = () => {
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatório'),
    name: yup.string().required('Nome é obrigatório'),
    confirmPassword: yup
      .string()
      .required('Confirmar senha é obrigatório')
      .oneOf([yup.ref('password')], 'As senhas não coincidem.'),
    userGroup: yup.number().positive('Perfil é obrigatório'),
    cpf: yup.string().required('CPF é obrigatório'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    delete data.confirmPassword;

    try {
      await axios.post('https://jersey-market-api-production.up.railway.app/user/register', data);
      toast.success('Usuário cadastrado com sucesso !', {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => { navigate('/') }, 2000);
    } catch (e) {
      toast.error('Houve um erro inesperado, tente novamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(e);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer />

      <div className={styles.formContent}>
        <h1>Cadastrar novo funcionário</h1>
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
              Perfil*
              <select {...register('userGroup')} className={errors.userGroup ? styles.error : ''}>
                <option value="0" disabled selected>
                  Selecionar perfil
                </option>
                <option value="1">Admin</option>
                <option value="2">Estoquista</option>
                <option value="3">Cliente</option>
              </select>
            </label>
            {errors.userGroup && <p className={styles.errorMessage}>{errors.userGroup.message}</p>}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <div>
            <label>
              Senha*
              <input
                type="text"
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
                type="text"
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
  );
};
