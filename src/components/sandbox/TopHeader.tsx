import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    UserOutlined
} from '@ant-design/icons';

import { Layout, theme, Dropdown, Space, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props: any) {
    const navigate = useNavigate()

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token') as any)

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div>
                    {roleName}
                </div>
            ),
        },
        {
            key: '2',
            danger: true,
            label: (
                <div onClick={() => logout()}>
                    退出登录
                </div>
            ),
        },
    ];

    const changeCollapsed = () => {
        props.changeCollapsed()
    }

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <Header style={{ paddingLeft: 16, background: colorBgContainer, borderBottom: '1px solid #f7f7f7' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> :
                    <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                欢迎<b>{username}</b>
                <div style={{ float: 'right', marginLeft: '20px' }}>
                    <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar size={30} icon={<UserOutlined />} />
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>

        </Header>
    )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }: any) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
