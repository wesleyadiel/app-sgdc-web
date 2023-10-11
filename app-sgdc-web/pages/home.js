import { setCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useState, useEffect, createContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from './components/Auth';

import Sidebar from "./components/Sidebar"
import styles from '../styles/Home.module.css'
export default function Home() {
    const [user, setUser] = useState({});
    const router = useRouter();

    useEffect(() => {
        GetUserProps(router).then((e) => {
            if (e) {
                setUser(e);
            }
        });
    }, []);

    return (
        <>
            <div className="page">
                <Sidebar user={user} />
                <div className={styles.container_pendencias}>
                    <div className={styles.container_title}>
                        <a>Pendências para hoje</a>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: '24px' }} />
                    </div>
                    <div className={styles.container_lista_pendencias}>
                        <ul>
                            <li>
                                Atividade X
                            </li>
                            <li>
                                Atividade Y
                            </li>
                            <li>
                                Atividade Z
                            </li>
                            <li>
                                Atividade Z
                            </li>
                            <li>
                                Atividade Z
                            </li>
                            <li>
                                Atividade Z
                            </li>
                            <li>
                                Atividade Z
                            </li>
                            <li>
                                Atividade Z
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}