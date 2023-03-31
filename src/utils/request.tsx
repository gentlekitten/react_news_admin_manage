/**
 * 网络请求配置
 */
import axios, {
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError
} from "axios";

import { store } from "../redux/store";


// create an axios instance
const service = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 5000,
    // transformRequest: [data => qs.stringify(data)]
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
})
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 开启加载
        store.dispatch({
            type: "change_loading",
            payload: true
        })
        return config
    },
    (error: AxiosError) => {
        console.log(error)
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 关闭加载
        store.dispatch({
            type: "change_loading",
            payload: false
        })
        const res = response
        return res
    },
    (error: AxiosError) => {
        store.dispatch({
            type: "change_loading",
            payload: false
        })
        console.log(error)
        return Promise.reject(error)
    }
)
export default service
