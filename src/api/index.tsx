import request from '../utils/request'

export function getData(url: string, params = {}) {
    return request({
        url,
        method: 'get',
        params,
    })
}

export function postData(url: string, data = {}) {
    return request({
        url,
        method: 'post',
        data
    })
}

export function patchData(url: string, data = {}) {
    return request({
        url,
        method: 'patch',
        data
    })
}

export function deleteData(url: string, params = {}) {
    return request({
        url,
        method: 'delete',
        params
    })
}

export function upFiles(url: string, data = {}) {
    return request({
        url,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}