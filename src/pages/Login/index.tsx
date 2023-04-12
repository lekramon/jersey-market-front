import { NavLink } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import styles from './styles.module.scss';
import logoIMG from '../../assets/logoXgames.png';
import axios from 'axios';

interface LoginData {
    email: string;
    password: string;
}

export const Login = () => {

  const schema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
  });

  const defaultValues = {
    email: "",
    password:  ""
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  });

  const onSubmit = async (data: LoginData) => {
    try {
      console.log(data, "Tentando fazer Login");
      await axios.post('https://jersey-market-api-production.up.railway.app/user/login', data)
      .then(function (response) {
        console.log(response.data.userGroup, "Resposta do login");
      });
      toast.success('Login realizado com sucesso!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log('Tentando navegar');
      <nav>
        <NavLink to="/admin/user/list" />
      </nav>
    } catch (e) {
      toast.error('Falha ao realizar o Login!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
  <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
    <ToastContainer />
    <div className={styles.formContent}>
      <h1>Login</h1>
      <div>
      <img
          src={logoIMG}
          alt="Logo da XSports"
          className={styles.headerLogo}
        />
      </div>
      <div className={styles.inputContainer}>
        <div>
          <label>
            Email
            <input type="text"
            {...register('email')}
            placeholder='Digite seu endereço de email'
            className={errors.email ? styles.error : ''}
            />
          </label>
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
        </div>
      </div>
      <div className={styles.inputContainer}>
        <div>
          <label>
            Senha
            <input type="password"
            {...register('password')}
            placeholder='Digite sua senha'
            className={errors.password ? styles.error : ''}
              />
            </label>
            {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </div>
      </div>
      <button type="submit">Logar</button>
    </div>
  </form>
  );
};
