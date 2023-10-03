import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.json'
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import '../styles/globals.css'

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; 

import Layout from './components/Layout'
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('globalLoader');
      if (loader)
        loader.style.display = 'none';
    }
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
