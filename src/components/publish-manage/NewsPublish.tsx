import { Table, Space, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { NavLink } from "react-router-dom"


interface DataType {
    key: string;
    id: number;
    roleName: string;
}

export default function NewsPublish(props: any) {
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
                    {props.button(item.id)}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table style={{ minWidth: '500px' }}
                pagination={{ pageSize: 9 }}
                scroll={{ y: 650 }}
                dataSource={props.list}
                columns={columns}
            />
        </div>
    )
}
