import React, { forwardRef, useMemo } from 'react'
import { Select, Form, Input } from 'antd';

const { Option } = Select;

const UserForm = forwardRef((props: any, ref: any) => {

    // 根据权限和区域显示可选角色和区域

    return (
        <div style={{ paddingTop: '60px', height: '300px' }}>
            <Form
                ref={ref}
                name={props.name}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item name="region" label="区域" rules={[{ required: true }]}>
                    <Select
                        placeholder="请选择一个区域"
                        allowClear
                    >
                        {
                            useMemo(() => (
                                props.region.map((item: any) => (
                                    <Option disabled={props.userRegion !== item.text && props.roleId !== 1} value={item.text} key={item.id}>{item.text}</Option>
                                ))
                            ), [props.roleId, props.userRegion, props.region])
                        }

                    </Select>
                </Form.Item>
                <Form.Item name="roleId" label="角色" rules={[{ required: true }]}>
                    <Select
                        placeholder="请选择一个角色"
                        allowClear
                    >
                        {
                            useMemo(() => (
                                props.roles.map((item: any) => (
                                    <Option disabled={props.roleId >= item.id && props.roleId !== 1}
                                        value={item.id}
                                        key={item.id}>{item.roleName}</Option>
                                ))
                            ), [props.roleId, props.roles])
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})

export default UserForm
