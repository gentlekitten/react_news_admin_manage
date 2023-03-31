import { Card, Col, Row, List } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import _ from "lodash"

import { getData } from '../../api';

export default function News() {

    const [list, setList] = useState([]) as any

    useEffect(() => {
        getNewsList()
    }, [])
    // 获取新闻列表
    const getNewsList = async () => {
        const res = await getData("news?publishState=2&_expand=category")
        setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
    }

    return (
        <div style={{ padding: 10, minWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2>全球大新闻</h2>
                <span style={{ marginLeft: 20, fontSize: 18, color: '#9c9ba3' }}>查看新闻</span>
            </div>
            <Row gutter={[16, 16]}>
                {
                    list.map((item: any) =>
                    (
                        <Col span={8} key={item[0]}>
                            <Card style={{ height: 300 }} title={item[0]} bordered={false} hoverable>
                                <List
                                    bordered={false}
                                    dataSource={item[1]}
                                    pagination={{
                                        pageSize: 3
                                    }}
                                    renderItem={(data: any) => <List.Item><NavLink to={`/detail/${data.id}`}>{data.title}</NavLink></List.Item>}
                                />
                            </Card>
                        </Col>
                    )
                    )
                }
            </Row>
        </div>
    )
}
