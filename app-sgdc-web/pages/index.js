import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { setCookie, parseCookies } from 'nookies';
import Link from 'next/link';
import { GetUserProps } from './components/Auth';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/Index.module.css'

export default function Home() {
  const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/login`
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [isFormOpen, setIsFormOpen] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const router = useRouter();
  const [user, setUser] = useState(null);


  useEffect(() => {
    GetUserProps(router).then((e) => {
      if (e) {
        setUser(e);
        router.push("/home");
      }
    });
  }, []);

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

      const data = await res.json();

      if (res.status == 400)
        return toast.warn(data);

      if (res.status != 200)
        return toast.warn(data);

      setCookie('sgdc', 'sgdc-token', data.token, { maxAge: 1800 });
      console.log(data);
      if (data.primeiroAcesso) {
        router.push('/primeiroAcesso');
        return;
      }
      else {
        router.push('/home');
        return;
      }


    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const getUsuarioByToken = async (token) => {
    const res = await fetch(`${URL}/${token}`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });

    const data = JSON.stringify(await res.json());

    if (res.status != 200)
      console.log(data)

    setCookie(undefined, 'sgdc-token', data.token, { maxAge: 1800 });

    router.push({
      pathname: '/home'
    });
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
