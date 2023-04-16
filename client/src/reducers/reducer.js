const initState = {
    previousUploaded: {},
    uploadingLoading: false
}

export const reducer = (state=initState, action={}) => {
    switch (action.type){
        case "ISLOADING":
            if (state.uploadingLoading === false){
                return {...state, uploadingLoading: true}
            } else {
                return {...state, uploadingLoading: false}
            }
        default:
            return {...state}
    }
}