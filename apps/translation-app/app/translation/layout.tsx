import Sidebar from './components/Sidebar/Sidebar';
import { getCurrentUser } from './services/auth.service';

import styles from './layout.module.scss';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  return (
    <div className={styles.wrapper}>
      <Sidebar user={user} />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
