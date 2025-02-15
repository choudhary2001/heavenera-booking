import { combineReducers } from 'redux';
import authReducer from 'actions/authReducer';

const rootReducer = combineReducers({
    auth: authReducer,
});

export default rootReducer;