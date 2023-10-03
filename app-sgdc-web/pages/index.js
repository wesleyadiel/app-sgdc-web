import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/Home.module.css'

export default function Home() {
  const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/login`
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [isFormOpen, setIsFormOpen] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const router = useRouter();

  const isValidForm = () => {
    if (!usuario) {
      toast.warn(`Insira seu usuário!`);
      return false;
    }

    if (!senha) {
      toast.warn(`Insira sua senha!`);
      return false;
    }

    return true;
  }

  const logar = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (!isValidForm())
        return;

      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ usuario, senha })
      });

      const data = JSON.stringify(await res.json());
      console.log(res)
      if (res.status == 400)
        return toast.warn(data);

      if (res.status != 200)
        return toast.warn(data);

      router.push({
        pathname: '/home'
      });


    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={styles.fundo}>
        <div className={styles.login_container}>
          <h1 className={styles.titleLoginContainer}>Acesso ao Sistema</h1>
          <div className="container">
            <form onSubmit={logar}>
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
              </div>
              <div className="input-group mb-3">
                <input type="password" className="form-control" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
              </div>
              <div className="d-grid gap-2 col-12 mx-auto">
                <button className="btn btn-primary" type="submit">Entrar</button>
              </div>

              <div className="d-grid gap-2 col-12 mx-auto text-center">
                <div className={styles.tagEsqueciSenha}>Esqueci minha senha</div>
              </div>
            </form>
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
