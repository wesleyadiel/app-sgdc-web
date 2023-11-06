import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from '../components/Auth';
import { getTipoDocumento } from '../components/ServicesAux';
import Link from 'next/link';

import styles from '../../styles/Documentos.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Documentos() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/documentos`
    const URL_ACOES = `${process.env.NEXT_PUBLIC_URL_BASE_API}/documento`
    const [documentos, setDocumentos] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setDocumentos(await buscarDocumentos());
            }
        });
    }, []);

    const buscarDocumentos = async () => {
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

    const editarDocumento = async (idDocumento) => {
        if (!idDocumento)
            return toast.warn("IdDocumento inválido.");

        router.push(`/Documento/DocumentoCadastro?id=${idDocumento}`);
    }

    const cadastrarNovoDocumento = async () => {
        router.push(`/Documento/DocumentoCadastro`);
    }

    const excluirDocumento = async (documento, turma, idDocumento) => {
        if (!idDocumento)
            return toast.warn("IdDocumento inválido.");

        confirmAlert({
            title: 'Excluir documento',
            message: `Tem certeza que deseja excluir o documento ${documento} - ${turma}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        const { 'sgdc-token': token } = parseCookies();
                        const res = await fetch(`${URL_ACOES}/${idDocumento}`, {
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
                        setDocumentos(documentos.filter((d) => d.iddocumento != idDocumento));

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
        if (documentos.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="6"><b>Nenhum documento encontrado.</b></td></tr>
        }

        return documentos.map((d) => {
            return (<tr>
                <td className="text">
                    {d.descricao}
                </td>
                <td>
                    {getTipoDocumento(d.tipo)}
                </td>
                <td>
                    {d.data}
                </td>
                <td>
                    {d.turmanome}
                </td>
                <td>
                    <Link href={d.link} target="_blank">
                        Link
                    </Link>
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => editarDocumento(d.iddocumento)} />
                    &nbsp;&nbsp; &#124; &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => excluirDocumento(d.descricao, d.turmanome, d.iddocumento)} />
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
                                <h1>Documentos</h1>
                            </div>
                            <div className="card">
                                <div className="table-responsive" style={{ overflowx: 'auto' }}>
                                    <table className="table table-active table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Descrição</th>
                                                <th scope="col">Tipo</th>
                                                <th scope="col">Data</th>
                                                <th scope="col">Turma</th>
                                                <th scope="col">Link</th>
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
                                <button type="button" className="btn btn-primary" onClick={cadastrarNovoDocumento}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}