import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';


export default function Sunset() {

    const { list, handleDelete } = usePublish(3)

    return (
        <div>
            <NewsPublish list={list} button={(id: number) => <Button type="primary"
                onClick={() => handleDelete(id)}>
                删除
            </Button>}></NewsPublish>
        </div>
    )
}
