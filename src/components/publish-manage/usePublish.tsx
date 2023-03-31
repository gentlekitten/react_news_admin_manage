import { message } from 'antd'
import React, { useEffect, useState } from 'react'

import { deleteData, getData, patchData } from '../../api/index'

interface DataType {
    key: string;
    id: number;
    roleName: string;
}

export default function usePublish(publishState: number) {
    const { username } = JSON.parse(localStorage.getItem("token") as any)

    const [list, setList] = useState<DataType[]>([])

    useEffect(() => {
        getTableData()
    }, [username])

    const getTableData = async () => {
        const res = await getData(`news?author=${username}&publishState=${publishState}&_expand=category`)
        res.data.forEach((item: any) => {
            item["key"] = item.id
        })
        setList(res.data)
    }

    const handlePublish = async (id: number) => {
        await patchData(`news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        })
        message.success("发布成功！")
        getTableData()
    }
    const handleSunset = async (id: number) => {
        await patchData(`news/${id}`, {
            publishState: 3
        })
        message.success("下线成功！")
        getTableData()
    }
    const handleDelete = async (id: number) => {
        await deleteData(`news/${id}`)
        message.success("删除成功！")
        getTableData()
    }

    return {
        list,
        handlePublish,
        handleSunset,
        handleDelete
    }
}