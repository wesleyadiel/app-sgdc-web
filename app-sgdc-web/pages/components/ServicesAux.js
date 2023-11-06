function ConvertDateForInput(data) {
    try {
        if (data)
            return data.toISOString().split('T')[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

function ConvertStringDateToDate(data) {
    try {
        if (data.includes('/'))
            return new Date(data.split("/")[2] + '/' + data.split("/")[1] + '/' + data.split("/")[0]);

        return new Date(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

function ConvertStringDateToDateForInput(data) {
    return ConvertDateForInput(ConvertStringDateToDate(data));
}

function getTipoDocumento(tipo) {
    switch (tipo) {
        case "T":
            return "Texto";
        case "I":
            return "Imagem";
        case "F":
            return "Formulário";
        case "E":
            return "Edital";
        case "O":
            return "Outros";
    }
}

function getStatusAtividade(status) {
    switch (status) {
        case "A":
            return "Aberta";
        case "C":
            return "Cancelada";
        case "F":
            return "Finalizada";
    }
}

module.exports = {
    ConvertDateForInput,
    ConvertStringDateToDate,
    ConvertStringDateToDateForInput,
    getTipoDocumento,
    getStatusAtividade
}