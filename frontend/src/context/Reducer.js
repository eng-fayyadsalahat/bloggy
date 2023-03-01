const Reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
                isLogin: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false,
                isLogin: true,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: true,
                isLogin: false,
            };
        case "UPDATE_START":
            return {
                ...state,
                isFetching: true,
                isLogin: true,
            };
        case "UPDATE_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false,
                isLogin: true,
            };
        case "UPDATE_FAILURE":
            return {
                user: state.user,
                isFetching: false,
                error: true,
                isLogin: true,
            };
        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: false,
                isLogin: false,
            };
        default:
            return state;
    }
};

export default Reducer;