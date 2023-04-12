import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactInputMask from 'react-input-mask';
import styles from './styles.module.scss';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  nameProduct: string;
  id: number;
  quantity: number;
  value:string;
  status: string
}

export const RegisterProduct = () => {
  const schema = yup.object().shape({
    id: yup.string().required('Id é obrigatório'),
    nameProduct: yup.string().required('Nome do Produto é obrigatório'),
    // quantity: yup.number().email('E-mail inválido').required('Email é obrigatório'),
    value: yup.string().required('Preço é obrigatório'),
    quantity: yup.number().required('Quantidade é obrigatório'),
    status: yup.string().required('Status é obrigatório'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // delete data.confirmPassword;

    try {
      await axios.post('https://jersey-market-api-production.up.railway.app/user/register', data);
      toast.success('Usuário cadastrado com sucesso !', {
        position: toast.POSITION.TOP_RIGHT,
      });
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
        <h1>Cadastrar novo Produto</h1>
        <div className={styles.inputContainer}>
          <div>
            <label>
              Nome*
              <input
                type="text"
                {...register('nameProduct')}
                placeholder="Nome do Produto"
                className={errors.nameProduct ? styles.error : ''}
              />
            </label>
            {errors.nameProduct && <p className={styles.errorMessage}>{errors.nameProduct.message}</p>}
          </div>
          <div>
            <label>
              Quantidade*
              <input
                type="number"
                {...register('quantity')}
                placeholder="Quantidade*"
                className={errors.quantity ? styles.error : ''}
              />
            </label>
            {errors.quantity && <p className={styles.errorMessage}>{errors.quantity.message}</p>}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <div>
            <label>
              Preço*
              <ReactInputMask
                // mask options
                mask={'999.999.99'}
                alwaysShowMask={false}
                maskPlaceholder=""
                // input options
                type={'string'}
                placeholder="Preço*"
                // react hook form register
                {...register('value', { required: true })}
                className={errors.value ? styles.error : ''}
              />
            </label>
            {errors.value && <p className={styles.errorMessage}>{errors.value.message}</p>}
          </div>
          <div>
            <label>
              Status*
              <select {...register('status')} className={errors.status ? styles.error : ''}>
                <option value="0" disabled selected>
                  Selecionar status
                </option>
                <option value="1">Ativo</option>
                <option value="2">Inativo</option>
              </select>
            </label>
            {errors.status && <p className={styles.errorMessage}>{errors.status.message}</p>}
          </div>
        </div>

        <button type="submit">Cadastrar</button>
      </div>
    </form>
  );
};
