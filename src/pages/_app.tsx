import '../styles/globals.css';
import { AppProps } from 'next/app';
import Header from '../components/Header';
import Script from 'next/script';


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
          <Header />
          <Component {...pageProps} />
          <Script id="snarkjs" src="/snarkjs.min.js" />
        </>
      );
    }

export default MyApp;

