import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { setCookie, parseCookies } from 'nookies';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GetUserProps } from './components/Auth';

import $ from "jquery"
import Link from 'next/link';
import styles from '../styles/UsuariosCadastro.module.css'
import Sidebar from "./components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

export default function Usuarios() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/usuario`
    const [id, setId] = useState(0);
    const [nome, setNome] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState("");
    const [editando, setEditando] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                if(!router.query.id)
                    return

                await editarUsuario(router.query.id);
            }
        });
    }, []);

    const editarUsuario = async (id) => {
        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(`${URL}/${id}`, {
            method: "GET",
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })

        const data = await res.json();
        if (res.status != 200) {
            toast.warn(data);
            return;
        }

        setId(id);
        setNome(data.nome);
        setUsuario(data.usuario);
        setTipo(data.tipo);

        return data;
    }

    const cancelar = async () => {
        router.push("/usuarios");
    }

    const salvar = async (e) => {
        $("#btnSubmit").click();

    }

    const salvarUsuario = async (e) => {
        e.preventDefault();

        if (!nome)
            return toast.warn("Nome não informado.");


        if (!usuario)
            return toast.warn("Usuário não informado.");


        if (!tipo)
            return toast.warn("Tipo de usuário não informado.");


        try {
            const { 'sgdc-token': token } = parseCookies();
            const res = await fetch(`${URL}`, {
                method: "POST",
                headers: new Headers({
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ id, nome, usuario, tipo })
            })

            const data = await res.json();
            if (res.status != 200) {
                return toast.warn(data);
            }

            toast.success(data);
            router.push("/usuarios");
        } catch (error) {
            return toast.error(error);
        }
    }

    return (
        <>
            <div className="flex">
                <Sidebar user={user} />
                <div className="container fill">
                    <div className="page">
                        <div className={styles.content_page}>
                            <div className={styles.title_page}>
                                <h1>Cadastro de Usuários</h1>
                            </div>
                            <form id="formCadastro" onSubmit={salvarUsuario}>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="form-group">
                                            <label htmlFor="nomeInput">Nome</label>
                                            <input type="text" className="form-control" id="nomeInput" aria-describedby="nomeHelp" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                            <small id="nomeHelp" className="form-text text-muted">Novos usuários serão cadastrados com a senha UTFPR123.</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="usuarioInput">Usuário</label>
                                            <input type="text" className="form-control" id="usuarioInput" placeholder="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="selectTipo">Tipo de usuário</label>
                                        <select className="form-control" id="selectTipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option value="P">Padrão</option>
                                            <option value="A">Administrador</option>
                                        </select>
                                    </div>
                                </div>
                                <button id="btnSubmit" type="submit" className="btn btn-danger" hidden></button>
                            </form>
                        </div>

                        <div className={styles.footer_content}>
                            <button type="button" className="btn btn-danger" onClick={cancelar}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={salvar}>Salvar</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}