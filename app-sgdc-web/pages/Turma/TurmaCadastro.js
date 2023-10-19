import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { GetUserProps } from '../components/Auth';
import { ConvertDateForInput, ConvertStringDateToDateForInput } from '../components/ServicesAux';

import $ from "jquery"
import styles from '../../styles/UsuariosCadastro.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

export default function Usuarios() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/turma`
    const URL_USUARIO = `${process.env.NEXT_PUBLIC_URL_BASE_API}/usuarios`
    const URL_CURSO = `${process.env.NEXT_PUBLIC_URL_BASE_API}/cursos`
    const [id, setId] = useState(0);
    const [idCurso, setIdCurso] = useState(0);
    const [nome, setNome] = useState("");
    const [dataInicio, setDataInicio] = useState(ConvertDateForInput(new Date()));
    const [dataFim, setDataFim] = useState(ConvertDateForInput(new Date()));
    const [planilha, setPlanilha] = useState("");
    const [solicitacaoAbertura, setSolicitacaoAbertura] = useState("");
    const [idUsuarioCoordenador, setIdUsuarioCoordenador] = useState(0);
    const [idUsuarioSecretario, setIdUsuarioSecretario] = useState(0);
    const [idUsuarioGestorContrato, setIdUsuarioGestorContrato] = useState(0);
    const [idUsuarioFiscalContrato, setIdUsuarioFiscalContrato] = useState(0);
    const router = useRouter();
    const [user, setUser] = useState({});
    const [cursos, setCursos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                buscarUsuarios();
                buscarCursos();

                if (!router.query.id)
                    return

                await editarTurma(router.query.id);
            }
        });
    }, []);

    const editarTurma = async (id) => {
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
        setIdCurso(data.idcurso);
        setNome(data.nome);
        setDataInicio(ConvertStringDateToDateForInput(data.datainicio));
        setDataFim(ConvertStringDateToDateForInput(data.datafim));
        setPlanilha(data.planilha);
        setSolicitacaoAbertura(data.solicitacaoabertura);
        setIdUsuarioCoordenador(data.idusuariocoordenador);
        setIdUsuarioSecretario(data.idusuariosecretario);
        setIdUsuarioGestorContrato(data.idusuariogestorcontrato);
        setIdUsuarioFiscalContrato(data.idusuariofiscalcontrato);

        return data;
    }

    const cancelar = async () => {
        router.push("/Turma/Turmas");
    }

    const salvar = async (e) => {
        $("#btnSubmit").click();

    }

    const salvarTurma = async (e) => {
        e.preventDefault();

        if (!idCurso)
            return toast.warn("Curso não informado.");

        if (!nome)
            return toast.warn("Nome não informado.");

        if (!dataInicio)
            return toast.warn("Data inicio não informada.");

        if (!dataFim)
            return toast.warn("Data fim não informada.");

        if (!planilha)
            return toast.warn("Planilha não informada.");

        if (!solicitacaoAbertura)
            return toast.warn("Solicitação de abertura não informada.");

        if (!idUsuarioCoordenador)
            return toast.warn("Coordenador não informado.");

        if (!idUsuarioSecretario)
            return toast.warn("Secretario não informado.");

        if (!idUsuarioGestorContrato)
            return toast.warn("Gestor de contrato não informado.");

        if (!idUsuarioFiscalContrato)
            return toast.warn("Fiscal de contrato não informado.");


        try {
            const { 'sgdc-token': token } = parseCookies();
            const res = await fetch(`${URL}`, {
                method: "POST",
                headers: new Headers({
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ id, idCurso, nome, dataInicio, dataFim, planilha, solicitacaoAbertura, idUsuarioCoordenador, idUsuarioSecretario, idUsuarioGestorContrato, idUsuarioFiscalContrato })
            })

            const data = await res.json();
            if (res.status != 200) {
                return toast.warn(data);
            }

            toast.success(data);
            router.push("/Turma/Turmas");
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

    const buscarCursos = async () => {
        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(URL_CURSO, {
            method: "GET",
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })

        const data = await res.json();
        if (res.status != 200) {
            toast.warn(data);
            setCursos([]);
        }

        setCursos(data);
    }

    const renderOptionsCursos = () => {
        if (cursos.length <= 0)
            return;

        return cursos.map((c) => {
            return <option value={c.idcurso.toString()}>{c.nome}</option>
        });
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
                                <h1>Cadastro de Turma</h1>
                            </div>
                            <form id="formCadastro" onSubmit={salvarTurma}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="nomeInput">Nome</label>
                                            <input type="text" className="form-control" id="nomeInput" aria-describedby="nomeHelp" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="selectCurso">Curso</label>
                                        <select className="form-control" id="selectCurso" value={idCurso} onChange={(e) => setIdCurso(e.target.value)}>
                                            <option value="0">Selecione...</option>
                                            {renderOptionsCursos()}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="dtInicioInput">Data Início</label>
                                            <input type="date" className="form-control" id="dtInicioInput" placeholder="Data Início" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="dtFimInput">Data Fim</label>
                                            <input type="date" className="form-control" id="dtFimInput" placeholder="Data Fim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="planilhaInput">Planilha</label>
                                            <input type="text" className="form-control" id="planilhaInput" placeholder="Planilha" value={planilha} onChange={(e) => setPlanilha(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="solicitacaoAberturaInput">Solicitação de abertura</label>
                                            <input type="text" className="form-control" id="solicitacaoAberturaInput" placeholder="Solicitação de abertura" value={solicitacaoAbertura} onChange={(e) => setSolicitacaoAbertura(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <label htmlFor="selectCoordenador">Coordenador</label>
                                        <select className="form-control" id="selectCoordenador" value={idUsuarioCoordenador} onChange={(e) => setIdUsuarioCoordenador(e.target.value)}>
                                            <option value="0">Selecione...</option>
                                            {renderOptionsUsuarios()}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="selectSecretario">Secretário</label>
                                        <select className="form-control" id="selectSecretario" value={idUsuarioSecretario} onChange={(e) => setIdUsuarioSecretario(e.target.value)}>
                                            <option value="0">Selecione...</option>
                                            {renderOptionsUsuarios()}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="selectGestorContrato">Gestor contrato</label>
                                        <select className="form-control" id="selectGestorContrato" value={idUsuarioGestorContrato} onChange={(e) => setIdUsuarioGestorContrato(e.target.value)}>
                                            <option value="0">Selecione...</option>
                                            {renderOptionsUsuarios()}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="selectFiscalContrato">Fiscal contrato</label>
                                        <select className="form-control" id="selectFiscalContrato" value={idUsuarioFiscalContrato} onChange={(e) => setIdUsuarioFiscalContrato(e.target.value)}>
                                            <option value="0">Selecione...</option>
                                            {renderOptionsUsuarios()}
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