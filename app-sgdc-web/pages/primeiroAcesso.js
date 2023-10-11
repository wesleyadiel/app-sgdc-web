import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { setCookie, parseCookies } from 'nookies';
import Link from 'next/link';
import { GetUserProps } from './components/Auth';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/PrimeiroAcesso.module.css'

export default function PrimeiroAcesso() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/redefinirSenha`
    const [senha, setSenha] = useState("");
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then((e) => {
            if (e) {
                setUser(e);
            }
        });
    }, []);

    const redefinirSenha = async (e) => {
        e.preventDefault();
        if (!senha)
            return toast.warn("Insira uma nova senha.");

        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(URL, {
            method: 'POST',
            headers: new Headers({
                'Authorization': token,
                'Content-Type': ' application/json'
            }),
            body: JSON.stringify({ senha })
        });

        const data = await res.json();

        if (res.status != 200)
            return toast.warn(data);

        setCookie('sgdc', 'sgdc-token', data.token, { maxAge: 1800 });
        router.push('/home');
    }

    return (
        <>
            <div className={styles.fundo}>
                <div className={styles.login_container}>
                    <h1 className={styles.titleLoginContainer}>Primeiro acesso</h1>
                    <div className="container">
                        <div className={styles.content}>
                            <form onSubmit={redefinirSenha}>
                                <div className="input-group mb-3">
                                    <input type="password" className="form-control" placeholder="Nova senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                                </div>
                                <div className={styles.info_input}>
                                    <i className={styles.titleLoginContainer}>* Insira uma senha definitiva</i>
                                </div>
                                <div className="d-grid gap-2 col-12 mx-auto">
                                    <button className="btn btn-primary" type="submit">Continuar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

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