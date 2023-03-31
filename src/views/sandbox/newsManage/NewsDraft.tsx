import React, { useEffect, useState } from 'react'
import { Table, Space, Button, Modal, message } from 'antd'
import { getData, deleteData, patchData } from '../../../api/index';
import { NavLink, useNavigate } from 'react-router-dom'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
    UploadOutlined
} from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';

const { confirm } = Modal;

interface DataType {
    key: number;
    id: number;
    title: string;
    author: string;
    category: any;
    // [props: string]: any
}

export default function NewsDraft() {
    // 表格数据
    const [list, setList] = useState<DataType[]>([])
    const navigate = useNavigate()

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
            render: (item) => <div>{item.value}</div>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, item: any) => (
                <Space size="middle">
                    <Button type="primary" shape="circle">
                        <EditOutlined
                            onClick={() =>
                                navigate(`/news-manage/update/${item.id}`)
                            } />
                    </Button>
                    <Button type="primary" danger shape="circle"
                        onClick={() => showConfirm(item)}>
                        <DeleteOutlined />
                    </Button>
                    <Button type="primary" ghost shape="circle"
                        onClick={() => upNews(item)}>
                        <UploadOutlined />
                    </Button>
                </Space>
            ),
        },
    ];
    const { username } = JSON.parse(localStorage.getItem("token") as any)

    useEffect(() => {
        getTableData()
    }, [])


    // 获取表格数据
    const getTableData = async () => {
        const res = await getData(`news?author=${username}&auditState=0&_expand=category`)
        console.log('res', res.data)
        res.data.forEach((item: any) => {
            item["key"] = item.id
        })
        setList(res.data)
    }
    // 删除确认弹出层
    const showConfirm = (item: any) => {
        confirm({
            title: '确定要删除该内容吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                console.log('item', item)
                deleteDraft(item)
            }
        });
    };
    // 删除
    const deleteDraft = async (item: any) => {
        const res = await deleteData('news/' + item.id)
        console.log('res', res)
        message.success("删除成功！")
        getTableData()
    }
    // 提交文章
    const upNews = async (item: any) => {
        const res = await patchData('news/' + item.id, {
            auditState: 1
        })
        console.log('res.data', res.data)
        message.success("提交成功！")
        getTableData()
    }

    return (
        <div>
            <Table style={{ minWidth: '500px' }} pagination={{ pageSize: 9 }} scroll={{ y: 650 }} dataSource={list} columns={columns}
            />
        </div>
    )
}
