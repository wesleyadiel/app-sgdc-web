import styles from '../styles/Home.module.css'
import Script from 'next/script'

export default function Home() {
  return (
    <>
    <div className={styles.fundo}>
      <div className={styles.login_container}>
        <h1 className={styles.titleLoginContainer}>Acesso ao Sistema</h1>
        <div className="container">
          <div className="input-group mb-3">
            <input id='inputUsuario' type="text" className="form-control" placeholder="Usuário"/>
          </div>
          <div className="input-group mb-3">
            <input id='inputSenha' type="password" className="form-control" placeholder="Senha"/>
          </div>
          <div className="d-grid gap-2 col-12 mx-auto">
            <button className="btn btn-primary" type="button">Entrar</button>
          </div>
          
          <div className="d-grid gap-2 col-12 mx-auto text-center">
            <div className={styles.tagEsqueciSenha}>Esqueci minha senha</div>
          </div>
        </div>
      </div>
    </div>
    
    <Script src="/assets/login.js" strategy="beforeInteractive" />
    </>
  )
}
