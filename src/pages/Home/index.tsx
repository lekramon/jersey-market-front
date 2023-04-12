import styles from './styles.module.scss';

import { IntroSection } from '../../sections/Intro';
import { ProductsList } from '../../sections/ProductsList';

export const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <IntroSection />
        <ProductsList />
      </div>
    </div>
  );
};
