import React, { useEffect, useState, useContext, useRef } from 'react'
import { Table, Space, Button, message, Form, Input, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import type { FormInstance } from 'antd/es/form';
import type { InputRef } from 'antd';

import {
    DeleteOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';

import { deleteData, getData, patchData } from '../../../api'

const { confirm } = Modal;

interface DataType {
    key: string;
    id: number;
    roleName: string;
    [props: string]: any;
}

interface EditableRowProps {
    index: number;
}
interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}
interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}
const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
}
const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const components = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};

export default function NewsCategory() {

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
            title: '栏目名称',
            dataIndex: 'title',
            key: 'title',
            onCell: (record: DataType) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave,
            }),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, item) => (
                <Space size="middle">
                    <Button danger shape="circle" size="large" onClick={() => showConfirm(item)}>
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getTableData()
    }, [])

    const getTableData = async () => {
        const res = await getData('categories')
        console.log('res', res)
        res.data.forEach((item: any) => {
            item["key"] = item.id
        })
        setList(res.data)
    }
    // 处理表格保存
    const handleSave = async (row: DataType) => {
        console.log('row', row)
        await patchData('categories/' + row.id, {
            title: row.title,
            value: row.value
        })
        message.success("操作成功！")
        getTableData()
    }
    // 删除确认弹出层
    const showConfirm = (item: any) => {
        confirm({
            title: '确定要删除该内容吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                console.log('item', item)
                deleteCategory(item);
            }
        });
    };

    // 删除分类
    const deleteCategory = async (item: DataType) => {
        await deleteData('categories/' + item.id)
        message.success("删除成功！")
        getTableData()
    }
    return (
        <div>
            <Table style={{ minWidth: '500px' }}
                components={components}
                pagination={{ pageSize: 9 }}
                scroll={{ y: 650 }}
                dataSource={list}
                columns={columns}
            />
        </div>
    )
}