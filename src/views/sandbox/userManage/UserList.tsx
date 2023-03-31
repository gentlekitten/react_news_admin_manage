import React, { useEffect, useRef, useState } from 'react';
import { Table, Space, Button, Modal, message, Switch } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import { getData, deleteData, patchData, postData } from '../../../api/index';

import type { ColumnsType } from 'antd/es/table';
import UserForm from '../../../components/userManage/UserForm';

const { confirm } = Modal;


interface DataType {
    key: number;
    id: number;
    username: string;
    roleName: string;
    region: string;
    roleState: boolean;
    default: boolean;
    // [props: string]: any
}

interface regionDataType {
    id: number,
    text: string,
    value: string
}
interface roleListDataType {
    id: number,
    roleName: string,
    roleType: number,
    [props: string]: any
}



export default function UserList() {

    const user = JSON.parse(localStorage.getItem('token') as any)

    const [messageApi, contextHolder] = message.useMessage();

    const addFormRef = useRef<any>(null)
    const editFormRef = useRef<any>(null)

    // 是否打开对话框
    const [addFormIsModalOpen, setAddIsModalOpen] = useState<boolean>(false);
    // 是否打开对话框
    const [editFormIsModalOpen, setEditFormIsModalOpen] = useState<boolean>(false);

    const [list, setList] = useState<DataType[]>([])
    // 地区列表
    const [region, setRegion] = useState<regionDataType[]>([])

    // 角色列表
    const [roleList, setRoleList] = useState<roleListDataType[]>([])

    // 报存所点击编辑哪项的数据
    const [editCurrent, setEditCurrent] = useState<any>({})


    const columns: ColumnsType<DataType> = [
        {
            title: '区域',
            dataIndex: 'region',
            key: 'region',
            filters: region,
            onFilter: (value: any, record) => record.region.indexOf(value) === 0,
            render: (_, item: any) => (
                <b>{item.region}</b>
            )
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (_, item: any) => (
                <div>{item.role.roleName}</div>
            )
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'status',
            render: (_, item: any) => (
                <Space size="middle">
                    <Switch checkedChildren="开启"
                        unCheckedChildren="关闭"
                        disabled={item.default}
                        defaultChecked={item.roleState}
                        onChange={() => userStatusChange(item)} />
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, item: any) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" disabled={item.default}
                        onClick={() => openEditModel(item)}>
                        <EditOutlined />
                    </Button>
                    <Button type="primary" danger shape="circle" disabled={item.default}
                        onClick={() => showConfirm(item)}>
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getTableData()
        getRegionsData()
        getRoleListData()
    }, [])

    // 获取表格数据
    const getTableData = async () => {
        const res = await getData('users?_expand=role')
        res.data.forEach((item: any) => {
            item["key"] = item.id
        })
        console.log('res', res.data)
        let arr = [] as any
        // 除去超级管理员
        if (user.roleId !== 1) {
            // 只显示登录用户同一区域下和比该角色权限低的
            arr = res.data.filter(
                (item: any) => user.region === item.region && item.roleId > user.roleId)
        } else {
            arr = res.data
        }
        setList(arr)
    }

    // 获取地区列表数据
    const getRegionsData = async () => {
        const res = await getData('regions')
        console.log('res', res.data)
        setRegion(res.data)
    }

    // 获取角色列表数据
    const getRoleListData = async () => {
        const res = await getData('roles')
        console.log('res', res.data)
        setRoleList(res.data)
    }
    // 打开编辑弹出层
    const openEditModel = async (item: any) => {
        console.log('item', item)
        setEditCurrent(item)
        await setEditFormIsModalOpen(true)
        editFormRef.current.setFieldsValue(item)
    }

    const showConfirm = (item: any) => {
        confirm({
            title: '确定要删除该内容吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                console.log('item', item)
                deleteUser(item);
            },
            onCancel() {
            },
        });
    }

    // 删除用户
    const deleteUser = async (item: any) => {
        const res = await deleteData('users/' + item.id)
        messageApi.open({
            type: 'success',
            content: '删除成功！',
        });
        console.log('res', res)
        getTableData()
    }

    // 切换用户状态
    const userStatusChange = async (item: any) => {
        const res = await patchData('users/' + item.id, { roleState: !item.roleState })
        messageApi.open({
            type: 'success',
            content: '操作成功！',
        });
        console.log('res', res)
        getTableData()
    }

    // 编辑用户
    const editUser = async () => {
        editFormRef.current.validateFields()
            .then(async (value: any) => {
                console.log('value', value)
                const res = await patchData('users/' + editCurrent.id, value)
                console.log('res', res)
                setEditFormIsModalOpen(false)
                messageApi.open({
                    type: 'success',
                    content: '修改成功！',
                });
                getTableData()
            })
            .catch((err: any) => console.log('err', err))
    }

    // 添加用户
    const addUser = () => {
        addFormRef.current.validateFields()
            .then(async (value: any) => {
                console.log('value', value)
                const res = await postData('users', {
                    ...value,
                    roleState: true,
                    default: false,
                })
                console.log('res', res)
                setAddIsModalOpen(false)
                addFormRef.current.resetFields()
                messageApi.open({
                    type: 'success',
                    content: '添加成功！',
                });
                getTableData()
            })
            .catch((err: any) => console.log('err', err))
    }

    return (
        <div>
            {contextHolder}
            <Button style={{ marginBottom: '20px' }} onClick={() => setAddIsModalOpen(true)} type="primary">添加用户</Button>
            <Table columns={columns} dataSource={list} pagination={{ pageSize: 9 }} />
            <Modal title="编辑"
                open={editFormIsModalOpen}
                onOk={editUser}
                okText="确认"
                cancelText="取消"
                onCancel={() => setEditFormIsModalOpen(false)}>
                <UserForm
                    ref={editFormRef}
                    name="edit"
                    region={region}
                    userRegion={user.region}
                    roleId={user.roleId}
                    roles={roleList}></UserForm>
            </Modal>
            <Modal width="600px"
                title="添加用户"
                okText="添加"
                cancelText="取消"
                open={addFormIsModalOpen}
                onOk={addUser}
                onCancel={() => setAddIsModalOpen(false)}>
                <UserForm
                    ref={addFormRef}
                    name="add"
                    userRegion={user.region}
                    roleId={user.roleId}
                    region={region}
                    roles={roleList} >
                </UserForm>
            </Modal>
        </div >
    )
}
