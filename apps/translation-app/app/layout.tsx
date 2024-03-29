import classNames from 'classnames';
import { Noto_Sans, Noto_Sans_JP } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './global.scss';

import Popup from '../components/Popup/Popup';
import PopupContextProvider from '../context/PopupProvider';

export const metadata = {
  title: 'Lokla App',
  description: 'Translate your app with ease',
};

const notoSans = Noto_Sans({
  subsets: ['latin'],
});

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={classNames(notoSans.className, notoSansJp.className)}>
        <PopupContextProvider>
          {children}
          <Toaster position="bottom-center" />
          <Popup />
        </PopupContextProvider>
      </body>
    </html>
  );
}
