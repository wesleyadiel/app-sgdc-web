import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useState, useEffect, createContext } from "react";
import { destroyCookie } from 'nookies';

import { GetUserProps, ValidUser } from '../components/Auth';
import styles from '../../styles/Navbar.module.css'

export default function Navbar() {
    const [key, setKey] = useState(0);
    const [user, setUser] = useState(null);
    const [isLogado, setIsLogado] = useState(false);
    const router = useRouter();

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
            }
            setInterval(async () => {
                setIsLogado(await ValidUser(router));
            }, 1000);
        });

    }, []);

    const logout = () => {
        destroyCookie('sgdc', 'sgdc-token');
        setIsLogado(false);
    }

    const goHome = () => {
        router.push("/home");
    }

    return (
        <div key={key}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Image src="/images/logo-utfpr.png" width="75" height="30" alt="LogoUTFPR" onClick={() => goHome()} />
                    <h1>Gerênciamento de documentos e cronogramas</h1>
                </div>
                <ul className={styles.link_items}>
                    <li>
                        {isLogado && (<Link href="/" legacyBehavior><a onClick={logout}>Logout</a></Link>)}
                    </li>
                </ul>
            </nav>
        </div>
    )
}