export default class PostService {
    static async getCats(){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({getDataCats:1})
        })
        res = await res.json()
        return res;
    }

    static async getTovarsofCatId(id, token){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({getTovarsofCatId:id, token:token})
        })
        res = await res.json()
        return res;
    }

    static async getTovarOfId(id, token){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({getTovarOfId:id, token:token})
        })
        res = await res.json()
        return res;
    }

    static async sendOcenkaTovaru(ocenka, id, token){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({sendOcenkaTovaru:ocenka, id:id, token:token})
        })
        res = await res.json()
        return res;
    }

    static async getSoacials(){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({getSoacials:'getSoacials'})
        })
        res = await res.json()
        return res;
    }

    static async loginUser(login, pass){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({loginGuest:login, pass: pass})
        })
        res = await res.json()
        return res;
    }
    static async signUpUser(login, pass){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({signUpUser:login, pass: pass})
        })
        res = await res.json()
        return res;
    }
    static async createNewCat(formData){
        let res = await fetch(`http://f0497377.xsph.ru/api/formData1.php`,{
            method:'POST',
            body:formData //когда отправляем formData Content-Type не пишем И НЕ НУЖНО JSON STRINGIFY
        })
        res = await res.json()
        return res;
    }
    // headers: {
    //     'Content-Type': 'multipart/form-data'
    // }
    // 'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    static async turnSwitchTovar(token, id, valSwitch){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({turnSwitchTovar:'1', token: token, id: id, valSwitch: valSwitch})
        })
        res = await res.json()
        return res;
    }
    static async removeTovar(token, id){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({removeTovar:'1', token: token, id: id})
        })
        res = await res.json()
        return res;
    }
    static async getUsers(token){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({getUsers:'1', token: token})
        })
        res = await res.json()
        return res;
    }

    static async admissUser(token, id, valAdmiss){
        let res = await fetch(`http://f0497377.xsph.ru/api/functions.php`,{
            method:'POST',
            body:JSON.stringify({admissUser:'1', token: token, id: id, valAdmiss: valAdmiss})
        })
        res = await res.json()
        return res;
    }
}