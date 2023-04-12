import styles from './styles.module.scss';
import coffeIcon from '../../assets/coffe-icon.svg';
import packageIcon from '../../assets/package-icon.svg';
import timerIcon from '../../assets/timer-icon.svg';
import cartIcon from '../../assets/cart-icon-2.svg';
import coffe from '../../assets/coffe.png';

export const IntroSection = () => {
  return (
    <div className={styles.intro}>
      <div>
        <h1>Encontre o café perfeito para qualquer hora do dia</h1>
        <div className={styles.benefits}>
          <div>
            <img src={cartIcon} alt="" />
            <p>Compra simples e segura</p>
          </div>
          <div>
            <img src={packageIcon} alt="" />
            <p>Embalagem mantém o café intacto</p>
          </div>
          <div>
            <img src={timerIcon} alt="" />
            <p>Entrega rápida e rastreada</p>
          </div>
          <div>
            <img src={coffeIcon} alt="" />
            <p>O café chega fresquinho até você</p>
          </div>
        </div>
      </div>

      <img src={coffe} alt="" />
    </div>
  );
};
