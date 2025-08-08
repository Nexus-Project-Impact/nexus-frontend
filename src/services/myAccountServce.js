import api from "./api";


const AccountService  = {

    getAccountData: async () => {
        const response = await api.get('/User/getUserData')
        return response.data;
    }
}

export default AccountService;