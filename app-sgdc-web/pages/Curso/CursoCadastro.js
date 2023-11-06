import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { GetUserProps } from '../components/Auth';

import $ from "jquery"
import styles from '../../styles/CursoCadastro.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

export default function CursoCadastro() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/curso`
    const URL_USUARIO = `${process.env.NEXT_PUBLIC_URL_BASE_API}/usuarios`
    const [id, setId] = useState(0);
    const [nome, setNome] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [cargaHoraria, setCargaHoraria] = useState("");
    const [projetoPedagogico, setProjetoPedagogicoo] = useState("");
    const [aprovacaoCogep, setAprovacaoCogep] = useState("");
    const [ataColegiado, setAtaColegiado] = useState("");
    const [idUsuarioCoordenador, setIdUsuarioCoordenador] = useState(0);
    const router = useRouter();
    const [user, setUser] = useState({});
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                buscarUsuarios();

                if (!router.query.id)
                    return

                await editarCurso(router.query.id);
            }
        });
    }, []);

    const editarCurso = async (id) => {
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
        setPeriodo(data.periodo);
        setCargaHoraria(data.cargahoraria);
        setProjetoPedagogicoo(data.projetopedagogico);
        setAprovacaoCogep(data.aprovacaocogep);
        setAtaColegiado(data.atacolegiado);
        setIdUsuarioCoordenador(data.idusuariocoordenador);

        return data;
    }

    const cancelar = async () => {
        router.push("/Curso/Cursos");
    }

    const salvar = async (e) => {
        $("#btnSubmit").click();

    }

    const salvarCurso = async (e) => {
        e.preventDefault();

        if (!nome)
            return toast.warn("Nome não informado.");

        if (!periodo)
            return toast.warn("Periodo não informado.");

        if (!cargaHoraria)
            return toast.warn("Carga horária não informada.");

        if (!projetoPedagogico)
            return toast.warn("Projeto pedagogico não informado.");

        if (!aprovacaoCogep)
            return toast.warn("Aprovação COGEP não informada.");

        if (!ataColegiado)
            return toast.warn("Ata colegiado não informada.");

        if (!idUsuarioCoordenador)
            return toast.warn("Coordenador não informado.");


        try {
            const { 'sgdc-token': token } = parseCookies();
            const res = await fetch(`${URL}`, {
                method: "POST",
                headers: new Headers({
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ id, nome, periodo, cargaHoraria, projetoPedagogico, aprovacaoCogep, ataColegiado, idUsuarioCoordenador })
            })

            const data = await res.json();
            if (res.status != 200) {
                return toast.warn(data);
            }

            toast.success(data);
            router.push("/Curso/Cursos");
        } catch (error) {
            return toast.error(error);
        }
    }

    const buscarUsuarios = async () => {
        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(URL_USUARIO, {
            method: "GET",
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })

        const data = await res.json();
        if (res.status != 200) {
            toast.warn(data);
            setUsuarios([]);
        }

        setUsuarios(data);
    }

    const renderOptionsUsuarios = () => {
        if (usuarios.length <= 0)
            return;

        return usuarios.map((c) => {
            return <option value={c.idusuario.toString()}>{c.nome}</option>
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
                                <h1>Cadastro de Curso</h1>
                            </div>
                            <form id="formCadastro" onSubmit={salvarCurso}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="nomeInput">Nome</label>
                                            <input type="text" className="form-control" id="nomeInput" aria-describedby="nomeHelp" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputPeriodo">Período</label>
                                            <input type="text" className="form-control" id="inputPeriodo" placeholder="Período do curso" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputCargaHoraria">Carga horária</label>
                                            <input type="text" className="form-control" id="inputCargaHoraria" placeholder="Carga horária" value={cargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="selectCoordenador">Coordenador</label>
                                        <select className="form-control" id="selectCoordenador" value={idUsuarioCoordenador} onChange={(e) => setIdUsuarioCoordenador(e.target.value)}>
                                            <option value="0">Selecione...</option>
                                            {renderOptionsUsuarios()}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputProjetoPedagogico">Projeto pedagógicoo</label>
                                            <input type="url" className="form-control" id="inputProjetoPedagogico" placeholder="Link do projeto pedagógico" value={projetoPedagogico} onChange={(e) => setProjetoPedagogicoo(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputAprovacaoCogep">Aprovação COGEP</label>
                                            <input type="url" className="form-control" id="inputAprovacaoCogep" placeholder="Link da aprovação COGEP" value={aprovacaoCogep} onChange={(e) => setAprovacaoCogep(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputAtaColegiado">Ata colegiado</label>
                                            <input type="url" className="form-control" id="inputAtaColegiado" placeholder="Link da ata do colegiado" value={ataColegiado} onChange={(e) => setAtaColegiado(e.target.value)} />
                                        </div>
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