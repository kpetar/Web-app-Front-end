import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiConfig } from "../config/apiConfig";

export default function api(path:string, method:'GET'|'POST'|'PATCH'|'DELETE', body?:any)
{
    return new Promise<ApiResponse>((resolve)=>{
        const requestData={
            method:method,
            url:path,
            baseURL:ApiConfig.API_URL,
            data:JSON.stringify(body),
            headers:{
                'Content-type':'application/json',
                'Authorization':getToken()
            }
        };
        axios(requestData)
        .then(res=>responseHandler(res,resolve))
        .catch(async err=>{


            if(err.response.status===401)
            {
                const newToken= await refreshToken();
    
                if(!newToken)
                {
                    const response:ApiResponse={
                        status:'login',
                        data:null
                    }
                    return resolve(response);
                }
    
                saveToken(newToken);
    
                requestData.headers['Authorization'] = getToken();
    
                return await repeatRequest(requestData, resolve);
            }

            const response:ApiResponse={
                status:'error',
                data:err
            };

            resolve(response);
        });
    });
    
}

//podaci koji stizu od API-ja
export interface ApiResponse{
    status:'ok'|'error'|'login',
    data:any
}

async function responseHandler(res:AxiosResponse<any>, resolve: (value: ApiResponse) => void)
{
    if(res.status<200 || res.status>=300)
    {
        //nepovoljan kod kada server ne odradi posao
        const response:ApiResponse={
            status:'error',
            data:res.data
        }
        return resolve(response);
    }
    let response:ApiResponse;
    if(res.data.statusCode<0)
    { 
        //nepovoljan kod kada aplikacija ne odradi posao
        response={
            status:'login',
            data:null
        };
    }
    else
    {
        response={
            status:'ok',
            data:res.data
        };
    }
    resolve(response);
}

function getRefreshToken():string{
    const token=localStorage.getItem('api_refresh_token');
    return token+ '';
}
export function saveRefreshToken(token:string)
{
    localStorage.setItem('api_refresh_token',token);
}

async function refreshToken():Promise<string|null>
{
    const path='authorization/user/refresh';
    const data={
        token:getRefreshToken(),
    }

    const refreshTokenRequestData:AxiosRequestConfig={
        method:'post',
        url:path,
        baseURL:ApiConfig.API_URL,
        data:JSON.stringify(data),
        headers:{
            'Content-type':'application/json'
        }
    };

    const refreshTokenResponse:{data:{token:string|undefined}}=await axios(refreshTokenRequestData);

    if(!refreshTokenResponse.data.token)
    {
        return null;
    }

    return refreshTokenResponse.data.token;

}

function getToken():string
{
    const token=localStorage.getItem('api_token');  //lokalno skladiste veb pregledaca
    return 'Bearer' + token;
}

export function saveToken(token:string)
{
    localStorage.setItem('api_token', token);
}

async function repeatRequest(requestData: AxiosRequestConfig, resolve: (value: ApiResponse) => void)
{
    axios(requestData)
    .then(res=>{
        let response:ApiResponse;
        if(res.status===401)
        {
             response={
                status:'login',
                data:null
            };
        }
        else{
         response={
            status:'ok',
            data:res
        };
    }
        return resolve(response);
    })
    .catch(err=>{
        const response:ApiResponse={
            status:'error',
            data:err
        };
        return resolve(response);
    })
}