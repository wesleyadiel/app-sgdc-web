import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { GetUserProps } from '../components/Auth';
import { ConvertDateForInput, ConvertStringDateToDateForInput } from '../components/ServicesAux';

import $ from "jquery"
import styles from '../../styles/AtividadeCadastro.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AtividadeCadastro() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/atividade`
    const URL_TURMAS = `${process.env.NEXT_PUBLIC_URL_BASE_API}/turmas`
    const URL_USUARIOS = `${process.env.NEXT_PUBLIC_URL_BASE_API}/usuarios`
    const [returnPage, setReturnPage] = useState(false);
    const [id, setId] = useState(0);
    const [idTurma, setIdTurma] = useState(0);
    const [idUsuario, setIdUsuario] = useState(0);
    const [descricao, setDescricao] = useState("");
    const [complemento, setComplemento] = useState("");
    const [observacao, setObservacao] = useState("");
    const [status, setStatus] = useState("");
    const [dataInicio, setDataInicio] = useState(ConvertDateForInput(new Date()));
    const [dataFim, setDataFim] = useState(ConvertDateForInput(new Date()));
    const router = useRouter();
    const [user, setUser] = useState({});
    const [turmas, setTurmas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosRelacionados, setUsuariosRelacionados] = useState([]);
    const [idResponsavelSelecionado, setIdResponsavelSelecionado] = useState(0);

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                setIdUsuario(e.idusuario)
                buscarTurmas();
                buscarUsuarios();

                if (!router.query.id)
                    return

                await editarAtividade(router.query.id);

                if (!returnPage && router.query.returnPage)
                    setReturnPage(true);
            }
        });
    }, []);

    const editarAtividade = async (id) => {
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
        setIdTurma(data.idturma);
        setIdUsuario(data.idusuario);
        setDescricao(data.descricao);
        setComplemento(data.complemento);
        setObservacao(data.observacao);
        setDataInicio(ConvertStringDateToDateForInput(data.datainicio));
        setDataFim(ConvertStringDateToDateForInput(data.datafim));
        setStatus(data.status);

        if (data.usuariosRelacionados)
            setUsuariosRelacionados(data.usuariosRelacionados);

        return data;
    }

    const cancelar = async () => {
        if (returnPage)
            router.back();
        else
            router.push("/Atividade/Atividades");
    }

    const salvar = async (e) => {
        $("#btnSubmit").click();
    }

    const salvarAtividade = async (e) => {
        e.preventDefault();

        if (!descricao)
            return toast.warn("Descrição não informada.");

        if (!idTurma)
            return toast.warn("Turma não informada.");

        if (!idUsuario)
            return toast.warn("Usuário do cadastro não informada.");

        if (!complemento)
            return toast.warn("Complemento não informado.");

        if (!observacao)
            return toast.warn("Observação não informada.");

        if (!dataInicio)
            return toast.warn("Data de início não informada.");

        if (!dataFim)
            return toast.warn("Data de fim não informada.");

        if (!status)
            return toast.warn("Status não informado.");

        if (usuariosRelacionados.length <= 0)
            return toast.warn("Nenhum responsável informado.");

        try {
            const { 'sgdc-token': token } = parseCookies();
            const res = await fetch(`${URL}`, {
                method: "POST",
                headers: new Headers({
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ id, idTurma, idUsuario, descricao, complemento, observacao, dataInicio, dataFim, status, usuariosRelacionados })
            })

            const data = await res.json();
            if (res.status != 200) {
                return toast.warn(data);
            }

            toast.success(data);
            if (returnPage)
                router.back();
            else
                router.push("/Atividade/Atividades");
        } catch (error) {
            return toast.error(error);
        }
    }

    const buscarTurmas = async () => {
        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(URL_TURMAS, {
            method: "GET",
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })

        const data = await res.json();
        if (res.status != 200) {
            toast.warn(data);
            setTurmas([]);
        }

        setTurmas(data);
    }

    const buscarUsuarios = async () => {
        const { 'sgdc-token': token } = parseCookies();
        const res = await fetch(URL_USUARIOS, {
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

    const removerResponsavel = (id) => {
        setUsuariosRelacionados(usuariosRelacionados.filter((a) => a.idusuario != id));
    }

    const adicionarResponsavel = () => {
        if (!idResponsavelSelecionado)
            return toast.warn("Responsável não selecionado.");

        if (usuariosRelacionados.filter((u) => u.idusuario == idResponsavelSelecionado).length > 0)
            return toast.warn("Responsável já incluído.");

        setUsuariosRelacionados(current => [...current, usuarios.filter((u) => u.idusuario == idResponsavelSelecionado)[0]]);

        //Scroll to end of table for new resp inputed
        var $target = $('#divTableResp');
        $target.animate({ scrollTop: $target.height() }, 1000);
    }

    const renderOptionsTurmas = () => {
        if (turmas.length <= 0)
            return;

        return turmas.map((t) => {
            return <option value={t.idturma.toString()}>{t.nome}</option>
        });
    }

    const renderOptionsUsuarios = () => {
        if (usuarios.length <= 0)
            return;

        return usuarios.map((u) => {
            return <option value={u.idusuario.toString()}>{u.nome}</option>
        });
    }

    const renderRowsResponsaveis = () => {
        if (usuariosRelacionados.length == 0) {
            return <tr><td className="aviso_nenhum_dado" colSpan="2"><b>Nenhum responsável relacionado.</b></td></tr>
        }

        return usuariosRelacionados.map((a) => {
            return (<tr>
                <td className="text">
                    {a.nome}
                </td>
                <td className="text-center">
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => removerResponsavel(a.idusuario)} />
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
                                <h1>Cadastro de Atividade</h1>
                            </div>
                            <form id="formCadastro" onSubmit={salvarAtividade}>
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <label htmlFor="descricaoInput">Descrição</label>
                                            <input type="text" className="form-control" id="descricaoInput" aria-describedby="descricaoHelp" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <label htmlFor="selectStatus">Status</label>
                                        <select className="form-control" id="selectStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option value="A">Aberta</option>
                                            <option value="C">Cancelada</option>
                                            <option value="F">Finalizada</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="selectTurma">Turma</label>
                                        <select className="form-control" id="selectCoordenador" value={idTurma} onChange={(e) => setIdTurma(e.target.value)}>
                                            <option value="0">Selecione...</option>
                                            {renderOptionsTurmas()}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputDataInicio">Data de início</label>
                                            <input type="date" className="form-control" id="inputDataInicio" placeholder="Data de início" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputDataFim">Data de fim</label>
                                            <input type="date" className="form-control" id="inputDataFim" placeholder="Data de fim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="inputComplemento">Complemento</label>
                                            <input type="text" className="form-control" id="inputComplemento" placeholder="Complemento para descrição da atividade" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="textAreaObservacoes">Observação</label>
                                            <textarea className="form-control" id="textAreaObservacoes" placeholder="Observações para a atividade..." value={observacao} onChange={(e) => setObservacao(e.target.value)}></textarea>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <div className="card">
                                                <div className={styles.div_table_resp} id="divTableResp">
                                                    <div className="table-responsive">
                                                        <table className="table table-active table-striped" id="tableResponsaveis">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Responsáveis</th>
                                                                    <th scope="col" style={{ width: '10px' }}></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {renderRowsResponsaveis()}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.slc_resp}>
                                            <div className="row">
                                                <div className="col-md-9">
                                                    <select className="form-control" id="selectResponsavel" value={idResponsavelSelecionado} onChange={(e) => setIdResponsavelSelecionado(e.target.value)}>
                                                        <option value="0">Selecione...</option>
                                                        {renderOptionsUsuarios()}
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className={styles.slc_resp_button}>
                                                        <button type="button" className="btn btn-secondary" onClick={adicionarResponsavel}>Incluir</button>
                                                    </div>
                                                </div>
                                            </div>
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