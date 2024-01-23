import React from 'react';
import styles from './layout.module.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardWrapper}>{children}</div>
    </div>
  );
};

export default Layout;
