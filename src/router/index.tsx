import React, { useEffect, useState } from 'react'
import { useRoutes } from 'react-router-dom'
import { Spin } from 'antd'
import { getData } from '../api'
import Redirect from '../components/Redirect'

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'


export default function MRouter() {
    Nprogress.start()
    const { role: { rights } } = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') as any) : { role: { rights: [] } }
    const localRouterMap: any = {
        "/home": LazyLoad("sandbox/home/Home"),
        "/user-manage/list": LazyLoad("sandbox/userManage/UserList"),
        "/right-manage/role/list": LazyLoad("sandbox/rightManage/RoleList"),
        "/right-manage/right/list": LazyLoad("sandbox/rightManage/RightList"),
        // "/right-manage/role/update": LazyLoad("sandbox/home/Home"),
        // "/right-manage/role/delete": LazyLoad("sandbox/home/Home"),
        // "/right-manage/right/update": LazyLoad("sandbox/home/Home"),
        // "/right-manage/right/delete": LazyLoad("sandbox/home/Home"),
        // "/news-manage/list": LazyLoad("sandbox/home/Home"),
        "/news-manage/add": LazyLoad("sandbox/newsManage/NewsAdd"),
        "/news-manage/update/:id": LazyLoad("sandbox/newsManage/NewsUpdate"),
        "/news-manage/preview/:id": LazyLoad("sandbox/newsManage/NewsPreview"),
        "/news-manage/draft": LazyLoad("sandbox/newsManage/NewsDraft"),
        "/news-manage/category": LazyLoad("sandbox/newsManage/NewsCategory"),
        "/audit-manage/audit": LazyLoad("sandbox/auditManage/Audit"),
        "/audit-manage/list": LazyLoad("sandbox/auditManage/AuditList"),
        "/publish-manage/unpublished": LazyLoad("sandbox/publishManage/Unpublished"),
        "/publish-manage/published": LazyLoad("sandbox/publishManage/Published"),
        "/publish-manage/sunset": LazyLoad("sandbox/publishManage/Sunset"),
    }

    const [routers, setRouters] = useState([])

    useEffect(() => {
        Nprogress.done()
    })
    useEffect(() => {
        getRouterList()
    }, [])

    const getRouterList = () => {
        Promise.all([
            getData('rights'),
            getData('children')
        ]).then((res) => {
            handleRouter([...res[0].data, ...res[1].data])
        })
    }

    const checkRouter = (item: any) => {
        return localRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserPermisson = (item: any) => {
        return rights.includes(item.key)
    }

    const handleRouter = (data: any) => {
        let list = [] as any
        data.forEach((item: any) => {
            if (checkRouter(item) && checkUserPermisson(item)) {
                list.push(
                    {
                        path: item.key,
                        element: localRouterMap[item.key]
                    }
                )
            }
        })
        setRouters(list)
    }

    const element = useRoutes(
        [
            {
                path: "/login", element: LazyLoad("login/Login")
            },
            {
                path: "/news", element: LazyLoad("news/News")
            },
            {
                path: "/detail/:id", element: LazyLoad("news/Detail")
            },
            {
                path: "/", element: <AuthComponent>
                    {LazyLoad("sandbox/NewsScandBox")}
                </AuthComponent>,
                children: [
                    {
                        path: "",
                        element: <Redirect to="/home" />
                    },
                    ...routers,
                    {
                        path: "*",
                        element: LazyLoad("404/NotFound")
                    },
                ]
            },
        ]
    )
    return element
}

// 路由拦截
const AuthComponent = ({ children }: any) => {
    return localStorage.getItem("token") ?
        children : <Redirect to="/login" />
}

// 路由懒加载
const LazyLoad = (path: string) => {
    const Comp = React.lazy(() => import(`../views/${path}`))
    return (
        <React.Suspense fallback={<Spin tip="Loading" size="large" />}>
            <Comp />
        </React.Suspense>
    )
}