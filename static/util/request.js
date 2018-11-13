import axios from 'axios' 
import qs from 'qs'

//创建axios实例
var service=axios.create({
    baseURL: 'https://hzkaoqin.hztuen.com/wechat',
    timeout:10000,
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
})

//添加请求拦截器
service.interceptors.request.use(function(config){
    // console.log('先执行请求拦截器');
    // config.headers.token = '568d80040df4'    //可改为取缓存token
    return config
},function(error){
    return Promise.reject(error)
})
//添加响应拦截器
service.interceptors.response.use(function(response){ 
    // console.log('执行到响应拦截器')
    return response
},function(error){
    console.log('err'+error) 
    alert(error)
    return Promise.reject(error)
})

export default{
    //get请求
    get(url,param){ 
        return new Promise((cback,reject)=>{
            service({
                method:'get',
                url,
                params:qs.stringify(param),  
            }).then(res=>{  //axios返回的是一个promise对象
                cback(res.data);   
                // console.log(res)  
            }).catch(err=>{
                console.log(err,'异常')
            })
        })
    },
    //post请求
    post(url,param){
        return new Promise((cback,reject)=>{
            service({
                method:'post',
                url,
                data:qs.stringify(param), 
            }).then(res=>{
                cback(res.data)        
                // console.log(res)
            }).catch(err=>{
                console.log(err,'异常')
                console.log(err.msg)
            })
        })
    }
}