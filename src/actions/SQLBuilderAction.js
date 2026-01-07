import rsapi from '../rsapi';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import {
    constructOptionList,
    sortData
} from '../components/CommonScript' //getComboLabelValue,, searchData
import {
    toast
} from 'react-toastify';
import Axios from 'axios';
import {
    initRequest
} from './LoginAction';
import {
    intl
} from '../components/App';
import {
    ColumnType,
    queryTypeFilter
} from '../components/Enumeration';
import { format } from 'date-fns';



export function getSQLQueryDetail(sqlQuery, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("sqlquery/getSQLQuery", {
            nsqlquerycode: sqlQuery.nsqlquerycode,
            "userinfo": userInfo
        })
            .then(response => {

                masterData = {
                    ...masterData,
                    ...response.data
                };
                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        queryResult: [],
                        queryList: [],
                        param: [],
                        Dparam: [],
                        TBLName: []
                    }
                });

            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {

                    toast.warn(intl.formatMessage({
                        id: error.response
                    }));
                }

            })
    }
}

export function getSQLQueryComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, queryTypeCode, ncontrolCode) {
    return function (dispatch) {

        if (operation === "create" || operation === "update") {

            let selectedRecord = {};
            const chartService = rsapi().post("sqlquery/getChartType", {
                userinfo: userInfo
            });
            const tableService = rsapi().post("sqlquery/getTablesFromSchema", {
                "tabletypecode": -1,
                "moduleformcode": 0,
                userinfo: userInfo
            });
            const tableType = rsapi().post("sqlquery/getQueryTableType", {
                userinfo: userInfo
            });
            let urlArray = [];
            if (operation === "create") {

                urlArray = [chartService, tableService, tableType];
            } else {
                const queryById = rsapi().post("sqlquery/getActiveSQLQueryById", {
                    [primaryKeyName]: primaryKeyValue,
                    "userinfo": userInfo
                });

                urlArray = [chartService, tableService, tableType, queryById];
            }

            if (queryTypeCode === queryTypeFilter.LIMSDASHBOARDQUERY) {
                screenName = intl.formatMessage({
                    id: "IDS_LIMSDASHBOARDQUERY"
                });
            } else if (queryTypeCode === queryTypeFilter.LIMSALERTQUERY) {
                screenName = intl.formatMessage({
                    id: "IDS_LIMSALERTQUERY"
                });
            } else if (queryTypeCode === queryTypeFilter.LIMSBARCODEQUERY) {
                screenName = intl.formatMessage({
                    id: "IDS_LIMSBARCODEQUERY"
                });
            } else if (queryTypeCode === queryTypeFilter.LIMSGENERALQUERY) {
                screenName = intl.formatMessage({
                    id: "IDS_LIMSGENERALQUERY"
                });
            } else {
                screenName = intl.formatMessage({
                    id: "IDS_LIMSFILTERQUERY"
                });
            }

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    let chart = [];
                    if (operation === "update") {
                        selectedRecord = response[3].data;
                        chart.push({
                            "value": response[3].data["ncharttypecode"],
                            "label": response[3].data["schartname"]
                        });
                        selectedRecord["ncharttypecode"] = chart[0];
                    }

                    let tableName = undefined;
                    let tableNameOnly = [];
                    Object.values(response[1].data[0]).forEach(p => {
                        if (p.stable !== tableName) {
                            tableName = p.stable;
                            tableNameOnly.push({
                                tableName, stabledisplayname: p.stabledisplayname
                            });
                        }
                    })
                   // console.log("tableNameOnly",tableNameOnly);

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            chartList: response[0].data || [],
                            tableList: response[1].data[0] || [],
                            tableType: response[2].data || [],
                            //tableName: tableNameOnly,
                            tableName: sortData(tableNameOnly || [], "ascending" , "stabledisplayname") ,
                            operation,
                            screenName,
                            selectedRecord,
                            openModal: true,
                            openPortalModal: false,
                            ncontrolCode,
                            loading: false,
                            showExecute: true,
                            showParam: false,
                            showValidate: true,
                            showQueryTool: true,
                            showSave: false,
                            slideResult: [],
                            slideList: [],
                            resultStatus: '',
                            param: [],
                            Dparam: [],
                            TBLName: [],
                            parentPopUpSize: "xl"
                        }
                    });
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        }
                    })
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                        toast.error(intl.formatMessage({
                            id: error.message
                        }));
                    } else {

                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })



        }
        // else {
        // }
    }
}

export function getTablesName(TableTypeCode, FormCode, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("sqlquery/getTablesFromSchema", {
            //"tabletypecode": parseInt(selectedRecord["ntabletypecode"].value),"moduleformcode": parseInt(selectedRecord["nformcode"] ? selectedRecord["nformcode"].value: 0)
            "tabletypecode": parseInt(TableTypeCode),
            "moduleformcode": parseInt(FormCode), userinfo: userInfo

        })
            .then(response => {

                let tableName = undefined;
                let tableNameOnly = [];
                Object.values(response.data[0]).forEach(p => {
                    if (p.stable !== tableName) {
                        tableName = p.stable;
                        tableNameOnly.push({
                            tableName, stabledisplayname: p.stabledisplayname
                        });
                    }
                })

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        tableList: response.data[0] || [],
                        //tableName: tableNameOnly || [],
                        tableName: sortData(tableNameOnly || [], "ascending" , "stabledisplayname") ,
                        loading: false
                    }
                });

            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {

                    toast.warn(intl.formatMessage({
                        id: error.response
                    }));
                }

            })
    }
}

export function getModuleFormName(TableTypeCode, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("sqlquery/getModuleFormName", {
            "tabletypecode": parseInt(TableTypeCode),
            "userinfo": userInfo

        })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        moduleFormName: response.data[0] || [],
                        loading: false
                    }
                });

            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {

                    toast.warn(intl.formatMessage({
                        id: error.response
                    }));
                }

            })
    }
}


export function executeUserQuery(inputParam) {
    return function (dispatch) {
        const Query = inputParam.query;
        const screenFlag = inputParam.screenFlag;
        const slideOperation = inputParam.slideOperation;
        const userInfo = inputParam.userInfo;
        const screenName = inputParam.screenName
        const data = inputParam.data;

        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getSchemaQueryOutput", {
            "query": Query,
            userinfo: userInfo,
            "returnoption": "LIST"
        })
            .then(response => {
                const querycol = response.data[1];
                let keyarray = [];
                let temparray = [];
                let validColumns = true;
                if (querycol.length > 0) {
                    keyarray = Object.keys(querycol[0]);
                    let width = "200px"
                    if (keyarray.length === 2) {
                        width = "300px"
                    }
                    for (let i = 0; i < keyarray.length; i++) {
                        if (keyarray[i] !== null && keyarray[i] !== '') {
                            temparray.push({
                                "idsName": keyarray[i],
                                "dataField": keyarray[i],
                                "width": width
                            });
                        } else {
                            validColumns = false;
                        }
                    }
                }
                let respObject = {
                    loading: false,
                    slideResult: response.data[1] || [],
                    slideList: temparray || [],
                    resultStatus: response.data[0] || '',
                    openModal: true,
                    showParam: true,
                    screenFlag
                }

                if (screenFlag === "showQuery") {
                    if (screenName === "Results") {
                        respObject = {
                            ...respObject,
                            showExecute: false,
                            operation: "view",
                            screenName: screenName,
                            ...data
                        }
                    } else {
                        respObject = {
                            ...respObject,
                            showExecute: true,
                            operation: slideOperation,
                        }
                    }
                } else {
                    if (screenFlag === "NoParam") {
                        respObject = {
                            ...respObject,
                            screenName: "Results",
                            operation: "view",
                            queryResult: response.data[1] || [],
                            queryList: temparray || [],
                            showExecute: inputParam.showExecute,
                            showValidate: inputParam.showValidate,
                            showQueryTool: inputParam.showValidate,
                            showSave: inputParam.showSave,
                            noSave: inputParam.noSave,
                        }
                    } else {
                        respObject = {
                            ...respObject,
                            queryResult: response.data[1] || [],
                            showExecute: true,
                            showValidate: false,
                            showQueryTool: false,
                            operation: "create",
                            screenName: "Parameter for Results",
                            queryList: temparray || [],
                        }
                    }
                }
                if (validColumns) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ...respObject
                        }
                    });
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        }
                    });
                    toast.warn(intl.formatMessage({
                        id: "IDS_MAKESUREALLFIELDSHAVENAMEORALIASNAME"
                    }))
                }

            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });

                //toast.error(intl.formatMessage({ id: error.message }));
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function executeAlertUserQuery(Query, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getSchemaQueryOutput", {
            "query": Query,
            userinfo: userInfo
        })
            .then(response => {


                const resultCount = response.data[1];



                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        resultCount: resultCount
                    }
                });

            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                  dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                                payload: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    responseStatus: error.response.status
                                }
                    
                  });
                } else if (error.response.status === 500) {
                            toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}



export function comboChangeQueryType(querytypecode, data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getSQLQueryByQueryTypeCode", {
            nquerytypecode: querytypecode,
            "userinfo": userInfo
        })
            .then(response => {

                const masterData = {
                    ...data,
                    ...response.data,
                    searchedData: undefined
                }

                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        queryList: []
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                  dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                                payload: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    responseStatus: error.response.status
                                }
                    
                  });
                } else if (error.response.status === 500) {
                            toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getColumnNamesByTableName(tableName, columnList) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getColumnsFromTable", {
            "tablename": tableName
        })
            .then(response => {

                columnList = columnList || new Map();
                columnList.set(Object.keys(response.data)[0], Object.values(response.data)[0]);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        columnList,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                  dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                                payload: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    responseStatus: error.response.status
                                }
                    
                  });
                } else if (error.response.status === 500) {
                            toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function comboColumnValues(tableName, fieldName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getColumnValues", {
            "tablename": tableName,
            "fieldname": fieldName
        })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        fieldResult: response.data[1] || [],
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                  dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                                payload: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    responseStatus: error.response.status
                                }
                    
                  });
                } else if (error.response.status === 500) {
                            toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}


export function getDatabaseTables(userInfo, sqlQuery, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let url = "";
        if (sqlQuery) {
            url = "/sqlquery/getdatabasetables";
        } else {
            url = "/sqlquery/getdatabaseviews";
        }
        rsapi().post(url, {
            userinfo: userInfo
        })
            .then(response => {
                if (sqlQuery) {
                    const tableListMap = constructOptionList(response.data["databaseTableList"] || [], "stablename", "sdisplayname", false, false, false);
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            databaseTableList: tableListMap.get("OptionList"),
                            openPortalModal: true,
                            screenName: "IDS_QUERYBUILDER",
                            sqlQuery,                            
                            ...inputParam
                        }
                    });
                } else {
                    const viewListMap = constructOptionList(response.data["databaseviewList"] || [], "sviewname", "sdisplayname", false, false, false);
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            databaseviewList: viewListMap.get("OptionList"),
                            openPortalModal: true,
                            screenName: "IDS_QUERYBUILDER",
                            sqlQuery,
                            queryData: [],
                            gridColumnList: [],
                            ...inputParam
                        }
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function executeQuery(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/executequery", {
            ...inputParam
        })
            .then(response => {

                const queryData = response.data;
                let gridColumnList = [];
                if (queryData.length > 0) {
                    // inputParam.columnList.forEach(item => {
                    inputParam.selectFields.forEach(item => {
                        gridColumnList.push({ idsName:item.items ? item.items.displayname[inputParam.userInfo.slanguagetypecode] :item.item.items.displayname[inputParam.userInfo.slanguagetypecode], dataField:item.items? item.items.columnname :item.item.items.columnname, width: '200px' })
                    })
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        queryData,
                        gridColumnList,
                        loading: false,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            sstatus: "SUCCESS"
                        }
                        // ,
                        // resultStatus: "Success",
                        // screenName: "Results",
                        // openModal: true
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function executeQueryForQueryBuilder(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/executequery", {
            ...inputParam
        })
            .then(response => {

                const queryData = response.data;
                let gridColumnList = [];
                if (queryData.length > 0) {
                    // inputParam.columnList.forEach(item => {
                    inputParam.selectFields.forEach(item => {
                        gridColumnList.push({ idsName:item.items? item.items.displayname[inputParam.userInfo.slanguagetypecode] :item.item.items.displayname[inputParam.userInfo.slanguagetypecode] , dataField: item.items? item.items.columnname :item.item.items.columnname, width: '200px' })
                    })
                }else{
                    toast.warn(intl.formatMessage({
                        id: "IDS_NODATAFOUND"
                    }));
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        queryData,
                        gridColumnList,
                        loading: false,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            sstatus: "SUCCESS"
                        }
                        // ,
                        // resultStatus: "Success",
                        // screenName: "Results",
                        // openModal: true
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getForeignTable(inputParam, type) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getforeigntable", {
            ...inputParam
        })
            .then(response => {
                const userInfo = inputParam.userinfo;
                const foreignTableList = response.data["foreignTableList"];

                const jstaticcolumns = foreignTableList[0] ? (foreignTableList[0].jstaticcolumns || []) : [];
                const jdynamiccolumns = foreignTableList[0] ? (foreignTableList[0].jdynamiccolumns || []) : [];
                const jmultilingualcolumn = foreignTableList[0] ? (foreignTableList[0].jmultilingualcolumn || []) : [];
                const jnumericcolumns = foreignTableList[0] ? (foreignTableList[0].jnumericcolumns || []) : [];
                const sprimarykeyname = foreignTableList[0] ? foreignTableList[0].sprimarykeyname : "";
                const stablename = foreignTableList[0] ? foreignTableList[0].stablename : "";

                let defaultColumn = {};
                let comboData = []
                jstaticcolumns.map(items => {
                    comboData.push({
                        label: items.displayname[userInfo.slanguagetypecode],
                        value: items.columnname,
                        items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.STATICCOLUMN }
                    })
                    if (items.default) {
                        defaultColumn = {
                            label: items.displayname[userInfo.slanguagetypecode],
                            value: items.columnname,
                            items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.STATICCOLUMN }
                        }
                    }
                });
                jdynamiccolumns.map(items => {
                    comboData.push({
                        label: items.displayname[userInfo.slanguagetypecode],
                        value: items.columnname,
                        items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.DYNAMICCOLUMN }
                    })
                    if (items.default) {
                        defaultColumn = {
                            label: items.displayname[userInfo.slanguagetypecode],
                            value: items.columnname,
                            items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.DYNAMICCOLUMN }
                        }
                    }
                });
                jmultilingualcolumn.map(items => {
                    comboData.push({
                        label: items.displayname[userInfo.slanguagetypecode],
                        value: items.columnname,
                        items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.MULTILINGUALCOLUMN }
                    })
                    if (items.default) {
                        defaultColumn = {
                            label: items.displayname[userInfo.slanguagetypecode],
                            value: items.columnname,
                            items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.MULTILINGUALCOLUMN }
                        }
                    }
                });
                jnumericcolumns.map(items => {
                    comboData.push({
                        label: items.displayname[userInfo.slanguagetypecode],
                        value: items.foriegntablePK,
                        items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.NUMERICCOLUMN }
                    })
                    if (items.default) {
                        defaultColumn = {
                            label: items.displayname[userInfo.slanguagetypecode],
                            value: items.foriegntablePK,
                            items: { ...items, stablename, sprimarykeyname, columntype: ColumnType.NUMERICCOLUMN }
                        }
                    }
                });

                let tableColumnList = [];
                let tempdata = {};
                if (type === "column") {
                    tableColumnList = inputParam.foreignTableColumnList || [];
                    tableColumnList[inputParam.index] = comboData
                    tempdata = { foreignTableColumnList: tableColumnList };
                } else {
                    tableColumnList = inputParam.tableColumnList || [];
                    tableColumnList[inputParam.index] = comboData;
                    tempdata = { tableColumnList };
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        ...tempdata,
                        selectedRecord: inputParam.selectedRecord
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getViewColumns(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getdatabaseviewscolumns", {
            sviewname: inputParam.sviewname,
            userinfo: inputParam.userinfo
        })
            .then(response => {

                const userInfo = inputParam.userinfo;
                let languageCode = userInfo.slanguagetypecode ? userInfo.slanguagetypecode : "en-US";
                const responseData = response.data["viewColumnList"] || [];
                const jsonData = responseData[0] ? responseData[0].jsondata : [];
                let defaultColumn = {};
                let comboData = []
                let selectFields = [];
                
                jsonData["conditionfields"].map(items => {
                    comboData.push({
                        label: items.displayname[languageCode],
                        value: items.columnname,
                        items
                    })
                    if (items.default) {
                        defaultColumn = {
                            label: items.displayname[languageCode],
                            value: items.columnname,
                            items
                        }
                    }
                });
                jsonData["selectfields"].map(items => {
                    selectFields.push({
                        label: items.displayname[languageCode],
                        value: items.columnname,
                        items
                    })
                });
              

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        viewColumnList: comboData,
                        viewColumnListByRule :comboData,
                        selectFields,
                        selectedRecord: {...inputParam.selectedRecord,
                            filtercolumns:selectFields,
                            groupList:[]
                    }
                }
            });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}


export function getMasterData(inputParam, viewMasterListByRule) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/sqlquery/getmasterdata", {
            ...inputParam
        })
            .then(response => {

                // const optionId = inputParam.data.sforeigncolumnname;
                const tableListMap = constructOptionList(response.data["masterdata"] || [], inputParam.optionId, "sdisplayname", false, false, false);

                let tempData = {};
                // if(inputParam.data.nflag === 1) {
                //     let masterdata = [];
                //     masterdata[inputParam.index] = tableListMap.get("OptionList");
                //     tempData = { masterdata };
                // } else {
                // let viewMasterListByRule = [];
                // viewMasterListByRule[inputParam.index] = tableListMap.get("OptionList");
                if (viewMasterListByRule === undefined) {
                    viewMasterListByRule = [];
                    viewMasterListByRule[inputParam.groupIndex] = [];
                } else {
                    viewMasterListByRule = { ...viewMasterListByRule };
                }
                if (viewMasterListByRule[inputParam.groupIndex]) {

                } else {
                    viewMasterListByRule[inputParam.groupIndex] = [];
                }
                viewMasterListByRule[inputParam.groupIndex][inputParam.index] = [];
                viewMasterListByRule[inputParam.groupIndex][inputParam.index] = tableListMap.get("OptionList");
                tempData = { viewMasterListByRule };
                // }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord: inputParam.selectedRecord,
                        ...tempData
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}


export function createQueryBuilder(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/querybuilder/updateQueryBuilder", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        loading: false,
                        openModal: false

                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getParameterFromQuery(inputParam) {
    return function (dispatch) {
        let urlArray = [];
        let dataIndex = [];

        const comboData = JSON.parse(inputParam.masterData.selectedQueryBuilder.sdefaultvalue.value);
        if(comboData["sdefaultvalue"].length>0){
        comboData.sdefaultvalue.forEach((dataItem, index) => {
            const tableData = dataItem.items;
            const mastertablename = tableData.mastertablename;
            if (dataItem.items.needmasterdata && mastertablename) {
                const inputParamService = {
                    userinfo: inputParam.userInfo,
                    data: {
                        nflag: 2,
                        mastertablename,
                        valuemember: tableData.valuemember,
                        displaymember: tableData.displaymember,
                    }
                };
                urlArray.push(rsapi().post("/sqlquery/getmasterdata", {
                    ...inputParamService
                }))
                dataIndex.push(index);

            } else if (dataItem.items && dataItem.items.sforeigncolumnname !== undefined &&
                dataItem.items.sforeigncolumnname !== "") {
                const inputParamService = {
                    data: { ...dataItem.items, nflag: 1 },
                    userinfo: inputParam.userInfo
                };
                urlArray.push(rsapi().post("/sqlquery/getmasterdata", {
                    ...inputParamService
                }))
                dataIndex.push(index);

            }

            if (dataItem.items.columntype === ColumnType.DATATIME
                || dataItem.items.columntype === ColumnType.DATE && dataItem.symbolObject.items.isInputVisible === true
                && (dataItem.symbolObject.items.symbolType === 5 || dataItem.symbolObject.items.symbolType === 1)) {

                dataItem.value = new Date(dataItem.value);
            }

        })


        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {
                let viewMasterData = [];
                if (response !== null && response.length > 0) {
                    response.forEach((item, ind) => {

                        let valueMember = "";
                        if (comboData.sdefaultvalue[dataIndex[ind]].items && comboData.sdefaultvalue[dataIndex[ind]].items.sforeigncolumnname !== undefined &&
                            comboData.sdefaultvalue[dataIndex[ind]].items.sforeigncolumnname !== "") {

                            valueMember = comboData.sdefaultvalue[dataIndex[ind]].items.sforeigncolumnname;
                        } else {
                            valueMember = comboData.sdefaultvalue[dataIndex[ind]].items.valuemember;
                        }
                        const tableListMap = constructOptionList(item.data["masterdata"] || [], valueMember, "sdisplayname", false, false, false);
                        viewMasterData[dataIndex[ind]] = tableListMap.get("OptionList");
                    })

                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        viewMasterData,
                        loading: false,
                        openModal: true,
                        comboData

                    }
                });
            }))
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }

    else{
        toast.warn(intl.formatMessage({
            id: "No Parameter Available"
        }));

    }
}
    
}

export function getSelectedQueryBuilder(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/querybuilder/getSelectedQueryBuilder",
            { 'userinfo': userInfo, "nquerybuildercode": inputParam.nquerybuildercode })
            .then(response => {

                masterData = {
                    ...masterData, selectedQueryBuilder: response.data["selectedQueryBuilder"],
                    queryDataMain: response.data["queryDataMain"], columnList: response.data["columnList"], queryTypeCode: inputParam.nquerytype,
                    selectFields: response.data["selectFields"]
                };
                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false

                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function updateQueryBuilder(inputParam, inputData, masterData) {
    return function (dispatch) {
        let urlArray = [];
        let dataIndex = [];

        dispatch(initRequest(true));

        // urlArray.push(rsapi().post("/querybuilder/updateQueryBuilder", {
        //     ...inputData
        // }))
        urlArray.push(rsapi().post("/sqlquery/executequery", {
            ...inputParam
        }))



        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                masterData = { ...masterData, queryDataMain: response[0].data };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        openModal: false,
                        masterData
                    }
                });
            }))
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

// export function getQueryBuilder(nqueryTypeCode, userInfo, masterData) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         rsapi().post("/querybuilder/getQueryBuilder",
//             { 'userinfo': userInfo, "nqueryTypeCode": nqueryTypeCode })
//             .then(response => {

//                 masterData = {
//                     ...response.data
//                 };
//                 sortData(masterData);

//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         masterData,
//                         loading: false

//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false
//                     }
//                 })
//                 if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//          dispatch({
//            type: UN_AUTHORIZED_ACCESS,
//                        payload: {
//                            navigation: 'forbiddenaccess',
//                            loading: false,
//                            responseStatus: error.response.status
//                        }
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response.data);
//                 }
//             });
//     }
// }