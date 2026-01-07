import React from 'react'
import {
    DEFAULT_RETURN
} from './LoginTypes';
import { initRequest } from './LoginAction';
import rsapi from '../rsapi';

export function editCalenderProperties(param) {
    return function (dispatch) {

        dispatch(initRequest(true));

        dispatch({
            type: DEFAULT_RETURN, payload: {
                selectedRecord: param.editRow, loading: false,
                selectedId: param.editRow.ncalendersettingcode,openModal:true,
                operation:"update"
            }
        });

    }
}
