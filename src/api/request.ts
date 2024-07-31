
import axios from "axios";
import { REQUEST_URL } from "../constant/request";

const instance = axios.create();
instance.defaults.timeout = 2500;
instance.defaults.baseURL = REQUEST_URL;
instance.defaults.withCredentials = true;

instance.interceptors.request.use(function (config) {
    // if(localStorage.getItem("token")){
    //     config.headers["Authorization"] = localStorage.getItem("token");
    // }
    console.log(document.cookie)
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

export default instance;