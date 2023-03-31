import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import moment from 'moment'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeftOutlined,
    HeartOutlined
} from '@ant-design/icons';
import { getData, patchData } from '../../api';

export default function Detail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [newsInfo, setNewsInfo] = useState<any>([])
    useEffect(() => {
        getInfo()
    }, [id])
    // 获取新闻信息
    const getInfo = async () => {
        const res = await getData(`news?id=${id}&_expand=category`)
        setNewsInfo(res.data[0])
        addViews(res.data[0].view)
    }
    // 增加观看数
    const addViews = async (num: number) => {
        await patchData(`news/${id}`, {
            view: num + 1
        })
    }
    // 处理收藏
    const handleStar = async () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        await patchData(`news/${id}`, {
            star: newsInfo.star + 1
        })
    }

    return (
        <div style={{ padding: 15, boxSizing: 'border-box' }}>
            <ArrowLeftOutlined style={{ marginBottom: "20px", cursor: "pointer" }} onClick={() => navigate(-1)} />
            <Descriptions title={
                <div
                    style={{ cursor: 'pointer' }}>
                    <span style={{ marginRight: 20 }}>
                        {newsInfo.title}</span>
                    <HeartOutlined onClick={handleStar} />
                </div>}>
                <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                <Descriptions.Item label="发布时间">{moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss") ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
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
            <div style={{ border: '1px solid #f0f0f0', padding: '10px' }}
                dangerouslySetInnerHTML={{ __html: newsInfo.content }}>
            </div>
        </div>
    )
}
