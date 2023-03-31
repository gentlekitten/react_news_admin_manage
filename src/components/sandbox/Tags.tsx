import { Tag, Space } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

function Tags(props: any) {
    // 处理删除tag
    const tagsClose = (url: string) => {
        let list = [...props.tagsList]
        list = list.filter((item: any) => item.url !== url)
        props.changeTags(list)
    }

    return (
        <div style={{ height: 30, width: '100%', backgroundColor: '#fff', padding: 5 }}>
            <Space size={[0, 8]} wrap>
                {
                    props.tagsList.map((item: any) => (

                        <Tag style={{ cursor: 'pointer' }} key={item.url} color="green" onClose={() => tagsClose(item.url)} closable={item.isClose}>
                            <NavLink key={item.url} to={item.url}>
                                <span style={{ color: 'green' }}>{item.name}</span>
                            </NavLink>
                        </Tag>
                    ))
                }
            </Space>
        </div>
    )
}

const mapStateToProps = ({ TagsReducer: { tagsList } }: any) => {
    return {
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
export default connect(mapStateToProps, mapDispatchToProps)(Tags)
