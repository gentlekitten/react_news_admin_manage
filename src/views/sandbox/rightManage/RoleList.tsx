import React, { useEffect, useState } from 'react'
import { Table, Space, Button, Modal, message, Tree } from 'antd'
import { getData, deleteData, patchData } from '../../../api/index';
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const { confirm } = Modal;

interface DataType {
  key: string;
  id: number;
  roleName: string;
  // [props: string]: any
}
let treeCheckedKeysList: DataType[] = []
let id: number = 1

export default function RoleList() {
  const [messageApi, contextHolder] = message.useMessage();

  // 表格数据
  const [list, setList] = useState<DataType[]>([])

  // 是否打开对话框
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // tree数据
  const [treeList, setTreeList] = useState<DataNode[]>([])

  // 路由树形选中的数据
  const [routerCheckedKeys, setRouterCheckedKeys] = useState<React.Key[]>([]);

  // 树形展开列表
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 表格数据
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <b>{text}</b>,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, item: any) => (
        <Space size="middle">
          <Button type="primary" shape="circle" onClick={() => openTreeModel(item)}>
            <UnorderedListOutlined />
          </Button>
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
    getTreeData()
  }, [])

  // 获取表格数据
  const getTableData = async () => {
    const res = await getData('roles')
    console.log('res', res.data)
    setList(res.data)
  }

  // 获取路由树形数据
  const getTreeData = async () => {
    const res = await getData('rights?_embed=children')
    console.log('res', res)
    setTreeList(res.data)
  }

  // 删除确认弹出层
  const showConfirm = (item: any) => {
    confirm({
      title: '确定要删除该内容吗？',
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log('item', item)
        deleteRight(item);
      }
    });
  };

  // 删除权限
  const deleteRight = async (item: any) => {
    const res = await deleteData('roles/' + item.id)
    messageApi.open({
      type: 'success',
      content: '删除成功！',
    });
    console.log('res', res)
    getTableData()
  }

  // 打开树形对话框
  const openTreeModel = (item: any) => {
    console.log('item', item)
    id = item.id
    treeCheckedKeysList = item.rights
    setRouterCheckedKeys(item.rights)
    // 设置展开那个节点
    setExpandedKeys([item.rights[item.rights.length - 1]])
    setIsModalOpen(true)
  }

  // 确认编辑用户路由显示
  const rightChange = async () => {
    const res = await patchData('roles/' + id, {
      rights: treeCheckedKeysList
    })
    console.log('res', res)
    setIsModalOpen(false)
    messageApi.open({
      type: 'success',
      content: '修改成功！',
    });
    getTableData()
  }

  // 选择树形节点
  const onTreeCheck = (checkedKeysValue: any) => {
    setRouterCheckedKeys(checkedKeysValue);
    treeCheckedKeysList = checkedKeysValue
  };

  return (
    <div>
      {contextHolder}
      <Table style={{ minWidth: '500px' }} pagination={{ pageSize: 9 }} scroll={{ y: 650 }} dataSource={list} columns={columns}
      />
      <Modal title="编辑" open={isModalOpen} onOk={rightChange} onCancel={() => setIsModalOpen(false)}>
        <Tree
          checkable
          onExpand={(expandedKeysValue) => setExpandedKeys(expandedKeysValue)}
          expandedKeys={expandedKeys}
          autoExpandParent
          onCheck={onTreeCheck}
          checkedKeys={routerCheckedKeys}
          treeData={treeList}
        />
      </Modal>
    </div >
  )
}
