import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import * as echarts from 'echarts';

import _ from "lodash"

import { getData } from '../../../api';

const { Meta } = Card;

export default function Home() {

    const { role: { roleName }, username, region } = JSON.parse(localStorage.getItem('token') as any)

    // 用户最常浏览列表
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    // 
    const [allList, setAllList] = useState([])

    const [columnChart, setColumnChart] = useState(null)
    const [pieChart, setPieChart] = useState(null)

    const [open, setOpen] = useState(false);

    useEffect(() => {
        getViewList()
        getStarList()
        getColumnData()
        return () => {
            window.onresize = null
        }
    }, [])


    // 获取最多浏览列表
    const getViewList = async () => {
        const res = await getData("news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6")
        console.log('res', res)
        setViewList(res.data)
    }
    // 获取最多点赞列表
    const getStarList = async () => {
        const res = await getData("news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6")
        setStarList(res.data)
    }
    // 初始化柱形图
    const initColumnChart = (obj: any) => {
        let myChart: any = null
        if (!columnChart) {
            myChart = echarts.init(document.getElementById('column') as any);
            setColumnChart(myChart)
        } else {
            myChart = columnChart
        }
        let options = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj)
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map((item: any) => item.length)
                }
            ]
        }
        myChart.setOption(options);
        window.onresize = () => {
            myChart.resize()
        }
    }

    // 初始化饼图
    const initPieChart = () => {

        let currentList = allList.filter((item: any) => item.author === username)
        let groupObj = _.groupBy(currentList, (item: any) => item.category.title)
        let list = []
        for (let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }

        let myChart: any = null
        if (!pieChart) {
            myChart = echarts.init(document.getElementById('pie') as any);
            setPieChart(myChart)
        } else {
            myChart = pieChart
        }
        let options = {
            title: {
                text: '当前用户新闻分类图示',
                subtext: '百分比',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '60%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        myChart.setOption(options)
    }
    // 获取柱形图数据
    const getColumnData = async () => {
        const res = await getData("news?publishState=2&_expand=category")
        setAllList(res.data)
        initColumnChart(_.groupBy(res.data, item => item.category.title))
    }
    // 显示右侧抽屉
    const showDrawer = async () => {
        await setOpen(true);
        initPieChart()
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={false}>
                        <List
                            dataSource={viewList}
                            renderItem={(item: any) => <List.Item><NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户最多点赞" bordered={false}>
                        <List
                            dataSource={starList}
                            renderItem={(item: any) => <List.Item><NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                style={{ height: 240 }}
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={showDrawer} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b style={{ marginRight: 30 }}>{region}</b>
                                    {roleName}
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <div id="column" style={{ width: 600, height: 300, marginTop: 50 }}></div>
            {/* 右侧抽屉 */}
            <Drawer
                title="个人新闻分类"
                placement="right"
                closable={true}
                onClose={() => setOpen(false)}
                open={open}
                size="large"
                key="right"
            >
                <div id="pie" style={{ width: 600, height: 300 }}></div>
            </Drawer>
        </div>
    )
}
