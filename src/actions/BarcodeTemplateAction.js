import { toast } from "react-toastify";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import rsapi from "../rsapi";
import { constructOptionList } from "../components/CommonScript";
import { initRequest } from "./LoginAction";
import axios, { Axios } from "axios";
import { intl } from "../components/App";

export function getBarcodeTemplateComboService(addParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const listURL = [];
        listURL[0] = rsapi().post("dynamicpreregdesign/getReactComponents", { 'userinfo': addParam.userInfo })
        listURL[1] = rsapi().post("dynamicpreregdesign/getReactInputFields", { 'userinfo': addParam.userInfo })
        listURL[2] = rsapi().post("dynamicpreregdesign/getReactStaticFilterTables", { 'userinfo': addParam.userInfo })
        listURL[3] = rsapi().post("barcodetemplate/getBarcodeTemplateModal", { 'userinfo': addParam.userInfo })
        axios.all(listURL).then(response => {
            const qualisMap = constructOptionList(response[3].data["QualisForm"] || [], "nformcode",
                "sformname", undefined, undefined, true);
            const qualisList = qualisMap.get("OptionList");

            const SqlMap = constructOptionList(response[3].data["SqlQuery"] || [], "nsqlquerycode",
                "ssqlqueryname", undefined, undefined, true).get("OptionList");

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false,
                    qualisList,
                    ReactInputFields: response[1].data,
                    ReactComponents: response[0].data.components,
                    staticfiltertables: constructOptionList(response[2].data, 'nquerybuilderstaticfiltercode', 'displayname').get("OptionList"),
                    ReactTables: constructOptionList(response[0].data.tables, 'nquerybuildertablecode', 'sdisplayname').get("OptionList"),
                    ncontrolcode: addParam.controlId,
                    openModal: true,
                    operation: 'create',
                    reactTemplate: undefined,
                    screenName: addParam.screenName,
                    SqlQuery: SqlMap
                }
            })
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


export function getEditBarcodeTemplateComboService(addParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const listURL = [];
        listURL[0] = rsapi().post("dynamicpreregdesign/getReactComponents", { 'userinfo': addParam.userinfo })
        listURL[1] = rsapi().post("dynamicpreregdesign/getReactInputFields", { 'userinfo': addParam.userinfo })
        listURL[2] = rsapi().post("dynamicpreregdesign/getReactStaticFilterTables", { 'userinfo': addParam.userinfo })
        listURL[3] = rsapi().post("barcodetemplate/getEditBarcodeTemplateModal", {
            nbarcodetemplatecode: addParam.nbarcodetemplatecode
            , 'userinfo': addParam.userinfo
        })
        axios.all(listURL).then(response => {
            let selectedRecord = addParam.selectedRecord;

            const barcodeTemplate = response[3].data.SelectedBarcodeTemplate

            let reactTemplate = undefined

            selectedRecord['nformcode'] = { label: barcodeTemplate.sformname, value: barcodeTemplate.nformcode, item: {} }
            selectedRecord['ncontrolcode'] = {
                label: barcodeTemplate.scontrolname,
                value: barcodeTemplate.ncontrolcode,
                item: {
                    stableprimarykeyname: barcodeTemplate.stableprimarykeyname,
                    nquerybuildertablecode: barcodeTemplate.nquerybuildertablecode,
                    stablename: barcodeTemplate.stablename,
                    jnumericcolumns: barcodeTemplate.jnumericcolumns
                }
            }


            selectedRecord['nneedconfiguration'] = barcodeTemplate.jsondata.nneedconfiguration ? 3 : 4
            selectedRecord['nbarcodeprint'] = barcodeTemplate.jsondata.nbarcodeprint ? 3 : 4
            selectedRecord['nsqlqueryneed'] = barcodeTemplate.jsondata.nsqlqueryneed ? 3 : 4
            selectedRecord['nfiltersqlqueryneed'] = barcodeTemplate.jsondata.nfiltersqlqueryneed ? 3 : 4

            if (barcodeTemplate.jsondata.nsqlqueryneed&&barcodeTemplate.jsondata.nfiltersqlqueryneed===false) {
                selectedRecord['nsqlquerycode'] = { label: barcodeTemplate.ssqlqueryname, value: barcodeTemplate.nsqlquerycode, item: {} }
            } else {
                selectedRecord['nsqlquerycode'] = undefined
            }



            const lstFilterlevel = []
            let totalLevel = 0;
            if (barcodeTemplate.jsondata.nneedconfiguration) {
                reactTemplate = {
                    jsonString: JSON.stringify(barcodeTemplate.jsondata.screenfilter),
                    valuemember: barcodeTemplate.jsondata.valuemember
                }


                const layout = barcodeTemplate.jsondata.screenfilter;
                layout.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        totalLevel = totalLevel++;
                                        lstFilterlevel.push({ slabelname: componentrow.label })
                                    }
                                })
                            } else {
                                if (component.inputtype === "combo") {
                                    lstFilterlevel.push({ slabelname: component.label })
                                    totalLevel = totalLevel++
                                }

                            }

                        })
                    })
                })
            }

            const qualisMap = constructOptionList(response[3].data["QualisForm"] || [], "nformcode",
                "sformname", undefined, undefined, true);
            const qualisList = qualisMap.get("OptionList");

            const controlMap = constructOptionList(response[3].data["controlList"] || [], "ncontrolcode",
                "sdisplayname", undefined, undefined, true);
            const controlList = controlMap.get("OptionList");

            const SqlMap = constructOptionList(response[3].data["SqlQuery"] || [], "nsqlquerycode",
                "ssqlqueryname", undefined, undefined, true).get("OptionList");
            selectedRecord['totalLevel'] = totalLevel
            selectedRecord['lstFilterlevel'] = lstFilterlevel
            selectedRecord['reactTemplate'] = reactTemplate


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false,
                    qualisList,
                    controlList,
                    ncontrolcode: addParam.controlId,
                    //   lstFilterlevel,
                    //   totalLevel,
                    //   reactTemplate: reactTemplate,
                    openModal: true,
                    ReactInputFields: response[1].data,
                    ReactComponents: response[0].data.components,
                    staticfiltertables: constructOptionList(response[2].data, 'nquerybuilderstaticfiltercode', 'displayname').get("OptionList"),
                    ReactTables: constructOptionList(response[0].data.tables, 'nquerybuildertablecode', 'sdisplayname').get("OptionList"),
                    operation: 'update',
                    SqlQuery: SqlMap,
                    selectedRecord
                }
            })
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


export function getBarcodeTemplateControl(map,selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodetemplate/getBarcodeTemplateControl", { 'userinfo': map.userInfo, nformcode: selectedRecord.nformcode.value })
            .then(response => {
                //   const selectedRecord=map.selectedRecord;
                const qualisMap = constructOptionList(response.data["controlList"] || [], "ncontrolcode",
                    "sdisplayname", undefined, undefined, true);
                const qualisList = qualisMap.get("OptionList");
                //  selectedRecord['ncontrolcode']=undefined

                //  selectedRecord['reactTemplate']=undefined
                //  selectedRecord['lstFilterlevel']=[]
                //  selectedRecord['totalLevel']=0

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        controlList: qualisList,
                        selectedRecord: selectedRecord,
                        // reactTemplate:undefined,
                        // lstFilterlevel:[],
                        // totalLevel:0
                    }
                })
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

export function getReactQuerybuilderTableRecord(userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const listURL = [];
        listURL[0] = rsapi().post("dynamicpreregdesign/getReactComponents", { userinfo })
        listURL[1] = rsapi().post("dynamicpreregdesign/getReactInputFields", { userinfo })
        listURL[2] = rsapi().post("dynamicpreregdesign/getReactStaticFilterTables", { userinfo })
        axios.all(listURL)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openPortal: true,
                        loading: false,
                        ReactInputFields: response[1].data,
                        ReactComponents: response[0].data.components,
                        staticfiltertables: constructOptionList(response[2].data, 'nquerybuilderstaticfiltercode', 'displayname').get("OptionList"),
                        ReactTables: constructOptionList(response[0].data.tables, 'nquerybuildertablecode', 'sdisplayname').get("OptionList"),
                        openModal: false,
                        design: [
                            {
                                "id": "pv1OWbsMYq",
                                "type": "row",
                                "children": [
                                    {
                                        "id": "2zMtRhjb2t",
                                        "type": "column",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                })
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


export function getBarcodeTemplateDetail(barcodeTemplate, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodetemplate/getBarcodeTemplate", { nbarcodetemplatecode: barcodeTemplate.nbarcodetemplatecode, 'userinfo': userInfo })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: { ...masterData, SelectedBarcodeTemplate: response.data.SelectedBarcodeTemplate },
                        loading: false,
                    }
                })
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

