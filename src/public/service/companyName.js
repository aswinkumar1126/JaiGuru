import axios from 'axios'

export default function getCompanyName(){
    const response = axios.get('https://das.brightechsoftware.com/api/v1/companyNamesAndLogo');
    return response.data 
}