import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, constructOptionList, rearrangeDateFormat,getFilterConditionsBasedonDataType,queryBuilderfillingColumns } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { designProperties, SampleType, formCode } from '../components/Enumeration';
import { Utils as QbUtils } from "@react-awesome-query-builder/ui";
    const { checkTree, loadTree } = QbUtils;

export function getDesignTemplateMappingDetail(designtemplatemapping, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("designtemplatemapping/getDesignTemplateMapping", {
            ndesigntemplatemappingcode: designtemplatemapping.ndesigntemplatemappingcode,
            nsampletypecode: designtemplatemapping.nsampletypecode,
            nregtypecode: designtemplatemapping.nregtypecode,
            nregsubtypecode: designtemplatemapping.nregsubtypecode,
            userinfo: userInfo,
            nformcode: designtemplatemapping.nformcode,
        })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {

                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }

            })
    }
}

export function getDesignTemplateMappingComboService(param) {
    return function (dispatch) {

        const screenName = param.screenName;
        const operation = param.operation;
        const userInfo = param.userInfo;
        const nsampletypecode = param.realSampleValue;
        const nregtypecode = param.realRegTypeValue;
        const nregsubtypecode = param.realRegSubTypeValue;
        const ncontrolCode = param.controlId;
        const moduleTypeArray = param.moduleTypeArray;
        //if (//(operation === "create") && (nsampletypecode != -1) && (nregtypecode != -1) && (nregsubtypecode != -1)) {

        let isValid = true;
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        if (nsampletypecode !== SampleType.Masters && nsampletypecode !== SampleType.GOODSIN 
            && nsampletypecode !== SampleType.PROTOCOL //&& nsampletypecode !== SampleType.STABILITY
        ) {
            if ((nsampletypecode != -1) && (nregtypecode != -1) && (nregsubtypecode != -1)) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }

        if (isValid) {
            const designtemplatemappingService = rsapi().post("designtemplatemapping/getDynamicPreRegDesign", { userinfo: userInfo, nsampletypecode, nregtypecode, nregsubtypecode });
            let urlArray = [designtemplatemappingService];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = { nnewmodule: moduleTypeArray[0] };
                    let designtemplatemappingMap = constructOptionList(response[0].data.DesignTemplateMapping || [], "nreactregtemplatecode",
                        "sregtemplatename", undefined, undefined, true);
                    const designtemplatemappingList = designtemplatemappingMap.get("OptionList");

                    let subSampleTemplateList = [];
                    let testListFields = {};
                    let qualisModuleList = [];
                    //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                    if (nsampletypecode !== SampleType.Masters && nsampletypecode !== SampleType.GOODSIN 
                        && nsampletypecode !== SampleType.PROTOCOL) {

                        designtemplatemappingMap = constructOptionList(response[0].data.SubSampleTemplate || [], "nreactregtemplatecode",
                            "sregtemplatename", undefined, undefined, true);

                        subSampleTemplateList = designtemplatemappingMap.get("OptionList");

                        testListFields = response[0].data.TestListFields && response[0].data.TestListFields.jsondata;
                    }

                    if (nsampletypecode === SampleType.Masters) {
                        const qualisModuleMap = constructOptionList(response[0].data.DT_QualisModule || [], "nmodulecode",
                            "sdisplayname", undefined, undefined, true);

                        qualisModuleList = qualisModuleMap.get("OptionList");
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {

                            designtemplatemappingList,
                            subSampleTemplateList,
                            testListFields,
                            operation, screenName, selectedRecord, openModal: true,
                            ncontrolCode, loading: false,
                            designTemplateQualisModule: qualisModuleList
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {

            toast.warn(intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }

    }
}

export function reloadDesignTemplateMapping(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("designtemplatemapping/getDesignTemplateMapping", { ...inputParam.inputData })
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                //if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                //    inputParam.searchRef.current.value = "";
                masterData['searchedData'] = undefined
                //}
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false
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

export function getTMPFilterRegType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("designtemplatemapping/getTemplateRegType", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}

export function getTMPFilterRegSubType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("designtemplatemapping/getTemplateRegSubType", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}

export function getTMPFilterSubmit(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("designtemplatemapping/getFilterSubmit", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data }
                let listdesigntemplatemapping = sortData(response.data.DesignTemplateMapping);
                masterData = { ...masterData, listdesigntemplatemapping }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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

}

export function getMappedFieldProps(inputParam) {
    return function (dispatch) {
        const fieldService = rsapi().post('designtemplatemapping/getMappedFieldProps',
            {
                designtemplatemapping: inputParam.inputData.designtemplatemapping,
                userinfo: inputParam.inputData.userinfo
            });
        let urlArray = [fieldService];

        if (inputParam.inputData["napprovalconfigcode"]) {
            const regSubTypeVersionService = rsapi().post("registrationsubtype/getApprovedVersion",
                { napprovalconfigcode: inputParam.inputData.napprovalconfigcode,userinfo: inputParam.inputData.userinfo });

            urlArray.push(regSubTypeVersionService);
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let dataResult = {};
                let designData = response[0].data.jsondataobj || {};
                //console.log("design:", designData);

                if (inputParam["SampleType"] === SampleType.Masters) {
                    // Object.keys(designData).map(formcode => {
                    dataResult = [];
                    designData.mastertemplatefields.map(field =>
                        (field[designProperties.LISTITEM]!=="label") &&  //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        dataResult.push({
                            // label: field[designProperties.VALUE],
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            griditem: designData.griditem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                            gridmoreitem: designData.gridmoreitem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                            realData: field
                        })
                    )
                    // })                   
                } else if (inputParam["SampleType"] === SampleType.GOODSIN) {
                    dataResult = [];
                    designData.templatefields.map(field =>
                        (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        dataResult.push({
                            // label: field[designProperties.VALUE],
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            griditem: designData.griditem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                            gridmoreitem: designData.gridmoreitem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                            realData: field
                        })
                    )
                }
                //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                else if (inputParam["SampleType"] === SampleType.PROTOCOL) {
                    dataResult = [];
                    designData.templatefields.map(field =>
                        (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        dataResult.push({
                            // label: field[designProperties.VALUE],
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            listItem: designData.listItem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                            displayFields: designData.displayFields.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                            realData: field
                        })
                    )
                }
                else if (inputParam["SampleType"] === SampleType.STABILITY) {
                    {
                        Object.keys(designData).map(formcode => {
                            dataResult[formcode] = [];
                            designData.sampletemplatefields.map(field =>
                                !Array.isArray(designData[formcode]) && formcode === "246"  &&
                                dataResult[formcode].push({
                                    // label: field[designProperties.VALUE],
                                    label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                    sampledisplayfields: designData[formcode].sampledisplayfields.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    // samplelistitem: designData[formcode].samplelistitem.find(val => val["2"] === field[designProperties.VALUE]) === undefined ? "none" : true,
                                    samplelistitem: designData[formcode].samplelistitem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    samplelistmoreitems: designData[formcode].samplelistmoreitems ? designData[formcode].samplelistmoreitems.find(val => val["2"] === field[designProperties.VALUE]) !== undefined : false,
                                    samplegriditem: designData[formcode].samplegriditem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    samplegridmoreitem: designData[formcode].samplegridmoreitem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    samplefilteritem: designData[formcode].samplefilteritem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    realData: field
                                })
                            )
                        })
                    }
                }

                else {
                    // const regSubTypeVersionData = response[1].data;
                    //if(regSubTypeVersionData &&  regSubTypeVersionData.jsondata.nneedsubsample === true){
                    if (inputParam.operation === "configuresubsample") {
                        Object.keys(designData).map(formcode => {
                            dataResult[formcode] = [];
                            designData.subsampletemplatefields.map(field =>
                                !Array.isArray(designData[formcode]) && formcode !== "senttostoragefields" &&
                                (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                dataResult[formcode].push({
                                    //label: field[designProperties.VALUE],
                                    label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                    subsamplelistitem: designData[formcode].subsamplelistitem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    realData: field
                                })
                            )
                        })
                    }
                    else {
                        Object.keys(designData).map(formcode => {
                            dataResult[formcode] = [];
                            designData.sampletemplatefields.map(field =>
                                 
                                !Array.isArray(designData[formcode]) && formcode !== "senttostoragefields"
                                 && (formcode !== "143" ? field[designProperties.VALUE] === "sreportno" ? false : true : true) &&
                                 (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                dataResult[formcode].push({
                                    // label: field[designProperties.VALUE],
                                    label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                    sampledisplayfields: designData[formcode].sampledisplayfields.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    // samplelistitem: designData[formcode].samplelistitem.find(val => val["2"] === field[designProperties.VALUE]) === undefined ? "none" : true,
                                    samplelistitem: designData[formcode].samplelistitem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    samplelistmoreitems: designData[formcode].samplelistmoreitems ? designData[formcode].samplelistmoreitems.find(val => val["2"] === field[designProperties.VALUE]) !== undefined : false,
                                    samplegriditem: designData[formcode].samplegriditem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    samplegridmoreitem: designData[formcode].samplegridmoreitem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    samplefilteritem: designData[formcode].samplefilteritem && designData[formcode].samplefilteritem.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                    realData: field
                                })
                            )
                        })
                    }
                }
                // console.log("response[1].data:", response[1].data);

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        designData: designData,//response[0].data.jsondataobj,
                        approvedRegSubTypeVersion: inputParam.inputData["napprovalconfigcode"] ? response[1].data : undefined,
                        dataResult,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolcode
                    }
                });
            })
            .catch(error => {

                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}

export function combinationUniqueConfigService(inputParam) {
    return function (dispatch) {
        const fieldService = rsapi().post('designtemplatemapping/getMappedFieldProps',
            {
                designtemplatemapping: inputParam.inputData.designtemplatemapping,
                userinfo: inputParam.inputData.userinfo
            });
        let urlArray = [fieldService];

        if (inputParam.inputData["napprovalconfigcode"]) {
            const regSubTypeVersionService = rsapi().post("registrationsubtype/getApprovedVersion",
                { napprovalconfigcode: inputParam.inputData.napprovalconfigcode ,userinfo: inputParam.inputData.userinfo});

            urlArray.push(regSubTypeVersionService);
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let dataList = [];
                let dataListCount = [];
                let designData = response[0].data.jsondataobj || {};

                let dataListSubSample = []
                let dataListCountSubSample = [];

                if (inputParam["SampleType"] === SampleType.Masters) {
                    dataList = designData.mastercombinationunique && [...designData.mastercombinationunique] || []
                    designData.mastercombinationunique && designData.mastercombinationunique.map((item, index) => { dataListCount.push(index) })
                }
                //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                else if (inputParam["SampleType"] === SampleType.GOODSIN || inputParam["SampleType"] === SampleType.PROTOCOL) {
                    dataList = designData.combinationunique && [...designData.combinationunique] || []
                    designData.combinationunique && designData.combinationunique.map((item, index) => { dataListCount.push(index) })

                }
                else {
                    dataList = designData.samplecombinationunique && [...designData.samplecombinationunique] || []
                    designData.samplecombinationunique && designData.samplecombinationunique.map((item, index) => { dataListCount.push(index) })

                    dataListSubSample = designData.subsamplecombinationunique && [...designData.subsamplecombinationunique] || []
                    designData.subsamplecombinationunique && designData.subsamplecombinationunique.map((item, index) => { dataListCountSubSample.push(index) })
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        designData: designData,//response[0].data.jsondataobj,
                        approvedRegSubTypeVersion: inputParam.inputData["napprovalconfigcode"] ? response[1].data : undefined,
                        dataList, dataListCount, dataListSubSample, dataListCountSubSample,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolcode: inputParam.ncontrolcode
                    }
                });
            })
            .catch(error => {

                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}

////Modified the function by sonia on 11th NOV 2024 for jira id:ALPD-5025
export function editFieldConfigService(inputParam) {
    return function (dispatch) {
        let filterStatusService =[];
        const fieldService = rsapi().post('designtemplatemapping/getMappedFieldProps',
            {
                designtemplatemapping: inputParam.inputData.designtemplatemapping,
                userinfo: inputParam.inputData.userinfo
            });

        if(inputParam["SampleType"] !== SampleType.Masters && inputParam["SampleType"] !== SampleType.GOODSIN && inputParam["SampleType"] !== SampleType.PROTOCOL){
            filterStatusService = rsapi().post('registration/getRegistrationFilterStatus',
                {   
                    nregtypecode: inputParam.inputData.nregtypecode,
                    nregsubtypecode: inputParam.inputData.nregsubtypecode,
                    userinfo: { ...inputParam.inputData.userinfo, nformcode: 43 }
                });
        }else if(inputParam["SampleType"] == SampleType.PROTOCOL){
            filterStatusService = rsapi().post('protocol/getEditFilterStatus',
                {   
                  
                    userinfo: { ...inputParam.inputData.userinfo, nformcode: formCode.PROTOCOL}
                });
        }
        
        let urlArray = [fieldService, filterStatusService];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let dataResult = {};
                let designData = response[0].data.jsondataobj || {};
                let filterStatus = response[1].data || [];

                const list = filterStatus.filter(item => item["ntransactionstatus"] !== 0)
                filterStatus = list;

                let selectedRecord = {};
                if (inputParam["SampleType"] === SampleType.Masters) {
                    dataResult = [];
                    designData.mastertemplatefields.map(field =>
                        dataResult.push({ label: field[designProperties.VALUE], editablestatus: filterStatus, realData: field })
                    )
                }else if(inputParam["SampleType"] === SampleType.PROTOCOL) {
                    //Object.keys(designData).map(formcode => {
                        dataResult= [];
                        selectedRecord = {};
                        const editArray = designData["editable"] || [];

                        designData.templatefields.map(field => {
                            //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                            if (!Array.isArray(designData) &&  (field[designProperties.LISTITEM]!=="label")) {

                                const index = editArray.findIndex(x => x.label === field[designProperties.VALUE]);
                                if (index !== -1) {
                                    const fieldEditStatus = editArray[index];
                                    if (fieldEditStatus.editableuntill.length > 0) {
                                        const statusArray = [];
                                        filterStatus.map(item1 => {

                                            const foundIndex = fieldEditStatus.editableuntill.findIndex(x => x === item1.ntransactionstatus);

                                            if (foundIndex !== -1) {
                                                statusArray.push({ label: item1.stransdisplaystatus, value: item1.ntransactionstatus, item: item1 });
                                            }
                                        })
                                        selectedRecord[field[designProperties.VALUE]] = statusArray;

                                        dataResult.push({
                                            label: field[designProperties.VALUE],
                                            editablestatus: filterStatus,
                                            realData: field
                                        })
                                    } else {

                                        dataResult.push({
                                            label: field[designProperties.VALUE],
                                            editablestatus: filterStatus,
                                            realData: field
                                        })
                                    }

                                }
                            }
                        })

                    //})
                }
                
                else {
                    if (inputParam.operation === "configuresubsampleedit") {
                        Object.keys(designData).map(formcode => {
                            dataResult[formcode] = [];
                            selectedRecord[formcode] = {};
                            const editArray = designData[formcode]["subsampleeditable"] || [];

                            designData.subsampletemplatefields.map(field => {
                                //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                if (!Array.isArray(designData[formcode]) &&  (field[designProperties.LISTITEM]!=="label")) {
                                    const index = editArray.findIndex(x => x.label === field[designProperties.VALUE]);
                                    if (index !== -1) {
                                        const fieldEditStatus = editArray[index];
                                        if (fieldEditStatus.editableuntill.length > 0) {
                                            const statusArray = [];
                                            filterStatus.map(item1 => {

                                                const foundIndex = fieldEditStatus.editableuntill.findIndex(x => x === item1.ntransactionstatus);

                                                if (foundIndex !== -1) {
                                                    statusArray.push({ label: item1.stransdisplaystatus, value: item1.ntransactionstatus, item: item1 });
                                                }
                                            })
                                            selectedRecord[formcode][field[designProperties.VALUE]] = statusArray;

                                            dataResult[formcode].push({
                                                label: field[designProperties.VALUE],
                                                editablestatus: filterStatus,
                                                realData: field
                                            })
                                        } else {

                                            dataResult[formcode].push({
                                                label: field[designProperties.VALUE],
                                                editablestatus: filterStatus,
                                                realData: field
                                            })
                                        }

                                    }
                                }
                            })

                        })
                    }
                    else {
                        Object.keys(designData).map(formcode => {
                            dataResult[formcode] = [];
                            selectedRecord[formcode] = {};
                            const editArray = designData[formcode]["sampleeditable"] || [];

                            designData.sampletemplatefields.map(field => {
                                //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                if ((field[designProperties.LISTITEM]!=="label") && !Array.isArray(designData[formcode])) {

                                    const index = editArray.findIndex(x => x.label === field[designProperties.VALUE]);
                                    if (index !== -1) {
                                        const fieldEditStatus = editArray[index];
                                        if (fieldEditStatus.editableuntill.length > 0) {
                                            const statusArray = [];
                                            filterStatus.map(item1 => {

                                                const foundIndex = fieldEditStatus.editableuntill.findIndex(x => x === item1.ntransactionstatus);

                                                if (foundIndex !== -1) {
                                                    statusArray.push({ label: item1.stransdisplaystatus, value: item1.ntransactionstatus, item: item1 });
                                                }
                                            })
                                            selectedRecord[formcode][field[designProperties.VALUE]] = statusArray;

                                            dataResult[formcode].push({
                                                label: field[designProperties.VALUE],
                                                editablestatus: filterStatus,
                                                realData: field
                                            })
                                        } else {

                                            dataResult[formcode].push({
                                                label: field[designProperties.VALUE],
                                                editablestatus: filterStatus,
                                                realData: field
                                            })
                                        }

                                    }
                                }
                            })

                        })
                    }
                }

                // console.log("selectedRecord:", selectedRecord);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        editFieldDesignData: designData,//response[0].data.jsondataobj,
                        //approvedRegSubTypeVersion: inputParam.inputData["napprovalconfigcode"] ? response[1].data :undefined,
                        editFieldDataResult: dataResult,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolcode,
                        selectedRecord
                    }
                });
            })
            .catch(error => {
                //console.log("error:", error);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}
export function mappingFieldConfigService(inputParam) {
    return function (dispatch) {
        let urlArray = [];
        let regSubTypeVersionService;
        let fieldService = [];
        fieldService = rsapi().post("designtemplatemapping/getMappedfield",
            { "ndesigntemplatemappingcode": inputParam.inputData.designtemplatemapping.ndesigntemplatemappingcode.ndesigntemplatemappingcode, "userinfo": inputParam.inputData.userinfo });
        if (inputParam.inputData["napprovalconfigcode"]) {

            regSubTypeVersionService = rsapi().post("registrationsubtype/getApprovedVersion",
                { napprovalconfigcode: inputParam.inputData.napprovalconfigcode,userinfo: inputParam.inputData.userinfo });

        }
        urlArray = [regSubTypeVersionService, fieldService];
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let dateSubSamLablesNumber = [];
                let dateSubSamLablesComboBox = [];
                let selectedValue = [];
                let data = {};
                let count = 1;
                let dateLablesnumber = [];
                let dateLablescombobox = [];
                if (response[1].data.mappedFields[0].jsondataobj !== null) {
                    response[1].data.mappedFields.map((row) => {
                        let displaynameSampleqty = { "displayname": row.jsondataobj.samplefields.nsampleqty['1'] }
                        let displaynameSubSampleqty = { "displayname": row.jsondataobj.subsamplefields.nsampleqty['1'] }
                        let displaynameSampleunit = { "displayname": row.jsondataobj.samplefields.nunitcode['1'] }
                        let displaynameSubSampleunit = { "displayname": row.jsondataobj.subsamplefields.nunitcode['1'] }
                        const Quantity = { "label": row.jsondataobj.samplefields.nsampleqty['2'], "value": 1, "item": displaynameSampleqty };
                        const Unit = { "label": row.jsondataobj.samplefields.nunitcode['2'], "value": 2, "item": displaynameSampleunit }
                        const SubUnit = { "label": row.jsondataobj.subsamplefields.nunitcode['2'], "value": 3, "item": displaynameSubSampleunit }
                        const SubQuantity = { "label": row.jsondataobj.subsamplefields.nsampleqty['2'], "value": 4, "item": displaynameSubSampleqty }
                        const value = { "Quantity": Quantity, "Unit": Unit, "SubQuantity": SubQuantity, "SubUnit": SubUnit }
                        selectedValue.push(value);
                    });
                }
                const needsubsample = response[0].data.jsondata.nneedsubsample !== undefined ? response[0].data.jsondata.nneedsubsample : false;
                const samplename = inputParam.inputData.designtemplatemapping.ndesigntemplatemappingcode.sregtemplatename;
                const mainSample = inputParam.inputData.designtemplatemapping.ndesigntemplatemappingcode.jsondata;
                const subSample = inputParam.inputData.designtemplatemapping.ndesigntemplatemappingcode.subsamplejsondata;
                mainSample.map((row) => {
                    row.children.map((column) => {
                        column.children.map((component) => {
                            if (component.children) {
                                component.children.map((componentrow) => {
                                    if (componentrow.children) {
                                        if (componentrow.componentname === 'Number') {
                                            data = { "LableName": componentrow.label, "displayvalue": count++, "displayname": componentrow.displayname }
                                            dateLablesnumber.push(data)
                                        }
                                        if (componentrow.componentname === 'Combo Box' || componentrow.componentname === 'Drop Down') {
                                            data = { "LableName": componentrow.label, "displayvalue": count++, "displayname": componentrow.displayname }
                                            dateLablescombobox.push(data)

                                        }
                                    }
                                    else {
                                        if (componentrow.componentname === 'Number') {
                                            data = { "LableName": componentrow.label, "displayvalue": count++, "displayname": componentrow.displayname }
                                            dateLablesnumber.push(data)
                                        }
                                        if (componentrow.componentname === 'Combo Box' || componentrow.componentname === 'Drop Down') {
                                            data = { "LableName": componentrow.label, "displayvalue": count++, "displayname": componentrow.displayname }
                                            dateLablescombobox.push(data)

                                        }
                                    }
                                })
                            } else {
                                if (component.componentname === 'Number') {
                                    data = { "LableName": component.label, "displayvalue": count++, "displayname": component.displayname }
                                    dateLablesnumber.push(data)
                                }
                                if (component.componentname === 'Combo Box' || component.componentname === 'Drop Down') {
                                    data = { "LableName": component.label, "displayvalue": count++, "displayname": component.displayname }
                                    dateLablescombobox.push(data)

                                }
                            }
                        })
                    })
                })
                let countsubsample = 1
                subSample.map((row) => {
                    row.children.map((column) => {
                        column.children.map((component) => {
                            if (component.children) {
                                component.children.map((componentrow) => {
                                    if (componentrow.children) {
                                        if (componentrow.componentname === 'Number') {
                                            data = { "LableName": componentrow.displayname[inputParam.inputData.userinfo.slanguagetypecode], "displayvalue": countsubsample++, "displayname": componentrow.displayname }
                                            dateSubSamLablesNumber.push(data)

                                        }
                                        if (componentrow.componentname === 'Combo Box' || componentrow.componentname === 'Drop Down') {
                                            data = { "LableName": componentrow.displayname[inputParam.inputData.userinfo.slanguagetypecode], "displayvalue": countsubsample++, "displayname": componentrow.displayname }
                                            dateSubSamLablesComboBox.push(data)

                                        }
                                    } else {
                                        if (componentrow.componentname === 'Number') {
                                            data = { "LableName": componentrow.displayname[inputParam.inputData.userinfo.slanguagetypecode], "displayvalue": countsubsample++, "displayname": componentrow.displayname }
                                            dateSubSamLablesNumber.push(data)

                                        }
                                        if (componentrow.componentname === 'Combo Box' || componentrow.componentname === 'Drop Down') {
                                            data = { "LableName": componentrow.displayname[inputParam.inputData.userinfo.slanguagetypecode], "displayvalue": countsubsample++, "displayname": componentrow.displayname }
                                            dateSubSamLablesComboBox.push(data)

                                        }
                                    }
                                })
                            } else {
                                if (component.componentname === 'Number') {
                                    data = { "LableName": component.displayname[inputParam.inputData.userinfo.slanguagetypecode], "displayvalue": countsubsample++, "displayname": component.displayname }
                                    dateSubSamLablesNumber.push(data)
                                }
                                if (component.componentname === 'Combo Box' || component.componentname === 'Drop Down') {
                                    data = { "LableName": component.displayname[inputParam.inputData.userinfo.slanguagetypecode], "displayvalue": countsubsample++, "displayname": component.displayname }
                                    dateSubSamLablesComboBox.push(data)

                                }
                            }
                        })
                    })
                })
                const sample = constructOptionList(dateLablesnumber || [], "displayvalue",
                    "LableName", "displayvalue", undefined, true);
                let SampleTemplateNumber = sample.get("OptionList");
                const sampleCombox = constructOptionList(dateLablescombobox || [], "displayvalue",
                    "LableName", "displayvalue", undefined, true);
                let SampleTemplatecombobox = sampleCombox.get("OptionList");
                const subSampleListNumber = constructOptionList(dateSubSamLablesNumber || [], "displayvalue",
                    "LableName", "displayvalue", undefined, undefined);
                let subSampleTemplateNumber = subSampleListNumber.get("OptionList");
                const subSampleListComboBox = constructOptionList(dateSubSamLablesComboBox || [], "displayvalue",
                    "LableName", "displayvalue", undefined, undefined);
                let subSampleTemplateCombobox = subSampleListComboBox.get("OptionList");
                const value = response[1].data.mappedFields[0].jsondataobj;
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolcode,
                        needsubsample, SampleTemplateNumber, SampleTemplatecombobox,
                        subSampleTemplateNumber, subSampleTemplateCombobox, samplename, needsubsample,
                        selectedValue, selectedRecord: value !== null ? selectedValue[0] : ""
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}

export function auditFieldConfigService(inputParam) {
    return function (dispatch) {
        const fieldService = rsapi().post('designtemplatemapping/getAuditMappedFieldProps',
            {
                designtemplatemapping: inputParam.inputData.designtemplatemapping,
                userinfo: inputParam.inputData.userinfo,
                nregtypecode:inputParam.inputData.nregtypecode,
                nregsubtypecode:inputParam.inputData.nregsubtypecode
            });
        let urlArray = [fieldService];

        if (inputParam.inputData["napprovalconfigcode"]) {
            const regSubTypeVersionService = rsapi().post("registrationsubtype/getApprovedVersion",
                { napprovalconfigcode: inputParam.inputData.napprovalconfigcode,userinfo: inputParam.inputData.userinfo });

            urlArray.push(regSubTypeVersionService);
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let dataResult = {};

                let designData = response[0].data["MappedTemplateFieldProps"].jsondataobj || {};

                const dynamicTable = response[0].data["DynamicAuditRecordTable"] ?
                    Object.keys(response[0].data["DynamicAuditRecordTable"]) : {};
                let auditData = response[0].data["DynamicAuditRecordTable"] || {};

              //  console.log("design:", designData, inputParam.inputData.designtemplatemapping.ndesigntemplatemappingcode);

               // console.log("auditData:", auditData);
                if (inputParam["SampleType"] === SampleType.Masters) {

                    const formcode = Object.keys(auditData)[0];

                    dataResult[formcode] = { "dynamicmaster": [] };

                    //const tableArray = Object.keys(auditData[formcode]) || [];
                    // tableArray.map(item => dataResult[formcode][item] = []);

                    designData.mastertemplatefields.map(field => {
                        (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        //if(!Array.isArray(designData))
                        //  {    
                        dataResult[formcode]["dynamicmaster"].push({
                            //label: field[designProperties.VALUE],
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            sampleauditfields: auditData[formcode]["dynamicmaster"].jsondataobj.auditcapturefields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            sampleauditeditfields: auditData[formcode]["dynamicmaster"].jsondataobj.editmandatoryfields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            realData: field
                        })
                    })
                    designData = {
                        [formcode]: {
                            ...designData, "dynamicmaster": {
                                sampleauditfields: auditData[formcode]["dynamicmaster"].jsondataobj.auditcapturefields,
                                sampleauditeditfields: auditData[formcode]["dynamicmaster"].jsondataobj.editmandatoryfields,
                                multilingualfields: auditData[formcode]["dynamicmaster"].jsondataobj.multilingualfields
                            }
                        }
                    };
                    // designData = {[formcode] : {"dynamicmaster": {...designData, 
                    //                                                 sampleauditeditfields : auditData[formcode]["dynamicmaster"].jsondataobj.editmandatoryfields, 
                    //                                                 multilingualfields:auditData[formcode]["dynamicmaster"].jsondataobj.multilingualfields
                    //                                             }
                    //                                         }};
                    // }
                    //})                                

                }else if(inputParam["SampleType"] === SampleType.GOODSIN){
                    const formcode = Object.keys(auditData)[0];
                    dataResult[formcode] = { "goodsinsample": [] };

                    designData.templatefields.map(field => {
                        (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        dataResult[formcode]["goodsinsample"].push({
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            sampleauditfields: auditData[formcode]["goodsinsample"].jsondataobj.auditcapturefields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            sampleauditeditfields: auditData[formcode]["goodsinsample"].jsondataobj.editmandatoryfields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            realData: field
                        })
                    })

                    designData = {
                        [formcode]: {
                            ...designData, "goodsinsample": {
                                sampleauditfields: auditData[formcode]["goodsinsample"].jsondataobj.auditcapturefields,
                                sampleauditeditfields: auditData[formcode]["goodsinsample"].jsondataobj.editmandatoryfields,
                                multilingualfields: auditData[formcode]["goodsinsample"].jsondataobj.multilingualfields
                            }
                        }
                    };

                }
                //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                else if(inputParam["SampleType"] === SampleType.PROTOCOL){
                    const formcode = Object.keys(auditData)[0];
                    dataResult[formcode] = { "protocol": [] };

                    designData.templatefields.map(field => {
                        (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        dataResult[formcode]["protocol"].push({
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            sampleauditfields: auditData[formcode]["protocol"].jsondataobj.auditcapturefields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            sampleauditeditfields: auditData[formcode]["protocol"].jsondataobj.editmandatoryfields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            realData: field
                        })
                    })

                    designData = {
                        [formcode]: {
                            ...designData, "protocol": {
                                sampleauditfields: auditData[formcode]["protocol"].jsondataobj.auditcapturefields,
                                sampleauditeditfields: auditData[formcode]["protocol"].jsondataobj.editmandatoryfields,
                                multilingualfields: auditData[formcode]["protocol"].jsondataobj.multilingualfields
                            }
                        }
                    };

                }
                else {
                    Object.keys(designData).map(formcode => {
                        if (parseInt(formcode) === formCode.SAMPLEREGISTRATION) {
                            dataResult[formcode] = [];

                            const tableArray = Object.keys(auditData[formcode]) || [];
                            tableArray.map(item => dataResult[formcode][item] = []);

                            designData.sampletemplatefields.map(field => {
                                if (!Array.isArray(designData[formcode]) && field[designProperties.VALUE]!=='sreportno'
                                 && field[designProperties.VALUE]!=='ntestcount'  && (field[designProperties.LISTITEM]!=="label") ) { //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                    dataResult[formcode]["registration"].push({
                                        //label: field[designProperties.VALUE],
                                        label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                        sampleauditfields: auditData[formcode]["registration"].jsondataobj.auditcapturefields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                                        sampleauditeditfields: auditData[formcode]["registration"].jsondataobj.editmandatoryfields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                                        realData: field
                                    })

                                    designData[formcode]["registration"] = { ...designData[formcode]["registration"], sampleauditfields: auditData[formcode]["registration"].jsondataobj.auditcapturefields, multilingualfields: auditData[formcode]["registration"].jsondataobj.auditData };
                                    designData[formcode]["registration"] = { ...designData[formcode]["registration"], sampleauditeditfields: auditData[formcode]["registration"].jsondataobj.editmandatoryfields, multilingualfields: auditData[formcode]["registration"].jsondataobj.multilingualfields };
                                }
                            })

                            if (inputParam.inputData.nneedsubsample) {
                                designData.subsampletemplatefields.map(field => {
                                    if (!Array.isArray(designData[formcode]) && (field[designProperties.LISTITEM]!=="label")) {
                                        dataResult[formcode]["registrationsample"].push({
                                            //label: field[designProperties.VALUE],
                                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                            subsampleauditfields: auditData[formcode]["registrationsample"].jsondataobj.auditcapturefields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                                            subsampleauditeditfields: auditData[formcode]["registrationsample"].jsondataobj.editmandatoryfields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                                            realData: field
                                        })

                                        designData[formcode]["registrationsample"] = { ...designData[formcode]["registrationsample"], subsampleauditfields: auditData[formcode]["registrationsample"].jsondataobj.auditcapturefields, multilingualfields: auditData[formcode]["registrationsample"].jsondataobj.multilingualfields };
                                        designData[formcode]["registrationsample"] = { ...designData[formcode]["registrationsample"], subsampleauditeditfields: auditData[formcode]["registrationsample"].jsondataobj.editmandatoryfields, multilingualfields: auditData[formcode]["registrationsample"].jsondataobj.multilingualfields };
                                    }
                                }
                                )
                            }
                        }

                    })

                }
               // console.log("response[1].data:", designData, "dataResult:", dataResult);

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        auditFieldDesignData: designData,//response[0].data.jsondataobj,
                        approvedRegSubTypeVersion: inputParam.inputData["napprovalconfigcode"] ? response[1].data : undefined,
                        auditFieldDataResult: dataResult,
                        auditData,
                        auditTable: dynamicTable,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolcode
                    }
                });
            })
            .catch(error => {
              //  console.log("error:", error);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}


export function exportFieldConfigService(inputParam) {
    return function (dispatch) {
        const fieldService = rsapi().post('designtemplatemapping/getMappedFieldProps',
            {
                designtemplatemapping: inputParam.inputData.designtemplatemapping,
                userinfo: inputParam.inputData.userinfo
            });
        let urlArray = [fieldService];

        if (inputParam.inputData["napprovalconfigcode"]) {
            const regSubTypeVersionService = rsapi().post("registrationsubtype/getApprovedVersion",
                { napprovalconfigcode: inputParam.inputData.napprovalconfigcode,userinfo: inputParam.inputData.userinfo });

            urlArray.push(regSubTypeVersionService);
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let sampleexportdataResult = {};
                let designData = inputParam.SampleType===SampleType.STABILITY?response[0].data.jsondataobj[formCode.STUDYALLOCATION] || {}
                : response[0].data.jsondataobj[formCode.SAMPLEREGISTRATION] || {};

                if (inputParam["SampleType"] === SampleType.Masters) {
                    sampleexportdataResult['master'] = []
                    response[0].data.jsondataobj.mastertemplatefields.map(field => {
                        (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        sampleexportdataResult['master'].push({
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            sampleexportfields: response[0].data.jsondataobj.masterexportfields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            realData: field
                        })
                    })

                }else if(inputParam["SampleType"] === SampleType.GOODSIN){
                    sampleexportdataResult['master'] = []
                    response[0].data.jsondataobj.nonmandatoryExportFields.map(field => {
                        (field[designProperties.LISTITEM]!=="label") && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        sampleexportdataResult['master'].push({
                            label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                            sampleexportfields: response[0].data.jsondataobj.exportFields.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                          //  sampleexportfields: response[0].data.jsondataobj.exportFields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                            realData: field
                        })
                    })
                } 
                else {
                    sampleexportdataResult['sample'] = []
                    response[0].data.jsondataobj.sampletemplatefields.map(field => {
                        //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        if (field[designProperties.VALUE] !== "sarno" && field[designProperties.VALUE] !== "sspecname" && field[designProperties.VALUE] !==
                            "dregdate" && field[designProperties.VALUE] !== "stransdisplaystatus" && field[designProperties.VALUE]!=="sreportno" 
                            && field[designProperties.VALUE]!=="ntestcount" &&  (field[designProperties.LISTITEM]!=="label")  
                            && response[0].data.jsondataobj.sampletemplatemandatory.findIndex(x => x === field[designProperties.VALUE]) === -1
                            && field[designProperties.LISTITEM]!=="files" 
                            // ALPDJ21-1  Added validation for designProperties.COLUMNDETAILS value in field by Vishakh (02-07-2025)
                            && !(field.hasOwnProperty(designProperties.COLUMNDETAILS) 
                            && field[designProperties.COLUMNDETAILS].hasOwnProperty("readonly") && field[designProperties.COLUMNDETAILS].readonly)) {

                            sampleexportdataResult["sample"].push({
                                label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                sampleexportfields: designData.sampleExportFields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                                realData: field
                            })
                        }
                    })

                    if (inputParam.inputData.nneedsubsample||inputParam.SampleType===SampleType.STABILITY) {
                        sampleexportdataResult['subsample'] = []

                        response[0].data.jsondataobj.subsampletemplatefields.map(field => {

                            if (field[designProperties.VALUE] !== "sarno" && field[designProperties.VALUE] !== "ssamplearno" && field[designProperties.VALUE] !==
                                "stransdisplaystatus" && (field[designProperties.LISTITEM]!=="label")
                                 && field[designProperties.COLUMNDETAILS] &&  !field[designProperties.COLUMNDETAILS].mandatory &&!field[designProperties.COLUMNDETAILS].readonly) {
                                sampleexportdataResult["subsample"].push({
                                    label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                    sampleexportfields: designData.subSampleExportFields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                                    realData: field
                                })
                            }


                        })

                    }
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        designData: response[0].data.jsondataobj,
                        approvedRegSubTypeVersion: inputParam.inputData["napprovalconfigcode"] ?response[1] && response[1].data : undefined,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolcode: inputParam.ncontrolcode, sampleexportdataResult
                    }
                });
            })
            .catch(error => {

                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}


export function configureCheckList(inputParam) {
    return function (dispatch) {
        const fieldService = rsapi().post('designtemplatemapping/getConfigureCheckList',
            {
                ndesigntemplatemappingcode: inputParam.inputData.designtemplatemapping.ndesigntemplatemappingcode,
                userinfo: inputParam.inputData.userinfo
            });
        let urlArray = [fieldService];

        const fieldService1 = rsapi().post('designtemplatemapping/getMappedFieldProps',
            {
                designtemplatemapping: inputParam.inputData.designtemplatemapping,
                userinfo: inputParam.inputData.userinfo
            });
        urlArray.push(fieldService1);


        if (inputParam.inputData["napprovalconfigcode"]) {
            const regSubTypeVersionService = rsapi().post("registrationsubtype/getApprovedVersion",
                { napprovalconfigcode: inputParam.inputData.napprovalconfigcode,userinfo: inputParam.inputData.userinfo });

            urlArray.push(regSubTypeVersionService);
        }



        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const data = response[0].data.ChecklistVersion
                const dataQB = response[0].data.ChecklistVersionQB
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        approvedRegSubTypeVersion: inputParam.inputData["napprovalconfigcode"] ? response[2].data : undefined,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolcode: inputParam.ncontrolcode,
                        checkListData: data,
                        checkListQB: dataQB,
                        designData: response[1].data.jsondataobj,
                    }
                });
            })
            .catch(error => {

                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}





export function getConfigureCheckListLatestVersion(userinfo) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post('designtemplatemapping/getConfigureCheckListLatestVersion',
            {
                userinfo: userinfo
            })
            .then(response => {

                const data = constructOptionList(response.data || [], 'nchecklistversioncode', 'schecklistname').get("OptionList")
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        checkList: data,
                        operation: "configurechecklistadd"
                    }
                });
            })
            .catch(error => {

                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}
export function reportFilterType(inputParam) {
    return function (dispatch) {
        const fieldService = rsapi().post('designtemplatemapping/getMappedFieldProps',
            {
                designtemplatemapping: inputParam.inputData.designtemplatemapping,
                userinfo: inputParam.inputData.userinfo
            });
            const filterFields = rsapi().post('designtemplatemapping/getReleaseSampleFilterFields',
            {
                userinfo: inputParam.inputData.userinfo
            });
        let urlArray = [fieldService,filterFields];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let sampleReportFilterTypeData = {};
                let designData = response[0].data.jsondataobj[formCode.SAMPLEREGISTRATION] || {};
                let designStructure = response[0].data.jsondataobj[formCode.RELEASE] || {};
                let jsonParseList=response[1].data||{};
                let sampleFilterFields=[];

                jsonParseList.map(x=>
                    sampleFilterFields.push(JSON.parse(x.jsondata.value))
                    )

               
                    sampleReportFilterTypeData['sample'] = []
                    let comboValues = []
                    response[0].data.jsondataobj.sampletemplatefields.map(field => {
                    //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                         if (field[designProperties.VALUE] !== "sarno" && field[designProperties.VALUE] !== "sspecname" && field[designProperties.VALUE] !==
                             "dregdate" && field[designProperties.VALUE] !== "stransdisplaystatus" && field[designProperties.VALUE]!=="sreportno" 
                             && field[designProperties.VALUE]!=="ntestcount" &&  (field[designProperties.LISTITEM]!=="label"))
                         {

                                sampleReportFilterTypeData["sample"].push({
                                label: field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode],
                                samplefiltertypefields: designData.samplefiltertypefields && designData.samplefiltertypefields.find(val => val["2"] === field[designProperties.VALUE]) !== undefined,
                                ismandatory: designData.samplefiltertypefields && designData.samplefiltertypefields.find(val => val["2"] === field[designProperties.VALUE] && val["ismandatory"] ) !== undefined,
                                //designData.samplefiltertypefields && designData.samplefiltertypefields.findIndex(x => x === field[designProperties.VALUE]) !== -1,
                                realData: field
                                                        })
                                             
                                    comboValues= field[designProperties.LISTITEM]==="combo" ? {...comboValues,
                                    [field[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode]]:[{"value":-1,"title":'NA'}]}:{...comboValues}
                                    
                                
                       }
                    })
                    sampleFilterFields.map(x=>{
                        sampleReportFilterTypeData["sample"].push({...x,
                            samplefiltertypefields: designData.samplefiltertypefields && designData.samplefiltertypefields.find(val => val["2"] === x.realData[designProperties.VALUE]) !== undefined,
                            ismandatory: designData.samplefiltertypefields && designData.samplefiltertypefields.find(val => val["2"] === x.realData[designProperties.VALUE] && val["ismandatory"] ) !== undefined,
                             })
                             comboValues= x.realData[designProperties.LISTITEM]==="combo" ? {...comboValues,
                                [x.realData[designProperties.LABEL][inputParam.inputData.userinfo.slanguagetypecode]]:[{"value":-1,"title":'NA'}]}:{...comboValues} } );

                    let  extractedColumnList=queryBuilderfillingColumns(sampleReportFilterTypeData["sample"],inputParam.inputData.userinfo.slanguagetypecode)
                    let fields =getFilterConditionsBasedonDataType(extractedColumnList,comboValues);
                    
                    let awesomeTree=  designStructure.defaultstructure && designStructure.defaultstructure.awesomeTree && 
                     checkTree(loadTree(designStructure.defaultstructure.awesomeTree),designStructure.defaultstructure.awesomeConfig) 
                    let filterQueryTreeStr=  designStructure.defaultstructure && designStructure.defaultstructure.filterQueryTreeStr
                    let filterquery=  designStructure.defaultstructure && designStructure.defaultstructure.filterquery
                
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        loading: false,
                        designData: response[0].data.jsondataobj,
                        approvedRegSubTypeVersion: inputParam.inputData["napprovalconfigcode"] ? response[1].data : undefined,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolcode: inputParam.ncontrolcode, sampleReportFilterTypeData,
                        awesomeConfig: designStructure.defaultstructure && designStructure.defaultstructure.awesomeConfig,
                        awesomeTree:awesomeTree,fields,comboValues,isInitialRender:true,extractedColumnList,filterQueryTreeStr,filterquery
                    }
                });
            })
            .catch(error => {

                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
}