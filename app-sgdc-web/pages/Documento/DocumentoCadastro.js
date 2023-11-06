import { useState, useEffect, createContext } from "react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { GetUserProps } from '../components/Auth';
import { ConvertDateForInput, ConvertStringDateToDateForInput } from '../components/ServicesAux';

import $ from "jquery"
import styles from '../../styles/DocumentoCadastro.module.css'
import Sidebar from "../components/Sidebar"
import 'react-toastify/dist/ReactToastify.css';

export default function DocumentoCadastro() {
    const URL = `${process.env.NEXT_PUBLIC_URL_BASE_API}/documento`
    const URL_TURMAS = `${process.env.NEXT_PUBLIC_URL_BASE_API}/turmas`
    const [id, setId] = useState(0);
    const [idTurma, setIdTurma] = useState(0);
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState("");
    const [dataDocumento, setDataDocumento] = useState(ConvertDateForInput(new Date()));
    const [link, setLink] = useState("");
    const router = useRouter();
    const [user, setUser] = useState({});
    const [turmas, setTurmas] = useState([]);

    useEffect(() => {
        GetUserProps(router).then(async (e) => {
            if (e) {
                setUser(e);
                buscarTurmas();

                if (!router.query.id)
                    return

                await editarDocumento(router.query.id);
            }
        });
    }, []);

    const editarDocumento = async (id) => {
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
        setDescricao(data.descricao);
        setTipo(data.tipo);
        setDataDocumento(ConvertStringDateToDateForInput(data.data));
        setLink(data.link);

        return data;
    }

    const cancelar = async () => {
        router.push("/Documento/Documentos");
    }

    const salvar = async (e) => {
        $("#btnSubmit").click();
    }

    const salvarDocumento = async (e) => {
        e.preventDefault();

        if (!descricao)
            return toast.warn("Descrição não informada.");

        if (!idTurma)
            return toast.warn("Turma não informada.");

        if (!tipo)
            return toast.warn("Tipo não informado.");

        if (!dataDocumento)
            return toast.warn("Data não informada.");

        if (!link)
            return toast.warn("Link não informado.");

        try {
            const { 'sgdc-token': token } = parseCookies();
            const res = await fetch(`${URL}`, {
                method: "POST",
                headers: new Headers({
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ id, idTurma, descricao, tipo, data:dataDocumento, link })
            })

            const data = await res.json();
            if (res.status != 200) {
                return toast.warn(data);
            }

            toast.success(data);
            router.push("/Documento/Documentos");
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

    const renderOptionsTurmas = () => {
        if (turmas.length <= 0)
            return;

        return turmas.map((t) => {
            return <option value={t.idturma.toString()}>{t.nome}</option>
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
                                <h1>Cadastro de Documento</h1>
                            </div>
                            <form id="formCadastro" onSubmit={salvarDocumento}>
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <label htmlFor="descricaoInput">Descrição</label>
                                            <input type="text" className="form-control" id="descricaoInput" aria-describedby="descricaoHelp" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="inputDataDocumento">Data do Documento</label>
                                            <input type="date" className="form-control" id="inputDataDocumento" placeholder="Data do documento" value={dataDocumento} onChange={(e) => setDataDocumento(e.target.value)} />
                                        </div>
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
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputLink">Link</label>
                                            <input type="text" className="form-control" id="inputLink" placeholder="Link do documento" value={link} onChange={(e) => setLink(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <label htmlFor="selectTipo">Tipo</label>
                                        <select className="form-control" id="selectTipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option value="T">Texto</option>
                                            <option value="I">Imagem</option>
                                            <option value="F">Formulário</option>
                                            <option value="E">Edital</option>
                                            <option value="O">Outros</option>
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