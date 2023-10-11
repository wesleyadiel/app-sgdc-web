import { setCookie, parseCookies } from 'nookies';

async function GetUserProps(router) {

    try {
        const { 'sgdc-token': token } = parseCookies();
        if (!token) {
            router.push("/");
            return null;
        }
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BASE_API}/usuario/token`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });

        const data = await res.json();
        if (res.status != 200) {
            router.push("/");
            return null;
        }

        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    GetUserProps
}