import React, { useEffect, useState } from 'react'
import { Table, Space, Button, message, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { NavLink } from "react-router-dom"
import { useNavigate } from 'react-router';

import { getData, patchData } from '../../../api'

interface DataType {
    key: string;
    id: number;
    roleName: string;
    // [props: string]: any
}

export default function AuditList() {

    const auditList = ["未审核", "审核中", "已通过", "未通过"]
    const { username } = JSON.parse(localStorage.getItem("token") as any)

    const navigate = useNavigate()

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
            title: '审核状态',
            dataIndex: 'auditState',
            key: 'auditState',
            render: (item) => <Tag
                color={item === 2 ? 'green' : item === 1 ? 'orange' : 'red'}>
                {auditList[item]}</Tag>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, item: any) => (
                <Space size="middle">
                    {
                        item.auditState === 2 ?
                            <Button type="primary" onClick={() => handleSend(item)}>
                                发布
                            </Button>
                            : item.auditState === 1 ?
                                <Button onClick={() => handleCancel(item)}>
                                    撤销
                                </Button> :
                                <Button type="dashed" onClick={() =>
                                    navigate(`/news-manage/update/${item.id}`)
                                }>
                                    修改
                                </Button>
                    }

                </Space>
            ),
        },
    ];

    useEffect(() => {
        getTableData()
    }, [])
    // 获取数据列表
    const getTableData = async () => {
        const res = await getData(`news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
        console.log('res', res.data)
        res.data.forEach((item: any) => {
            item["key"] = item.id
        })
        setList(res.data)
    }
    // 撤销新闻
    const handleCancel = async (item: any) => {
        await patchData('news/' + item.id, {
            auditState: 0
        })
        message.success("撤销成功！")
        getTableData()
    }
    // 发布新闻
    const handleSend = async (item: any) => {
        await patchData('news/' + item.id, {
            publishState: 2,
            publishTime: Date.now()
        })
        message.success("撤销成功！")
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
