import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from '../components/Auth';
import { ConvertStringDateToDate, getStatusAtividade } from '../components/ServicesAux';
import Link from 'next/link';

import styles from '../../styles/Pendencias.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Pendencias() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/pendencias`
    const [pendencias, setPendencias] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setPendencias(await buscarPendencias(e.idusuario));
            }
        });
    }, []);

    const buscarPendencias = async (idUsuario) => {
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
            toast.warn(data);
            return [];
        }

        return data;
    }

    const alterarPendencia = async (idAtividade) => {
        if (!idAtividade)
            return toast.warn("IdAtividade inválida.");

        router.push(`/Atividade/AtividadeCadastro?id=${idAtividade}&returnPage=Pendencias`);
    }

    const renderRows = () => {
        if (pendencias.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="7"><b>Nenhuma pendência encontrada.</b></td></tr>
        }

        return pendencias.map((p) => {
            var classRow = "";
            var titleRow = "";
            var dateToday = new Date();
            var dateFimAtividade = ConvertStringDateToDate(p.datafim);

            var daysBetween = Math.ceil((dateFimAtividade.getTime() - dateToday.getTime()) / (1000 * 3600 * 24));
            if (daysBetween > 15 && daysBetween <= 30) {
                classRow = "table-primary";
                titleRow = "Esta atividade deve ser finalizada em até 30 dias."
            }
            else if (daysBetween > 5 && daysBetween <= 15) {
                classRow = "table-warning"
                titleRow = "Esta atividade deve ser finalizada em até 15 dias."
            }
            else if (daysBetween <= 5) {
                classRow = "table-danger"
                titleRow = "Esta atividade deve ser finalizada em até 5 dias."
            }

            return (<tr className={classRow} title={titleRow}>
                <td className="text">
                    {p.descricao}
                </td>
                <td>
                    {p.cursonome}
                </td>
                <td>
                    {p.turmanome}
                </td>
                <td>
                    {p.datafim}
                </td>
                <td>
                    {getStatusAtividade(p.status)}
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => alterarPendencia(p.idatividade)} />
                </td>
            </tr>)
        });
    }

    return (
        <>
            <div className="flex">
                <Sidebar user={user} />
                <div className="container fill">
                    <div className="page">
                        <div className={styles.content_page}>
                            <div className={styles.title_page}>
                                <h1>Pendências</h1>
                            </div>
                            <div className="card">
                                <div className="table-responsive" style={{ overflowx: 'auto' }}>
                                    <table className="table table-active table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Descrição</th>
                                                <th scope="col">Curso</th>
                                                <th scope="col">Turma</th>
                                                <th scope="col">Data fim</th>
                                                <th scope="col">Status</th>
                                                <th scope="col" style={{ width: '100px' }}>Ações</th>
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