import Link from 'next/link'
import Image from 'next/image'

import styles from '../../styles/Navbar.module.css'

export default function Navbar()
{
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Image src="/images/logo-utfpr.png" width="75" height="30" alt="LogoUTFPR"/>
                <h1>Gerênciamento de documentos e cronogramas</h1>
            </div>
            <ul className={styles.link_items}>
                <li>
                    <Link href="/Login" legacyBehavior>
                        <a>Login</a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}