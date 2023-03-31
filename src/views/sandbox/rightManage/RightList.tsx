import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, Modal, message, Popover, Switch } from 'antd'
import { getData, deleteData, patchData } from '../../../api/index';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { confirm } = Modal;

interface DataType {
    key: string;
    id: number;
    title: string;
    rightPath: number;
    children?: DataType[];
}

export default function RightList() {
    const [messageApi, contextHolder] = message.useMessage();
    // 表格数据
    const [list, setList] = useState<DataType[]>([])

    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <b>{text}</b>,
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (text) =>
                <Tag color="green" key={text}>
                    {text}
                </Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, item: any) => (
                <Space size="middle">
                    <Popover content={
                        <div style={{ textAlign: 'center' }}>
                            <Switch checkedChildren="开启"
                                unCheckedChildren="关闭"
                                defaultChecked={item.pagepermisson}
                                onChange={() => rightChange(item)} />
                        </div>
                    } title="编辑" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                        <Button type="primary" shape="circle" disabled={item.pagepermisson === undefined}>
                            <EditOutlined />
                        </Button>
                    </Popover>
                    <Button type="primary" danger shape="circle"
                        onClick={() => showConfirm(item)}>
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        getTableData()
    }, [])
    // 获取表格数据
    const getTableData = async () => {
        await getData('rights?_embed=children').then((res) => {
            const list = res.data
            list.forEach((item: any) => {
                if (item.children.length === 0) item.children = ""
            });
            setList(list)
        })
    }
    // 删除确认弹出层
    const showConfirm = (item: any) => {
        confirm({
            title: '确定要删除该内容吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                console.log('item', item)
                deleteRight(item);
            },
            onCancel() {
            },
        });
    };
    // 删除权限
    const deleteRight = async (item: any) => {
        let url = item.grade === 1 ? 'rights/' : 'children/'
        const res = await deleteData(url + item.id)
        messageApi.open({
            type: 'success',
            content: '删除成功！',
        });
        console.log('res', res)
        getTableData()
    }
    // 改变权限
    const rightChange = async (item: any) => {
        let url = item.grade === 1 ? 'rights/' : 'children/'
        const res = await patchData(url + item.id, { pagepermisson: item.pagepermisson ? 0 : 1 })
        console.log('item', item)
        messageApi.open({
            type: 'success',
            content: '操作成功！',
        });
        console.log('res', res)
    }
    return (
        <div>
            {contextHolder}
            <Table style={{ minWidth: '500px' }} scroll={{ y: 650 }} dataSource={list} columns={columns}
            />
        </div>
    )
}
