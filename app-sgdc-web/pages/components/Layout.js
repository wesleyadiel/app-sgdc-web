import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify';

import Navbar from './Navbar'
import Footer from './Footer'
import loader from './../loader'

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <link rel="shorcut icon" href="/images/favicon.ico" />
                <title>UTFPR - SGDC</title>

                <style>
                    {loader}
                </style>
            </Head>
            <Navbar />
            <main className="main-container">
                    {children}
            </main>
            <Footer />

            
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />
        </>
    )
}