import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import moment from 'moment'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import { getData } from '../../../api';

export default function NewsPreview() {
    const { id } = useParams()
    const navigate = useNavigate()

    const auditList = ["未审核", "审核中", "已通过", "未通过"]
    const publishList = ["未发布", "待发布", "已上线", "已下线"]

    const [newsInfo, setNewsInfo] = useState<any>([])
    useEffect(() => {
        getInfo()
    }, [id])
    // 获取新闻信息
    const getInfo = async () => {
        const res = await getData(`news?id=${id}&_expand=category`)
        console.log('res.data', res.data[0])
        setNewsInfo(res.data[0])
    }

    return (
        <div>
            <ArrowLeftOutlined style={{ marginBottom: "20px", cursor: "pointer" }} onClick={() => navigate(-1)} />
            <Descriptions title={newsInfo.title}>
                <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                <Descriptions.Item label="发布时间">{moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss") ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                <Descriptions.Item label="审核状态">
                    <span style={{ color: 'red' }}>{auditList[newsInfo.auditState]}</span>
                </Descriptions.Item>
                <Descriptions.Item label="发布状态">
                    <span style={{ color: 'red' }}>{publishList[newsInfo.publishState]}</span>
                </Descriptions.Item>
                <Descriptions.Item label="访问数量">
                    <span style={{ color: '#31b131' }}>{newsInfo.view}</span>
                </Descriptions.Item>
                <Descriptions.Item label="点赞数量">
                    <span style={{ color: '#31b131' }}>{newsInfo.star}</span>
                </Descriptions.Item>
                <Descriptions.Item label="评论数量">
                    <span style={{ color: '#31b131' }}>{newsInfo.star}</span>
                </Descriptions.Item>
                <Descriptions.Item label="类别">
                    {newsInfo.category?.title}
                </Descriptions.Item>
            </Descriptions>
            <div style={{ border: '1px solid #f0f0f0', padding: '10px', maxHeight: "540px", overflow: "auto" }}
                dangerouslySetInnerHTML={{ __html: newsInfo.content }}>
            </div>
        </div>
    )
}
