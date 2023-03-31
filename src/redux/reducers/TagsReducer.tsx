export const TagsReducer = (prevState = {
    tagsList: [
        {
            name: "首页",
            url: "/home",
            isClose: false
        }
    ]
}, action: any) => {
    let { type, payload } = action
    switch (type) {
        case "change_tags":
            let newState = { ...prevState }
            newState.tagsList = payload
            return newState
        default:
            return prevState
    }
}