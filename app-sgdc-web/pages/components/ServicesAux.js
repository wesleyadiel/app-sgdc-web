function ConvertDateForInput(data) {
    try {
        if(data)
            return data.toISOString().split('T')[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

function ConvertStringDateToDate(data)
{
    try {
        if(data.includes('/'))
            return new Date(data.split("/")[2] + '/' + data.split("/")[1] + '/' + data.split("/")[0]);

        return new Date(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

function ConvertStringDateToDateForInput(data)
{
    return ConvertDateForInput(ConvertStringDateToDate(data));
}

module.exports = {
    ConvertDateForInput,
    ConvertStringDateToDate,
    ConvertStringDateToDateForInput
}