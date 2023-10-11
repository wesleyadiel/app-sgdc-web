import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { setCookie, parseCookies } from 'nookies';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from './components/Auth';

import Link from 'next/link';
import styles from '../styles/Usuarios.module.css'
import Sidebar from "./components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Usuarios() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/usuarios`
    const URL_ACOES = `${process.env.NEXT_PUBLIC_URL_BASE_API}/usuario`
    const [usuarios, setUsuarios] = useState([]);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setUsuarios(await buscarUsuarios());
            }
        });
    }, []);

    const buscarUsuarios = async () => {
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

    const editarUsuario = async (idUsuario) => {
        if (!idUsuario)
            return toast.warn("IdUsuario inválido.");

        router.push(`/Usuarios/Cadastro/${idUsuario}`);
    }

    const cadastrarNovoUsuario = async () => {
        router.push(`/usuariosCadastro`);
    }

    const excluirUsuario = async (nome, idUsuario) => {
        if (!idUsuario)
            return toast.warn("IdUsuario inválido.");

        confirmAlert({
            title: 'Excluir usuário',
            message: `Tem certeza que deseja excluir o usuário ${nome}`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        const { 'sgdc-token': token } = parseCookies();
                        const res = await fetch(`${URL_ACOES}/${idUsuario}`, {
                            method: "DELETE",
                            headers: new Headers({
                                'Authorization': token,
                                'Content-Type': 'application/json'
                            }),
                            body: JSON.stringify({ id:idUsuario })
                        })

                        const data = await res.json();
                        if (res.status != 200) {
                            return toast.warn(data);
                        }

                        toast.success(data);
                        router.reload();
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
        if (usuarios.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="4"><b>Nenhum usuário encontrado.</b></td></tr>
        }

        console.log(usuarios)
        return usuarios.map((u) => {
            return (<tr>
                <td className="text">
                    {u.nome}
                </td>
                <td>
                    {u.usuario}
                </td>
                <td>
                    {u.tipo == 'U' ? 'Usuário' : 'Administrador'}
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => editarUsuario} />
                    &nbsp;&nbsp; &#124; &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => excluirUsuario(u.nome, u.idusuario)} />
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
                                <h1>Usuários</h1>
                            </div>
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-active table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Usuário</th>
                                                <th scope="col" style={{ width: '150px' }}>Tipo</th>
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
                                <button type="button" className="btn btn-primary" onClick={cadastrarNovoUsuario}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}