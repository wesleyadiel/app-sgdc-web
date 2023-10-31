import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from '../components/Auth';
import Link from 'next/link'

import styles from '../../styles/Cursos.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Cursos() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/cursos`
    const URL_ACOES = `${process.env.NEXT_PUBLIC_URL_BASE_API}/curso`
    const [cursos, setCursos] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setCursos(await buscarCursos());
            }
        });
    }, []);

    const buscarCursos = async () => {
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

    const editarCurso = async (idCurso) => {
        if (!idCurso)
            return toast.warn("IdCurso inválido.");

        router.push(`/Curso/CursoCadastro?id=${idCurso}`);
    }

    const cadastrarNovoCurso = async () => {
        router.push(`/Curso/CursoCadastro`);
    }

    const excluirCurso = async (curso, idCurso) => {
        if (!idCurso)
            return toast.warn("IdCurso inválido.");

        confirmAlert({
            title: 'Excluir curso',
            message: `Tem certeza que deseja excluir o curso ${curso}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        const { 'sgdc-token': token } = parseCookies();
                        const res = await fetch(`${URL_ACOES}/${idCurso}`, {
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
                        setCursos(cursos.filter((c) => c.idcurso != idCurso));
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
        if (cursos.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="4"><b>Nenhum curso encontrado.</b></td></tr>
        }

        return cursos.map((c) => {
            return (<tr>
                <td className="text">
                    {c.nome}
                </td>
                <td>
                    {c.periodo}
                </td>
                <td>
                    {c.cargahoraria}
                </td>
                <td>
                    <Link href={c.projetopedagogico} target="_blank">
                        Link
                    </Link>
                </td>
                <td>
                    <Link href={c.aprovacaocogep} target="_blank">
                        Link
                    </Link>
                </td>
                <td>
                    <Link href={c.atacolegiado} target="_blank">
                        Link
                    </Link>
                </td>
                <td>
                    {c.nomecoordenador}
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => editarCurso(c.idcurso)} />
                    &nbsp;&nbsp; &#124; &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => excluirCurso(c.nome, c.idcurso)} />
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
                                <h1>Cursos</h1>
                            </div>
                            <div className="card">
                                <div className="table-responsive" style={{ overflowx: 'auto' }}>
                                    <table className="table table-active table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Periodo</th>
                                                <th scope="col">Carga horária</th>
                                                <th scope="col">Projeto pedagógico</th>
                                                <th scope="col">Aprovação COGEP</th>
                                                <th scope="col">Ata colegiado</th>
                                                <th scope="col">Coordenador</th>
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
                                <button type="button" className="btn btn-primary" onClick={cadastrarNovoCurso}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}