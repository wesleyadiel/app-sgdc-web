import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from '../components/Auth';
import { getStatusAtividade } from '../components/ServicesAux';
import Link from 'next/link';

import styles from '../../styles/Atividades.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Atividades() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/atividades`
    const URL_ACOES = `${process.env.NEXT_PUBLIC_URL_BASE_API}/atividade`
    const [atividades, setAtividades] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setAtividades(await buscarAtividades());
            }
        });
    }, []);

    const buscarAtividades = async () => {
        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(URL, {
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

    const editarAtividade = async (idAtividade) => {
        if (!idAtividade)
            return toast.warn("IdAtividade inválida.");

        router.push(`/Atividade/AtividadeCadastro?id=${idAtividade}`);
    }

    const cadastrarNovaAtividade = async () => {
        router.push(`/Atividade/AtividadeCadastro`);
    }

    const excluirAtividade = async (atividade, idAtividade) => {
        if (!idAtividade)
            return toast.warn("IdAtividade inválida.");

        confirmAlert({
            title: 'Excluir atividade',
            message: `Tem certeza que deseja excluir a Atividade ${atividade}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        const { 'sgdc-token': token } = parseCookies();
                        const res = await fetch(`${URL_ACOES}/${idAtividade}`, {
                            method: "DELETE",
                            headers: new Headers({
                                'Authorization': token,
                                'Content-Type': 'application/json'
                            })
                        })

                        const data = await res.json();
                        if (res.status != 200) {
                            return toast.warn(data);
                        }

                        toast.success(data);
                        setAtividades(atividades.filter((a) => a.idatividade != idAtividade));

                        return;
                    }
                },
                {
                    label: 'Não'
                }
            ]
        });
    }

    

    const renderRows = () => {
        if (atividades.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="6"><b>Nenhuma atividade encontrada.</b></td></tr>
        }

        return atividades.map((a) => {
            return (<tr>
                <td className="text">
                    {a.descricao}
                </td>
                <td>
                    {a.turmanome}
                </td>
                <td>
                    {a.datainicio}
                </td>
                <td>
                    {a.datafim}
                </td>
                <td>
                    {getStatusAtividade(a.status)}
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => editarAtividade(a.idatividade)} />
                    &nbsp;&nbsp; &#124; &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => excluirAtividade(a.descricao, a.idatividade)} />
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
                                <h1>Atividades</h1>
                            </div>
                            <div className="card">
                                <div className="table-responsive" style={{ overflowx: 'auto' }}>
                                    <table className="table table-active table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Descrição</th>
                                                <th scope="col">Turma</th>
                                                <th scope="col">Data início</th>
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
                            <div className={styles.footer_content}>
                                <button type="button" className="btn btn-primary" onClick={cadastrarNovaAtividade}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}