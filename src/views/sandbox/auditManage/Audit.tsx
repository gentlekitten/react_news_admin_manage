import React, { useEffect, useState } from 'react'
import { Table, Space, Button, message, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { NavLink } from "react-router-dom"

import { getData, patchData } from '../../../api'

interface DataType {
    key: string;
    id: number;
    roleName: string;
    // [props: string]: any
}

export default function Audit() {

    const auditList = ["未审核", "审核中", "已通过", "未通过"]
    const { username, region, roleId } = JSON.parse(localStorage.getItem("token") as any)


    const [list, setList] = useState<DataType[]>([])
    // 表格数据
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <b>{text}</b>,
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            key: 'title',
            render: (title, item) => <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>,
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            key: 'category',
            render: (item) => <div>{item.title}</div>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, item: any) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handlePass(item)}>
                        通过
                    </Button>
                    <Button onClick={() => handleCancel(item)}>
                        驳回
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getTableData()
    }, [roleId, region, username])
    // 获取数据列表
    const getTableData = async () => {
        let list = []
        const res = await getData(`news?auditState=1&publishState_lte=${roleId}&_expand=category`)
        console.log('res', res.data)
        res.data.forEach((item: any) => {
            item["key"] = item.id
        })
        if (roleId === 1) {
            list = res.data
        }
        else {
            list = res.data.filter((item: any) => {
                return (item.author !== username && item.region === region)
            })
        }
        setList(list)
    }
    // 处理驳回
    const handleCancel = async (item: any) => {
        await patchData('news/' + item.id, {
            auditState: 3
        })
        message.success("驳回成功！")
        getTableData()
    }
    // 处理通过
    const handlePass = async (item: any) => {
        await patchData('news/' + item.id, {
            publishState: 1,
            auditState: 2
        })
        message.success("处理成功！")
        getTableData()
    }

    return (
        <div>
            <Table style={{ minWidth: '500px' }}
                pagination={{ pageSize: 9 }}
                scroll={{ y: 650 }}
                dataSource={list}
                columns={columns}
            />
        </div>
    )
}
