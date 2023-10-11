import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useState, useEffect, createContext } from "react";
import { destroyCookie } from 'nookies';

import { GetUserProps } from '../components/Auth';
import styles from '../../styles/Navbar.module.css'

export default function Navbar() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        GetUserProps(router).then((e) => {
            if (e) {
                setUser(e);
            }
        });
    }, []);

    const logout = () => {
        destroyCookie('sgdc', 'sgdc-token');
    }

    let actionAccess = <Link href="/" legacyBehavior><a onClick={logout}>Logout</a></Link>;
    if (!user)
        actionAccess = <Link href="/" legacyBehavior><a>Login</a></Link>
        


    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Image src="/images/logo-utfpr.png" width="75" height="30" alt="LogoUTFPR" />
                <h1>Gerênciamento de documentos e cronogramas</h1>
            </div>
            <ul className={styles.link_items}>
                <li>
                    {actionAccess}
                </li>
            </ul>
        </nav>
    )
}