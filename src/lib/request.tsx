import axios from "axios";
import snakeCase from 'lodash-es/snakeCase'

const instance = axios.create({
   baseURL: "http://localhost:9090",
   withCredentials: true,
});

instance.interceptors.request.use(
     (config) => {
         config.params = processParams(config.params);
         return config;
     },
)

function processParams(params: Record<string, any>): Record<string, any> {
    const res: Record<string, any> = {};

    for (let [key, value] of Object.entries(params)) {
        res[snakeCase(key)] = value;
    }

    return res;
}

export default instance;
