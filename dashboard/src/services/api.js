import axios from "axios";

const api = axios.create({
    baseURL: 'https://run.mocky.io/v3/',
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    } 
});

export { api };