import { Outlet } from 'react-router'

import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

import { Layout, theme, Spin, Tag, Space } from 'antd';

import { connect } from 'react-redux';

import './NewsScandBox.css'
import Tags from '../../components/sandbox/Tags';

const { Content } = Layout;

function NewsScandBox(props: any) {
    const {
        token: { colorBgContainer }
    } = theme.useToken()
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Tags></Tags>
                <Spin tip="Loading" spinning={props.isLoading} size="large">
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 780,
                            minWidth: 800,
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet></Outlet>
                    </Content>
                </Spin>
            </Layout>
        </Layout>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }: any) => {
    return {
        isLoading
    }
}

export default connect(mapStateToProps)(NewsScandBox)
