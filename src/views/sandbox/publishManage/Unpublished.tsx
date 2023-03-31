import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';


export default function Unpublished() {

    const { list, handlePublish } = usePublish(1)

    return (
        <div>
            <NewsPublish list={list} button={(id: number) => <Button type="primary"
                onClick={() => handlePublish(id)}>
                发布
            </Button>}></NewsPublish>
        </div>
    )
}
