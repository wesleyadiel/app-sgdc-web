import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from '../components/Auth';
import Link from 'next/link';

import styles from '../../styles/Turmas.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Turmas() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/turmas`
    const URL_ACOES = `${process.env.NEXT_PUBLIC_URL_BASE_API}/turma`
    const [turmas, setTurmas] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setTurmas(await buscarTurmas());
            }
        });
    }, []);

    const buscarTurmas = async () => {
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

    const editarTurma = async (idTurma) => {
        if (!idTurma)
            return toast.warn("IdTurma inválido.");

        router.push(`/Turma/TurmaCadastro?id=${idTurma}`);
    }

    const cadastrarNovaTurma = async () => {
        router.push(`/Turma/TurmaCadastro`);
    }

    const excluirTurma = async (turma, curso, idTurma) => {
        if (!idTurma)
            return toast.warn("IdTurma inválido.");

        confirmAlert({
            title: 'Excluir turma',
            message: `Tem certeza que deseja excluir a turma ${turma} - ${curso}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        const { 'sgdc-token': token } = parseCookies();
                        const res = await fetch(`${URL_ACOES}/${idTurma}`, {
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
                        setTurmas(turmas.filter((t) => t.idturma != idTurma));
                        //router.reload("/Turma/Turmas");
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
        if (turmas.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="9"><b>Nenhuma turma encontrada.</b></td></tr>
        }

        return turmas.map((u) => {
            return (<tr>
                <td className="text">
                    {u.nome}
                </td>
                <td>
                    {u.nomecurso}
                </td>
                <td>
                    {u.datainicio}
                </td>
                <td>
                    {u.datafim}
                </td>
                <td>
                    <Link href={u.planilha} target="_blank">
                        Link
                    </Link>
                </td>
                <td>
                    <Link href={u.solicitacaoabertura} target="_blank">
                        Link
                    </Link>
                </td>
                <td>
                    {u.nomecoordenador}
                </td>

                <td>
                    {u.nomesecretario}
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => editarTurma(u.idturma)} />
                    &nbsp;&nbsp; &#124; &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => excluirTurma(u.nome, u.nomecurso, u.idturma)} />
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
                                <h1>Turmas</h1>
                            </div>
                            <div className="card">
                                <div className="table-responsive" style={{ overflowx: 'auto' }}>
                                    <table className="table table-active table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Curso</th>
                                                <th scope="col">Data início</th>
                                                <th scope="col">Data fim</th>
                                                <th scope="col">Planilha</th>
                                                <th scope="col">Solic. de abertura</th>
                                                <th scope="col">Coordenador</th>
                                                <th scope="col">Secretário</th>
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
                                <button type="button" className="btn btn-primary" onClick={cadastrarNovaTurma}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}