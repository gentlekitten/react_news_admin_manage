import React, { useEffect, useState, useMemo } from 'react';
import { Button, message, Steps, Select, Form, Input, notification } from 'antd';
import { getData, postData } from '../../../api';
import Edit from '../../../components/newsManage/Edit';

const { Option } = Select;

const steps = [
    {
        title: '基本信息',
        description: '新闻标题、新闻分类'
    },
    {
        title: '新闻内容',
        description: '新闻主体内容'
    },
    {
        title: '新闻提交',
        description: '保存草稿或者提交审核'
    },
];

export default function NewsAdd() {
    const user = localStorage.getItem("token") ?
        JSON.parse(localStorage.getItem("token") as any) : ""

    const [form] = Form.useForm();

    // 当前索引
    const [current, setCurrent] = useState(0);
    // 新闻类别列表
    const [category, setCategory] = useState([]);
    // 
    const [formContent, setFormContent] = useState({})
    const [content, setContent] = useState("")

    const [api, contextHolder] = notification.useNotification();

    const items = steps.map((item) => ({ key: item.title, title: item.title, description: item.description }));

    useEffect(() => {
        getCategory()

    }, [])

    // 获取新闻分类列表
    const getCategory = async () => {
        const res = await getData('categories')
        console.log('res', res.data)
        setCategory(res.data)
    }
    // 点击下一步
    const clickNext = () => {
        if (current === 0) {
            form.validateFields()
                .then(() => {
                    setFormContent(form.getFieldsValue())
                    setCurrent(current + 1)
                })
                .catch((err: any) => console.log('err', err))
        } else {
            if (!content || content.trim() === '<p></p>') {
                return message.error("新闻内容不能为空！")
            }
            setCurrent(current + 1)
        }

    }
    const saveNews = async (auditState: number) => {
        const res = await postData('news', {
            ...formContent,
            content: content,
            region: user?.region,
            author: user?.username,
            roleId: user?.roleId,
            auditState,
            publishState: 0,
            createTime: Date.now(),
            star: 0,
            view: 0,
            publishTime: 0
        })
        console.log('res', res)
        api.info({
            message: `消息提示`,
            description: auditState ? "保存草稿成功！请到草稿箱里查看" : "提交成功！请到审核列表里查看",
            placement: "bottomRight",
        });
    };
    return (
        <div>
            {contextHolder}
            <h1>撰写新闻</h1>
            <Steps current={current} items={items} />
            <div style={{ margin: "50px 0" }}>
                <div style={{ display: current === 0 ? "" : "none" }}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入标题!' }]}
                        >
                            <Input placeholder="请输入标题" />
                        </Form.Item>
                        <Form.Item
                            label="新闻类别"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择类别!' }]}
                        >
                            <Select
                                placeholder="请选择类别！"
                                allowClear
                            >
                                {
                                    useMemo(() => (
                                        category.map((item: any) => (
                                            <Option
                                                value={item.id}
                                                key={item.id}>{item.title}</Option>
                                        ))
                                    ), [category])
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div style={{ display: current === 1 ? "" : "none" }}>
                    <Edit getContent={(value: any) => {
                        setContent(value)
                    }}></Edit>
                </div>
                <div style={{ display: current === 2 ? "" : "none" }}>
                </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex' }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => clickNext()}>
                        下一步
                    </Button>
                )}

                <div style={{ display: 'flex' }}>
                    {current === steps.length - 1 && (
                        <div>
                            <Button style={{ marginRight: '10px' }}
                                onClick={() => saveNews(0)}>
                                保存草稿
                            </Button>
                            <Button type="primary"
                                onClick={() => saveNews(1)}>
                                提交
                            </Button>
                        </div>

                    )}
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => setCurrent(current - 1)}>
                            上一步
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
