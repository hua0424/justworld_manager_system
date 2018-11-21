import axios from 'axios'
import router from '@/router'
import {Message} from 'element-ui'
import {MessageBox} from 'element-ui'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;

axios.defaults.baseURL = process.env.BASE_URL, // api 的 base_url

axios.defaults.timeout = 5000

// request interceptor
axios.interceptors.request.use(
    config => {
        //发起请求时，取消掉当前正在进行的相同请求
        if (promiseArr[config.url]) {
            promiseArr[config.url]('操作取消')
            promiseArr[config.url] = cancel
        } else {
            promiseArr[config.url] = cancel
        }
        // Do something before request is sent
        if (localStorage.getItem('_login_token_')) {
            // 让每个请求携带token--
            config.headers['Authorization'] = localStorage.getItem('_login_token_')
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response interceptor
axios.interceptors.response.use(
    // response => response,
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    response => {
        const res = response.data;
        if (res.rtcd != null && res.rtcd != "0") {
            // 没有登录
            if (res.rtcd === "401") {
                MessageBox.confirm('你尚未登录或已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    router.push('/login');
                    // location.reload() // 为了重新实例化vue-router对象 避免bug
                })
            } else if (res.rtcd === "403") {
                Message({
                    message: '你没有执行此操作所需要的权限，请联系管理员授权',
                    type: 'warning',
                    duration: 5 * 1000
                })
            } else {
                Message({
                    message: res.msg,
                    type: 'error',
                    duration: 5 * 1000
                })
            }
            return Promise.reject('error')
        } else {
            return response
        }
    },
    error => {
        console.log('请求出错' + error) // for debug
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'
                    break;
                case 401:
                    error.message = '未授权，请重新登录'
                    break;
                case 403:
                    error.message = '拒绝访问'
                    break;
                case 404:
                    error.message = '请求错误,未找到该资源'
                    break;
                case 405:
                    error.message = '请求方法未允许'
                    break;
                case 408:
                    error.message = '请求超时'
                    break;
                case 500:
                    error.message = '服务器端出错'
                    break;
                case 501:
                    error.message = '网络未实现'
                    break;
                case 502:
                    error.message = '网络错误'
                    break;
                case 503:
                    error.message = '服务不可用'
                    break;
                case 504:
                    error.message = '网络超时'
                    break;
                case 505:
                    error.message = 'http版本不支持该请求'
                    break;
                default:
                    error.message = `连接错误${error.response.status}`
            }
        } else {
            error.message = "连接到服务器失败"
        }
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default {
    //get请求
    get (url,param) {
        return new Promise((resolve,reject) => {
            axios({
                method: 'get',
                url,
                params: param,
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            }).then(res => {
                resolve(res)
            })
        })
    },
    //post请求
    post (url,param) {
        return new Promise((resolve,reject) => {
            axios({
                method: 'post',
                url,
                data: param,
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            }).then(res => {
                resolve(res)
            })
        })
    }
}
