import Sidebar from './components/Sidebar/Sidebar';

import styles from './layout.module.scss';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
