import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faUsers, faChalkboardUser,faGraduationCap, faFolderOpen, faBookOpen, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router';

import styles from '../../styles/Sidebar.module.css'
import { useState, useEffect, createContext } from "react";

export default function Sidebar({user}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
            setIsAdmin(user.tipo == "A");
    }, []);
    
    async  function  visualizarPagina(rota) {
        router.push(rota);
    }

    const editarCadastro = () => {
        router.push(`/usuariosCadastro?id=${user.idusuario}&returnPage=home`);
    }

    return (
        <div className={styles.sidebar_container}>
            <div className={styles.header_sidebar} onClick={()=> editarCadastro()}>
                <FontAwesomeIcon icon={faCircleUser} style={{ fontSize: '35px', color: "#ffffff" }} />
                <a>{user.nome?.slice(0, 12)}</a>
            </div>
            <nav className={styles.sidebar_nav}>
                <ul>
                    <li onClick={() => visualizarPagina("/usuarios")}>
                        <FontAwesomeIcon icon={faUsers} style={{ fontSize: '24px' }} />
                        <a>Usuarios</a>
                    </li>
                    <li onClick={() => visualizarPagina("/Turma/Turmas")}>
                        <FontAwesomeIcon icon={faChalkboardUser} style={{ fontSize: '24px' }} />
                        <a>Turmas</a>
                    </li>
                    <li onClick={() => visualizarPagina("/Curso/Cursos")}>
                        <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '24px' }}/>
                        <a>Cursos</a>
                    </li>
                    <li onClick={() => visualizarPagina("/Documento/Documentos")}>
                        <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: '24px' }}/>
                        <a>Documentos</a>
                    </li>
                    <li onClick={() => visualizarPagina("/Atividade/Atividades")}>
                        <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: '24px' }} />
                        <a>Atividades</a>
                    </li>
                    <li onClick={() => visualizarPagina("/Pendencia/Pendencias")}>
                        <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: '24px' }} />
                        <a>Pendências</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}