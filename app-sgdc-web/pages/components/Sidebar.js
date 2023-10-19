import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faUsers, faChalkboardUser,faGraduationCap, faFolderOpen, faBookOpen, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router';

import styles from '../../styles/Sidebar.module.css'

export default function Sidebar({user}) {
    const router = useRouter();
    
    async  function  visualizarPagina(rota) {
        router.push(rota);
    }

    return (
        <div className={styles.sidebar_container}>
            <div className={styles.header_sidebar}>
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
                    <li>
                        <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '24px' }}/>
                        <a>Cursos</a>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: '24px' }}/>
                        <a>Documentos</a>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: '24px' }} />
                        <a>Atividades</a>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: '24px' }} />
                        <a>Pendências</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}