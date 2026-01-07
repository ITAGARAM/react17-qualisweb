import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { sortData, constructOptionList, rearrangeDateFormat } from '../components/CommonScript';
import { chartType, designComponents } from '../components/Enumeration';


export function fetchRecordDashBoardType(fetchRecordParam) {
    return function (dispatch) {

        const chartTypeURL = rsapi().post("dashboardtypes/getChartTypes", { "userinfo": fetchRecordParam.userInfo });
        let selectedRecord = {};
        let urlArray = [];
        let selectedId = null;
        if (fetchRecordParam.operation === "update") {

            const dashBoardType = rsapi().post("dashboardtypes/getDashBoardTypeByID", { "userinfo": fetchRecordParam.userInfo, "ndashboardtypecode": parseInt(fetchRecordParam.masterData.selectedDashBoardTypes.ndashboardtypecode) });
            const sqlQuery = rsapi().post("dashboardtypes/getSqlQueriesByChart", { "userinfo": fetchRecordParam.userInfo, "ncharttypecode": parseInt(fetchRecordParam.masterData.selectedDashBoardTypes.ncharttypecode) });
            const chartProps = rsapi().post("dashboardtypes/getChartProperty", { "userinfo": fetchRecordParam.userInfo, "ncharttypecode": parseInt(fetchRecordParam.masterData.selectedDashBoardTypes.ncharttypecode) });
            // const sqlCols = rsapi().post("dashboardtypes/getColumnsBasedOnQuery", { "userinfo": fetchRecordParam.userInfo, "nsqlquerycode": parseInt(fetchRecordParam.masterData.selectedDashBoardTypes.nquerycode) });
            const chartPropTransaction = rsapi().post("dashboardtypes/getChartPropTransaction", {
                "userinfo": fetchRecordParam.userInfo, "ncharttypecode": parseInt(fetchRecordParam.masterData.selectedDashBoardTypes.ncharttypecode),
                "ndashboardtypecode": parseInt(fetchRecordParam.masterData.selectedDashBoardTypes.ndashboardtypecode),
                "nsqlquerycode": parseInt(fetchRecordParam.masterData.selectedDashBoardTypes.nsqlquerycode)
            });

            urlArray = [chartTypeURL, sqlQuery, dashBoardType, chartProps, chartPropTransaction];
            selectedId = fetchRecordParam.masterData.selectedDashBoardTypes.ndashboardtypecode;
        }
        else {

            urlArray = [chartTypeURL];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {


                let xValue = [];
                let yValue = [];
                let xSeriesColumns = [];
                let ySeriesColumns = [];
                let sqlQueryList = [];
                let xSeriesColumnList = [];
                let ySeriesColumnList = [];
                let sizeField = [];
                let yFieldBubble = [];
                let categoryField = [];

                const chartTypeMap = constructOptionList(response[0].data || [], "ncharttypecode",
                    "schartname", undefined, undefined, true);

                const chartTypeList = chartTypeMap.get("OptionList");

                if (fetchRecordParam.operation === "update") {

                    const sqlQueryMap = constructOptionList(response[1].data || [], "nsqlquerycode",
                        "ssqlqueryname", undefined, undefined, true);

                    sqlQueryList = sqlQueryMap.get("OptionList");

                    const xSeriesColumnMap = constructOptionList(response[4].data.Columns.xSeriesColumns || [], "Value",
                        "ColumnName", undefined, undefined, true);
                    xSeriesColumnList = xSeriesColumnMap.get("OptionList");

                    const ySeriesColumnMap = constructOptionList(response[4].data.Columns.ySeriesColumns || [], "Value",
                        "ColumnName", undefined, undefined, true);
                    ySeriesColumnList = ySeriesColumnMap.get("OptionList");

                    selectedRecord = response[2].data;

                    selectedRecord["ncharttypecode"] = {
                        label: response[2].data["schartname"],
                        value: response[2].data["ncharttypecode"]
                    };
                    selectedRecord["nsqlquerycode"] = {
                        label: response[2].data["ssqlqueryname"],
                        value: response[2].data["nsqlquerycode"]
                    };
                    // let index = 0;
                    if (response[2].data["ncharttypecode"].value === chartType.PIECHART ||
                        response[2].data["ncharttypecode"].value === chartType.DONUT) {

                        selectedRecord["field"] = {
                            label: response[4].data.pieCategoryColumn,
                            value: response[4].data.pieCategoryColumnComboVal,
                            item: {
                                Value: response[4].data.pieCategoryColumnComboVal,
                                ColumnName: response[4].data.pieCategoryColumn,
                                Color: ""
                            }
                        }

                        selectedRecord["nameField"] = {
                            label: response[4].data.pieValueColumn,
                            value: response[4].data.pieValueColumnComboVal,
                            item: {
                                Value: response[4].data.pieValueColumnComboVal,
                                ColumnName: response[4].data.pieValueColumn,
                                Color: ""
                            }
                        }

                    }
                    else {
                        if (response[2].data["ncharttypecode"].value === chartType.BUBBLE) {
                            selectedRecord["xFieldBubble"] = {
                                label: response[4].data.xFieldBubble[0]["schartpropvalue"],
                                value: response[4].data.xFieldBubble[0]["schartpropvalue"],
                                item: {
                                    Value: response[4].data.xFieldBubble[0]["schartpropvalue"],
                                    ColumnName: response[4].data.xFieldBubble[0]["schartpropvalue"],
                                    Color: ""
                                }
                            }
                            response[4].data.colorField.map((item) =>
                                sizeField.push({
                                    label: item.ColumnName,
                                    value: item.ColumnName,
                                    item: {
                                        Value: item.ColumnName,
                                        ColumnName: item.ColumnName,
                                        Color: item.Color
                                    }
                                })
                            );
                            response[4].data.yFieldBubble.map((item) =>
                                yFieldBubble.push({
                                    label: item.schartpropvalue,
                                    value: item.schartpropvalue,
                                    item: {
                                        Value: item.schartpropvalue,
                                        ColumnName: item.schartpropvalue,
                                        Color: ""
                                    }
                                })
                            );
                            response[4].data.categoryField.map((item) =>
                                categoryField.push({
                                    label: item.schartpropvalue,
                                    value: item.schartpropvalue,
                                    item: {
                                        Value: item.schartpropvalue,
                                        ColumnName: item.schartpropvalue,
                                        Color: ""
                                    }
                                })
                            );
                            selectedRecord["sizeField"] = sizeField;
                            selectedRecord["yFieldBubble"] = yFieldBubble;
                            selectedRecord["categoryField"] = categoryField;

                        } else {
                            // selectedRecord["xColumnName"] = {
                            //     label: response[4].data.xField[0]["schartpropvalue"],
                            //     value: response[4].data.xField[0]["schartpropvalue"],
                            //     item: {
                            //         Value: response[4].data.xField[0]["schartpropvalue"],
                            //         ColumnName: response[4].data.xField[0]["schartpropvalue"],
                            //         Color: ""
                            //     }

                            // }
                            response[4].data.Columns.xSeriesColumns && response[4].data.Columns.xSeriesColumns.map(field => {
                                if (field.Value === response[4].data.xField[0]["schartpropvalue"]) {
                                    selectedRecord["xColumnName"] = {
                                        label: field.ColumnName,
                                        value: response[4].data.xField[0]["schartpropvalue"],
                                        item: {
                                            Value: response[4].data.xField[0]["schartpropvalue"],
                                            ColumnName: field.ColumnName,
                                            Color: ""
                                        }

                                    }
                                }
                            })
                            response[4].data.Colors.map((item) =>
                                yValue.push({
                                    label: item.ColumnName,
                                    value: item.ColumnName,
                                    item: {
                                        Value: item.ColumnName,
                                        ColumnName: item.ColumnName,
                                        Color: item.Color
                                    }
                                })
                            )
                            selectedRecord["yColumnName"] = yValue;
                        }
                    }
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        chartType: chartTypeList,
                        sqlQuery: fetchRecordParam.operation === "update" ? sqlQueryList : [],
                        selectedRecord: selectedRecord,
                        operation: fetchRecordParam.operation,
                        screenName: "IDS_DASHBOARDTYPES",

                        openModal: true, ncontrolCode: fetchRecordParam.ncontrolCode,
                        loading: false, selectedId,
                        ChartProperty: fetchRecordParam.operation === "update" ? response[3].data : [],
                        SqlColumns: fetchRecordParam.operation === "update" ? { xSeriesColumns: xSeriesColumnList, ySeriesColumns: ySeriesColumnList } : [],
                        xValue: xValue, yValue: yValue,
                        Colors: fetchRecordParam.operation === "update" ? response[4].data.Colors : [],
                        xSeriesColumns, ySeriesColumns, xSeriesColumnList, ySeriesColumnList
                    }
                });
            }))

            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function selectCheckBoxDashBoardTypes(DashBoardTypes, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post(//"/dashboardtypes/getAllSelectionDashBoardTypes"
            "/dashboardtypes/getDashBoardTypes"
            , { 'userinfo': userInfo, "ndashboardtypecode": DashBoardTypes.ndashboardtypecode })

            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, screenName: "IDS_DESIGNPARAMETERS" } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getSqlQueryDataService(nchartTypeCode, selectedRecord, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("dashboardtypes/getSqlQueriesByChart", { "userinfo": userInfo, "ncharttypecode": parseInt(nchartTypeCode) })
            .then(response => {

                const sqlQueryMap = constructOptionList(response.data || [], "nsqlquerycode",
                    "ssqlqueryname", undefined, undefined, true);

                const sqlQueryList = sqlQueryMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        sqlQuery: sqlQueryList, ChartProperty: [], selectedRecord, loading: false
                    }
                });

            }).catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getSqlQueryColumns(nSqlQueryCode, nChartTypeCode, userInfo, selectedRecord) {
    return function (dispatch) {

        // let selectedRecord = {};

        const chartProps = rsapi().post("dashboardtypes/getChartProperty", { "userinfo": userInfo, "ncharttypecode": parseInt(nChartTypeCode) });
        const sqlCols = rsapi().post("dashboardtypes/getColumnsBasedOnQuery", { "userinfo": userInfo, "nsqlquerycode": parseInt(nSqlQueryCode) });

        let urlArray = [chartProps, sqlCols];
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                let Value = [];

                selectedRecord = { ...selectedRecord }
                if (nChartTypeCode !== chartType.PIECHART) {
                    selectedRecord["yColumnName"] = undefined;
                    selectedRecord["xColumnName"] = undefined;
                }
                else {
                    selectedRecord["field"] = undefined;
                    selectedRecord["nameField"] = undefined;
                }

                const xSeriesColumnMap = constructOptionList(response[1].data.xSeriesColumns || [], "Value",
                    "ColumnName", undefined, undefined, true);
                const xSeriesColumnList = xSeriesColumnMap.get("OptionList");

                const ySeriesColumnMap = constructOptionList(response[1].data.ySeriesColumns || [], "Value",
                    "ColumnName", undefined, undefined, true);
                const ySeriesColumnList = ySeriesColumnMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ChartProperty: response[0].data, SqlColumns: { xSeriesColumns: xSeriesColumnList, ySeriesColumns: ySeriesColumnList },
                        Value: Value, loading: false,
                        // operation: "create",
                        selectedRecord, xSeriesColumns: [], ySeriesColumns: [], xSeriesColumnList, ySeriesColumnList
                    }
                });

            })).catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getAddDashboardDesign(selectedDashBoardTypes, userInfo) {
    return function (dispatch) {

        let urlArray = [];
        let selectedId = null;

        const designDashBoard = rsapi().post("dashboardtypes/getDashBoardDesign",
            {
                "userinfo": userInfo,
                "ndashBoardTypeCode": parseInt(selectedDashBoardTypes.ndashboardtypecode),
                "nSqlQueryCode": parseInt(selectedDashBoardTypes.nsqlquerycode)
            });

        urlArray = [designDashBoard];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {
                if (response[0].data.sqlQueryForParams.length > 0) {

                    const parameterMap = constructOptionList(response[0].data.sqlQueryForParams || [], "sqlQueryParams",
                        "sqlQueryParams", undefined, undefined, true);

                    const reportParameterList = parameterMap.get("OptionList");

                    const designComponentMap = constructOptionList(response[0].data.designComponents || [], "ndesigncomponentcode",
                        "sdesigncomponentname", undefined, undefined, true);

                    const designComponentList = designComponentMap.get("OptionList");

                    const sqlQueryMap = constructOptionList(response[0].data.sqlQueryForExistingLinkTable || [], "nsqlquerycode",
                        "ssqlqueryname", undefined, undefined, true);

                    const sqlQueryList = sqlQueryMap.get("OptionList");

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {

                            operation: "create",
                            screenName: "IDS_DESIGNPARAMETERS",
                            openChildModal: true,// ncontrolCode: fetchRecordParam.ncontrolCode,
                            loading: false, selectedId,
                            sqlQueryForParams: reportParameterList,
                            sqlQueryForExistingLinkTable: sqlQueryList,
                            designComponents: designComponentList,
                        }
                    });
                }
                else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    toast.warn(intl.formatMessage({ id: "IDS_NOPARAMETERSTOMAPDASHBOARD" }))
                }
            }))

            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getDashboardView(userInfo) {
    return function (dispatch) {

        let urlArray = [];
        let selectedId = null;

        const dashBoardView = rsapi().post("dashboardtypes/getDashBoardView", { "userinfo": userInfo, "ndashBoardTypeCode": 0 });

        urlArray = [dashBoardView];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        operation: "create",
                        screenName: "IDS_DASHBOARDVIEW",
                        openChildModal: true,// ncontrolCode: fetchRecordParam.ncontrolCode,
                        loading: false, selectedId,
                        sqlQueryForParams: response[0].data.sqlQueryForParams,
                        sqlQueryForExistingLinkTable: response[0].data.sqlQueryForExistingLinkTable,
                        designComponents: response[0].data.designComponents,
                    }
                });
            }))

            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function selectCheckBoxDashBoardView(screenName, selectedRecord, masterData, viewDashBoardParam, dashBoardTemplateNo,
    templateCode, homeDashBoard, currentPageNo) {
    return function (dispatch) {
        let homeDashBoardType = {};
        dispatch(initRequest(true));
        rsapi().post("/dashboardview/getChartParameters", { ...viewDashBoardParam })

            .then(response => {

                const selectedRecordRealValue = selectedRecord;
                masterData = { ...masterData, ...response.data };

                let respObject = {};
                if (screenName === "HomeDashBoard") {
                    if (dashBoardTemplateNo === "dashBoardType1") {
                        homeDashBoardType = { "dashBoardType1": { ...response.data }, "ntemplatecode": templateCode };
                    }
                    else if (dashBoardTemplateNo === "dashBoardType2") {
                        homeDashBoardType = { "dashBoardType2": { ...response.data }, "ntemplatecode": templateCode };
                    }
                    else if (dashBoardTemplateNo === "dashBoardType3") {
                        homeDashBoardType = { "dashBoardType3": { ...response.data }, "ntemplatecode": templateCode };
                    }
                    else if (dashBoardTemplateNo === "dashBoardType4") {
                        homeDashBoardType = { "dashBoardType4": { ...response.data }, "ntemplatecode": templateCode };
                    }
                    if (homeDashBoard && homeDashBoard !== undefined) {
                        homeDashBoard[currentPageNo] = { ...homeDashBoard[currentPageNo], ...homeDashBoardType };

                    }
                    respObject = { homeDashBoard };
                }

                if (response.data.chartData.length === 0) {
                    toast.info(intl.formatMessage({ id: "IDS_NODATAAVAILABLE" }));
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecordRealValue,
                        masterData, loading: false,
                        openModal: false,
                        openModalForHomeDashBoard: false,
                        ...respObject
                    }
                });
            })
            .catch(error => {
                // dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openModal: false } })
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openNodal: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getAllSelectionDashBoardView(dashBoardTypes, userInfo, masterData) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("/dashboardview/getAllSelectionDashBoardView", { 'userinfo': userInfo, "ndashboardtypecode": dashBoardTypes.ndashboardtypecode })

            .then(response => {
                dispatch(selectedDashBoardView(response, masterData, userInfo));
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function selectedDashBoardView(response, masterData, userInfo) {
    return function (dispatch) {
        let openModalNew = false;
        let selectedRecord = {};
        let inputFieldData = {};

        if (response.data.viewDashBoardDesignConfigList !== undefined && response.data.viewDashBoardDesignConfigList.length > 0) {
            openModalNew = true;
            response.data.viewDashBoardDesignConfigList.map(item => {

                if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                    selectedRecord[item.sfieldname] = rearrangeDateFormat(userInfo, item.dataList[0]);
                    inputFieldData = {
                        ...inputFieldData,
                        [item.sfieldname]: rearrangeDateFormat(userInfo, item.dataList[0]),
                        [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                        [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                    };
                }
                else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {

                    const comboMap = constructOptionList(item.dataList || [], item.svaluemember,
                        item.sdisplaymember, undefined, undefined, true);

                    const comboList = comboMap.get("OptionList");
                    item.dataList = comboList;

                    let getList = comboList.filter(lst => {
                        return lst.value === parseInt(item.sdefaultvalue);
                    });

                    if (getList.length > 0) {
                        selectedRecord[item.sfieldname] = { label: getList[0].label, value: getList[0].value };

                        inputFieldData = {
                            ...inputFieldData,
                            [item.sfieldname]: getList[0].value,
                            [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                            [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                        };
                    } else {
                        selectedRecord[item.sfieldname] = undefined;
                    }
                }else if (item.ndesigncomponentcode === designComponents.USERINFO) {
                    selectedRecord[item.sfieldname] = (userInfo && userInfo[item.sfieldname]) || "";
                    inputFieldData = {
                        ...inputFieldData,
                        [item.sfieldname]: (userInfo && userInfo[item.sfieldname]) || "",
                        [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                        [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                    };
                }
                else {
                    selectedRecord[item.sfieldname] = item.sdefaultvalue;
                }

                return null;
            })

        }

        masterData = {
            ...masterData,
            ...response.data,
            // comboParamData: response.data.comboParamData,
            // selectedDashBoardTypes: dashBoardTypes,
            viewDashBoardDesignConfigList: response.data.viewDashBoardDesignConfigList,
            xSeries: openModalNew === true ? [] : response.data.xSeries,
            ySeries: openModalNew === true ? [] : response.data.ySeries,
            pieChart: openModalNew === true ? [] : response.data.pieChart

        };

        dispatch({
            type: DEFAULT_RETURN, payload: {
                masterData, loading: false,
                openModal: openModalNew, selectedRecord,
                inputFieldData: inputFieldData
            }
        });
    }
}

export function checkParametersAvailableForHomeDashBoard(DashBoardTypes, userInfo, masterData, dashBoardTemplateNo, templateCode) {
    return function (dispatch) {
        let openModalNew = false;
        let openChildModalNew = false;
        let selectedRecord = {};
        let inputFieldData = {};
        dispatch(initRequest(true));
        // console.log("checkParametersAvailableForHomeDashBoard action:", DashBoardTypes, masterData);
        rsapi().post("/dashboardview/checkParameteAvailableInDashBoardView", { 'userinfo': userInfo, "ndashboardtypecode": DashBoardTypes.ndashboardtypecode })

            .then(response => {
                //console.log("res in checkParametersAvailableForHomeDashBoard:", response);
                if (response.data.viewDashBoardDesignConfigList !== undefined && response.data.viewDashBoardDesignConfigList.length > 0) {

                    openChildModalNew = true;
                    response.data.viewDashBoardDesignConfigList.map(item => {
                        if (item.ndesigncomponentcode === designComponents.DATEPICKER) {

                            selectedRecord[item.sfieldname] = rearrangeDateFormat(userInfo, item.dataList[0])
                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: rearrangeDateFormat(userInfo, item.dataList[0]),
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }
                        else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                            const comboMap = constructOptionList(item.dataList || [], item.svaluemember,
                                item.sdisplaymember, undefined, undefined, true);

                            const comboList = comboMap.get("OptionList");
                            item.dataList = comboList;

                            let getList = comboList.filter(lst => {
                                return lst.value === parseInt(item.sdefaultvalue);
                            });

                            if (getList.length > 0) {
                                selectedRecord[item.sfieldname] = { label: getList[0].label, value: getList[0].value };

                                inputFieldData = {
                                    ...inputFieldData,
                                    [item.sfieldname]: getList[0].value,
                                    [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                    [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                                };
                            } else {
                                selectedRecord[item.sfieldname] = undefined;
                            }

                        } else if (item.ndesigncomponentcode === designComponents.USERINFO) {
                            selectedRecord[item.sfieldname] = (userInfo&& userInfo[item.sfieldname]) || "";
                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: (userInfo && userInfo[item.sfieldname]) || "",
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }
                        else {
                            selectedRecord[item.sfieldname] = item.sdefaultvalue;

                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: item.sdefaultvalue,
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }

                        return null;
                    })

                }

                masterData = {
                    ...masterData,
                    ...response.data,
                    comboParamData: response.data.comboParamData,
                    selectedDashBoardTypes: DashBoardTypes,
                    viewDashBoardDesignConfigList: response.data.viewDashBoardDesignConfigList,
                    xSeries: openModalNew === true ? [] : response.data.xSeries,
                    ySeries: openModalNew === true ? [] : response.data.ySeries,
                    pieChart: openModalNew === true ? [] : response.data.pieChart

                };
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, selectedRecord, inputFieldData: inputFieldData, dashBoardTemplateNo, templateCode, openModalForHomeDashBoard: openChildModalNew } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function checkParametersAvailable(DashBoardTypes, userInfo, masterData, dashBoardTemplateNo, templateCode) {
    return function (dispatch) {
        let openModalNew = false;
        let selectedRecord = {};
        let inputFieldData = {};
        dispatch(initRequest(true));
        rsapi().post("/dashboardview/checkParameteAvailableInDashBoardView", { 'userinfo': userInfo, "ndashboardtypecode": DashBoardTypes.ndashboardtypecode })

            .then(response => {

                if (response.data.viewDashBoardDesignConfigList !== undefined && response.data.viewDashBoardDesignConfigList.length > 0) {
                    openModalNew = true;

                    response.data.viewDashBoardDesignConfigList.map(item => {

                        if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                            selectedRecord[item.sfieldname] = rearrangeDateFormat(userInfo, item.dataList[0])
                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: rearrangeDateFormat(userInfo, item.dataList[0]),
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }
                        else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                            const comboMap = constructOptionList(item.dataList || [], item.svaluemember,
                                item.sdisplaymember, undefined, undefined, true);

                            const comboList = comboMap.get("OptionList");
                            item.dataList = comboList;


                            let getList = comboList.filter(lst => {
                                return lst.value === parseInt(item.sdefaultvalue);
                            });
                            if (getList.length > 0) {
                                selectedRecord[item.sfieldname] = { label: getList[0].label, value: getList[0].value };

                                inputFieldData = {
                                    ...inputFieldData,
                                    [item.sfieldname]: getList[0].value,
                                    [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                    [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                                };
                            } else {
                                selectedRecord[item.sfieldname] = undefined;
                            }
                        }else if (item.ndesigncomponentcode === designComponents.USERINFO) {
                            selectedRecord[item.sfieldname] = (userInfo && userInfo[item.sfieldname]) || "";
                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: (userInfo && userInfo[item.sfieldname]) || "",
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }
                        else {
                            selectedRecord[item.sfieldname] = item.sdefaultvalue;

                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: item.sdefaultvalue,
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }

                        return null;
                    })

                }

                masterData = {
                    ...masterData,
                    ...response.data,
                    comboParamData: response.data.comboParamData,
                    selectedDashBoardTypes: DashBoardTypes,
                    viewDashBoardDesignConfigList: response.data.viewDashBoardDesignConfigList,
                    xSeries: openModalNew === true ? [] : response.data.xSeries,
                    ySeries: openModalNew === true ? [] : response.data.ySeries,
                    pieChart: openModalNew === true ? [] : response.data.pieChart

                };
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false,
                        openModal: openModalNew, selectedRecord, inputFieldData: inputFieldData,
                        dashBoardTemplateNo, templateCode
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function checkParametersAvailableForDefaultValue(DashBoardTypes, userInfo, masterData, operation, screenName) {
    return function (dispatch) {
        let openModalNew = false;
        let openChildModalNew = false;
        let selectedRecord = {};
        let inputFieldData = {};
        dispatch(initRequest(true));
        rsapi().post("/dashboardview/checkParameteAvailableInDashBoardView", { 'userinfo': userInfo, "ndashboardtypecode": DashBoardTypes.ndashboardtypecode })

            .then(response => {
                const viewList = response.data.viewDashBoardDesignConfigList;

                if (viewList !== undefined && viewList.length > 0) {

                    openChildModalNew = true;
                    viewList.map(item => {

                        if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                            selectedRecord[item.sfieldname] = rearrangeDateFormat(userInfo, item.dataList[0])
                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: rearrangeDateFormat(userInfo, item.dataList[0]),
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }
                        else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                            const comboMap = constructOptionList(item.dataList || [], item.svaluemember,
                                item.sdisplaymember, undefined, undefined, true);

                            const comboList = comboMap.get("OptionList");
                            item.dataList = comboList;

                            let getList = comboList.filter(lst => {
                                return lst.value === parseInt(item.sdefaultvalue);
                            });
                            if (getList.length > 0) {
                                selectedRecord[item.sfieldname] = { label: getList[0].label, value: getList[0].value };

                                inputFieldData = {
                                    ...inputFieldData,
                                    [item.sfieldname]: getList[0].value,
                                    [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                    [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                                };
                            } else {
                                selectedRecord[item.sfieldname] = undefined;
                            }
                        }
                        else {
                            selectedRecord[item.sfieldname] = item.sdefaultvalue;

                            inputFieldData = {
                                ...inputFieldData,
                                [item.sfieldname]: item.sdefaultvalue,
                                [item.sfieldname.concat("_componentcode")]: item.ndesigncomponentcode,
                                [item.sfieldname.concat("_componentname")]: item.sdesigncomponentname,
                            };
                        }

                        return null;
                    })

                }

                masterData = {
                    ...masterData,
                    ...response.data,
                    comboParamData: response.data.comboParamData,
                    selectedDashBoardTypes: DashBoardTypes,
                    viewDashBoardDesignConfigList: viewList,
                    xSeries: openModalNew === true ? [] : response.data.xSeries,
                    ySeries: openModalNew === true ? [] : response.data.ySeries,
                    pieChart: openModalNew === true ? [] : response.data.pieChart

                };
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false,
                        openChildModal: openChildModalNew, selectedRecord,
                        inputFieldData: inputFieldData, operation, screenName
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

// export function showDefaultValueInDataGrid(DashBoardTypes, userInfo, masterData) {
//     return function (dispatch) {
//         let dashBoardDefaultValue = [];
//         dispatch(initRequest(true));
//         rsapi().post("/dashboardview/checkParameteAvailableInDashBoardView", { 'userinfo': userInfo, "ndashboardtypecode": DashBoardTypes.ndashboardtypecode })

//             .then(response => {

//                 if (response.data.viewDashBoardDesignConfigList !== undefined && response.data.viewDashBoardDesignConfigList.length > 0) {

//                     response.data.viewDashBoardDesignConfigList.map(item => {

//                         if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
//                             // selectedRecord[item.sfieldname] = new Date(item.dataList[0])
//                         }
//                         else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
//                             const comboMap = constructOptionList(item.dataList || [], item.svaluemember,
//                                 item.sdisplaymember, undefined, undefined, true);

//                             let index = -1;
//                             const comboList = comboMap.get("OptionList");
//                             item.dataList = comboList;
//                             index = comboList.findIndex(lst => (
//                                 lst.value === item.sdefaultvalue && item.sdefaultvalue === "" ? -1 :
//                                     parseInt(item.sdefaultvalue))
//                             )
//                             if (index !== -1) {
//                                 dashBoardDefaultValue.push({ ndashboarddesigncode: item.ndashboarddesigncode, sdisplayname: item.sdisplayname, sdefaultvalue: comboList[index].label });
//                             }
//                         }
//                         else {
//                             dashBoardDefaultValue.push({ ndashboarddesigncode: item.ndashboarddesigncode, sdisplayname: item.sdisplayname, sdefaultvalue: item.sdefaultvalue });

//                         }

//                         return null;
//                     })

//                 }

//                 masterData = {
//                     ...masterData,
//                     dashBoardDefaultValue: dashBoardDefaultValue

//                 };
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         masterData, loading: false
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//             })
//     }
// }


export function getDashBoardParameterMappingComboService(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        return rsapi().post("dashboardtypes/getDashBoardParameterMappingComboData", {
            ndashboardtypecode: parseInt(inputParam.dashBoardTypes.ndashboardtypecode),
            userinfo: inputParam.userInfo
        })
            .then(response => {
                if (response.data["ChildComponentList"].length > 0) {

                    const parentComponentMap = constructOptionList(response.data["ParentComponenList"] || [], "ndashboarddesigncode",
                        "sdisplayname", undefined, undefined, true);
                    const parentComponentList = parentComponentMap.get("OptionList");

                    const childComponentMap = constructOptionList(response.data["ChildComponentList"] || [], "ndashboarddesigncode",
                        "sdisplayname", undefined, undefined, true);
                    const childComponentList = childComponentMap.get("OptionList");

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            parentComponentList: parentComponentList, //response.data["ParentComponenList"] || [],
                            childComponentList: childComponentList,//response.data["ChildComponentList"] || [],
                            operation: inputParam.operation,
                            screenName: inputParam.screenName,
                            selectedRecord: {},
                            openChildModal: true,
                            ncontrolCode: inputParam.ncontrolCode,
                            loading: false
                        }
                    });
                }
                else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    toast.warn(intl.formatMessage({ id: "IDS_NOPARAMETERSTOMAPDASHBOARD" }))
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }

            })

    }
}

export function getReportViewChildDataListForDashBoard(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("dashboardview/getChildDataList", { ...inputParam["inputData"] })
            .then(response => {

                const controlList = inputParam.viewDashBoardDesignConfigList;
                const selectedRecord = inputParam.selectedRecord;

                Object.keys(response.data).map(displayName => {
                    const index = controlList.findIndex(item => displayName === item.sdisplayname);

                    const comboMap = constructOptionList(response.data[displayName] || [], controlList[index].svaluemember,
                        controlList[index].sdisplaymember, undefined, undefined, true);

                    const comboList = comboMap.get("OptionList");

                    selectedRecord[controlList[index].svaluemember] = undefined;

                    return controlList[index]["dataList"] = comboList;//response.data[displayName]
                })
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        viewDashBoardDesignConfigList: controlList,
                        loading: false,
                        inputFieldData: inputParam.inputData.inputfielddata,
                        selectedRecord
                    }
                });
            })
            .catch(error => {
                // console.log("error:", error);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
        } else if (error.response && error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getDashBoardHomePagesandTemplates(inputParam) {
    return function (dispatch) {

        let urlArray = [];
        let selectedRecord = {};
        let selectedId = null;

        const userRole = rsapi().post("userrole/getUserRole", { "userinfo": inputParam.userInfo });
        const homeDashBoard = rsapi().post("dashboardhomeconfig/getDashBoardHomePagesandTemplates", { "userinfo": inputParam.userInfo });
        if (inputParam.operation === "update") {

            const homeDashBoardById = rsapi().post("dashboardhomeconfig/getDashBoardHomeConfigByID", { "userinfo": inputParam.userInfo, "ndashboardhomeprioritycode": inputParam.editRow.ndashboardhomeprioritycode });

            urlArray = [homeDashBoard, userRole, homeDashBoardById];
            selectedId = inputParam.primaryKeyValue;
        }
        else {
            urlArray = [homeDashBoard, userRole];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                const userRoleMap = constructOptionList(response[1].data || [], "nuserrolecode",
                    "suserrolename", undefined, undefined, true);

                const userRoleList = userRoleMap.get("OptionList");

                const parameterMap = constructOptionList(response[0].data.dashBoardHomePages || [], "ndashboardhomepagecode",
                    "sdashboardhomepagename", undefined, undefined, true);

                const reportParameterList = parameterMap.get("OptionList");

                if (inputParam.operation === "update") {

                    selectedRecord = response[2].data.DashBoardHomeConfigByID;

                    selectedRecord["nuserrolecode"] = {
                        label: response[2].data.DashBoardHomeConfigByID["suserrolename"],
                        value: response[2].data.DashBoardHomeConfigByID["nuserrolecode"]
                    };
                    selectedRecord["ndashboardhomepagecode"] = {
                        label: response[2].data.DashBoardHomeConfigByID["sdashboardhomepagename"],
                        value: response[2].data.DashBoardHomeConfigByID["ndashboardhomepagecode"]
                    };

                    response[2].data.DashBoardTypeNames.map((item) =>
                        selectedRecord["dashboardtype" + item.nsorter] = { sdashboardtypename: item.sdashboardtypename, ndashboardtypecode: item.ndashboardtypecode }
                    )

                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        operation: inputParam.operation,
                        screenName: "IDS_DASHBOARDHOMECONFIG",
                        openModal: true,
                        loading: false, selectedId,
                        dashBoardHomePages: reportParameterList,
                        dashBoardHomeTemplate: response[0].data.dashBoardHomeTemplate,
                        dashBoardType: response[0].data.dashBoardType,
                        userRoleList: userRoleList,
                        selectedRecord: inputParam.operation === "update" ? selectedRecord : undefined,
                        ncontrolCode: inputParam.ncontrolCode
                    }
                });
            }))

            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getHomeDashBoard(userInfo, pageCode, pageAction, respObject) {
    return function (dispatch) {
        // dispatch(initRequest(true));
        rsapi().post("/dashboardview/getHomeDashBoard", { 'userinfo': userInfo, "ndashboardhomepageCode": pageCode, "pageAction": pageAction })

            .then(response => {
                //console.log("home dash:", response);
                let currentPageNo = 0;
                if (response.data["homeDashBoard"].length > 0) {
                    currentPageNo = parseInt(Object.keys(response.data["homeDashBoard"])[0]);
                }
                dispatch({ type: DEFAULT_RETURN, payload: { ...response.data, currentPageNo, ...respObject } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function updateDashBoarddesignDefaultValue(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/dashboardtypes/updateDashBoardDesignConfig", { ...inputData }
            //{ 'userinfo': inputData.userinfo, "dashboarddesignconfig": inputData.dashboarddesignconfig }
        )

            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: { ...masterData, ...response.data },
                        openChildModal: false,
                        loading: false
                    }
                });
                // dispatch(showDefaultValueInDataGrid(masterData.selectedDashBoardTypes,inputData.userinfo, masterData));
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}