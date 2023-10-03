import Navbar from './Navbar'
import Footer from './Footer'
import loader from './../loader'

import Head from 'next/head'

export default function Layout({ children }) {
    return (
        <>
            <Head>
                s<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"/>
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
        </>
    )
}