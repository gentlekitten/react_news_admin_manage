import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router';
import {
  ContactsFilled,
  PlusCircleFilled,
  FileFilled,
  BankFilled,
  LockFilled,
  DatabaseFilled,
} from '@ant-design/icons';

import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { connect } from 'react-redux';

import { getData } from '../../api/index';

import './index.css'
import imgUrl from "../../assets/image/logo.png"

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const iconList: any = {
  "/home": <BankFilled />,
  "/user-manage": <ContactsFilled />,
  "/right-manage": <DatabaseFilled />,
  "/news-manage": <FileFilled />,
  "/audit-manage": <LockFilled />,
  "/publish-manage": <PlusCircleFilled />,
}

const routeList: any = {
  "/user-manage/list": "用户列表",
  "/right-manage/role/list": "角色列表",
  "/right-manage/right/list": "权限列表",
  "/news-manage/add": "撰写新闻",
  "/news-manage/draft": "草稿箱",
  "/news-manage/category": "新闻分类",
  "/audit-manage/audit": "审核新闻",
  "/audit-manage/list": "审核列表",
  "/publish-manage/unpublished": "待发布",
  "/publish-manage/published": "已发布",
  "/publish-manage/sunset": "已下线",
}



function SideMent(props: any) {

  const [menu, setMenu] = useState<MenuItem[]>([])
  const navigate = useNavigate()
  const location = useLocation();

  const { role: { rights } } = JSON.parse(localStorage.getItem('token') as any)

  useEffect(() => {
    getData('rights?_embed=children').then((res) => {
      setMenu(getMenuList(res.data))
    })
  }, [])

  // 过滤路由
  const getMenuList = (data: MenuItem[]): MenuItem[] => {
    const items: MenuItem[] = []
    data.forEach((item: any) => {
      let children: MenuItem[] = []
      item.children.forEach((c: any) => {
        if (c.pagepermisson) children.push(getItem(c.title, c.key))
      })
      if (item.pagepermisson && rights.includes(item.key)) {
        item.children.length > 0 ?
          items.push(getItem(item.title, item.key, iconList[item.key], children)) :
          items.push(getItem(item.title, item.key, iconList[item.key]))
      }
    })
    console.log('items', items)
    return items
  }

  const clickSider: MenuProps['onClick'] = (e) => {
    console.log('e', routeList[e.key])
    addTags(e.key)
    navigate(e.key)
  };
  // 点击路由添加tag标签
  const addTags = (url: string) => {
    if (!routeList[url]) return
    let list = [...props.tagsList]
    let isExist = false
    list.forEach((item: any) => {
      if (item.url === url) isExist = true
    })
    if (!isExist) list.push({
      name: routeList[url],
      url,
      isClose: true
    })
    props.changeTags(list)
  }

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div className="logo">
        {props.isCollapsed ? <img src={imgUrl} /> : '新闻发布系统'}
      </div>
      <Menu
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
        mode="inline"
        theme="dark"
        items={menu}
        onClick={clickSider}
      />
    </Sider>
  )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed }, TagsReducer: { tagsList } }: any) => {
  return {
    isCollapsed,
    tagsList
  }
}
const mapDispatchToProps = {
  changeTags(payload: any) {
    return {
      type: "change_tags",
      payload
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SideMent)