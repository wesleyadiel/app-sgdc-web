import { setCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useState, useEffect, createContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from './components/Auth';
import { toast } from 'react-toastify';
import Link from 'next/link'

import Sidebar from "./components/Sidebar"
import styles from '../styles/Home.module.css'
export default function Home() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/pendenciasHoje`
    const [pendendiasHoje, setPendenciasHoje] = useState([]);
    const [user, setUser] = useState({});
    const router = useRouter();

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setPendenciasHoje(await buscarPendenciasHoje(e.idusuario));
            }
        });
    }, []);

    const buscarPendenciasHoje = async (idUsuario) => {
        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(`${URL}/${idUsuario}`, {
            method: "GET",
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })

        const data = await res.json();
        if (res.status != 200) {
            return [];
        }

        return data;
    }

    const renderRows = () => {
        if (pendendiasHoje.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="1"><b>Nenhuma pendência para hoje.</b></td></tr>
        }

        return pendendiasHoje.map((p) => {
            return (<tr>
                <td className="text">
                    <Link href={`/Atividade/AtividadeCadastro?id=${p.idatividade}`}>
                        {p.descricao}:
                    </Link>
                    {p.complemento}
                </td>
            </tr>)
        });
    }

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
                        <div className={styles.card_full_home}>
                            <div className="card">
                                <div className="table-responsive" style={{ overflowx: 'auto' }}>
                                    <table className="table table-active table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Atividades</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderRows()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}