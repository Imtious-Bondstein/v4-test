// /hooks/useRedux.js

import { useSelector } from 'react-redux';
// import store from '../store';

const useRedux = () => {
    // return useSelector(selector, store.getState());
    return useSelector((state) => state.reducer.auth.token);;
};

export default useRedux;
