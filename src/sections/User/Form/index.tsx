import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactInputMask from 'react-input-mask';
import styles from './styles.module.scss';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

interface FormData {
  name: string;
  cpf: string;
  password?: string;
  confirmPassword?: string;
  userGroup: number | string;
  email: string;
}

type currentUser = {
  name: string;
  cpf: string;
  userGroup: "ADMIN" | "STOREKEEPER" | "CLIENT";
  email: string;
  id: number;
}

interface UserFormProps {
  isEdit: boolean;
  currentUser?: currentUser;
}

export const UserForm = ({isEdit, currentUser}: UserFormProps) => {

  const userMap = {
    "ADMIN": 1,
    "STOREKEEPER": 2,
    "CLIENT": 3
  }

  const passwordValidation = yup.object().shape({
    password: yup.string().required('Senha é obrigatório'),
    confirmPassword: yup
    .string()
    .required('Confirmar senha é obrigatório')
    .oneOf([yup.ref('password')], 'As senhas não coincidem.'),
  })

  const schema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('Email é obrigatório'),
    name: yup.string().required('Nome é obrigatório'),
    userGroup: yup.number().positive('Perfil é obrigatório'),
    cpf: yup.string().required('CPF é obrigatório'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas não coincidem.'),
    password: yup.string(),
  });

  if(!isEdit) schema.concat(passwordValidation)

  const defaultValues = {
    name: isEdit ? currentUser?.name : "",
    password:  "",
    confirmPassword: "",
    cpf: isEdit ? currentUser?.cpf : "",
    userGroup: isEdit && currentUser?.userGroup ? userMap[currentUser.userGroup] : 0,
    email: isEdit ? currentUser?.email : ""
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    reset(defaultValues)
  }, [currentUser])

  const onSubmit = async (data: FormData) => {
    delete data.confirmPassword;

    try {
      if(isEdit) {
        await axios.put(`https://jersey-market-api-production.up.railway.app/user/id${currentUser.id}/update`, data);
        toast.success('Usuário atualizado com sucesso !', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        await axios.post('https://jersey-market-api-production.up.railway.app/user/register', data);
        toast.success('Usuário cadastrado com sucesso !', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
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
        <h1>{isEdit ? "Atualizar funcionário" : "Cadastrar novo funcionário"}</h1>
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
                disabled={isEdit}
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
              <select {...register('userGroup')} className={errors.userGroup ? styles.error : ''} defaultValue={0}>
                <option value="0" disabled >
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
             {isEdit ? "Nova senha" : "Senha *"}
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
              {isEdit ? "Confirmar nova senha" : "Confirmar senha *"}
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

        <button type="submit">{!isEdit ? "Cadastrar" : "Atualizar"}</button>
      </div>
    </form>
  );
};
