import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest, updateStore} from './LoginAction';
import {  sortData } from '../components/CommonScript';
import { intl } from '../components/App';

export function constructGraphView(graphViewData, graphSelectedNode, userInfo, dispatch) {

    let initialNode = {};
    let dataHeight = 2;
    const masterData = graphViewData;
    if (graphSelectedNode === "Site") {
        const selectedOrgSite = masterData.SelectedOrgSite || {};
        const siteDeptList = masterData.SiteDepartment || [];
        const siteDeptArray = [];

        siteDeptList.map((siteDept, i) => {
            dataHeight++
            if (siteDept.nsitecode === selectedOrgSite.nsitecode) {

                const deptLabList = masterData.DepartmentLab || [];
                const deptLabArray = [];

                deptLabList.map((deptLab, j) => {
                    dataHeight++;
                    if (deptLab.nsitedeptcode === siteDept.nsitedeptcode) {
                        const labSectionList = masterData.LabSection || [];
                        const labSectionArray = [];

                        labSectionList.map((labSection, index) => {
                            dataHeight++;
                            if (labSection.ndeptlabcode === deptLab.ndeptlabcode) {
                                const sectionUsersList = masterData.SectionUsers || [];
                                const sectionUserArray = [];
                                sectionUsersList.map((sectionUser, userIndex) => {
                                    dataHeight++;
                                    if (sectionUser.nlabsectioncode === labSection.nlabsectioncode) {
                                        const userNode = sectionUser.susername;
                                        return sectionUserArray.push({
                                            name: userNode.length > 30 ? userNode.substring(0, 30).concat("...") : userNode,
                                            key: "sectionuser_4_" + sectionUser.nsectionusercode,
                                            textProps: { x: -25, y: 10 },
                                            gProps: { className: "userClass", item: sectionUser }
                                        })
                                    }
                                    return null;
                                })
                                const sectionNode = labSection.ssectionname;
                                return labSectionArray.push({
                                    name: sectionNode.length > 30 ? sectionNode.substring(0, 30).concat("...") : sectionNode,
                                    key: "labsection_4_" + labSection.nlabsectioncode,
                                    textProps: { x: -25, y: 10 },
                                    children: sectionUserArray,
                                    gProps: {
                                        className: 'sectionClass', item: labSection,
                                          onClick: () => dispatch(organisationService({inputData:{nlabsectioncode:labSection.nlabsectioncode,
                                                userinfo:userInfo, graphview:true},
                                                selectedtreepath :"", 
                                                selectedNode :"Section",
                                                url:"organisation/getSectionUsers"}))                                         
                                    }

                                })
                            }
                            return null;

                        });
                        
                        const labNode = deptLab.slabname;
                        return deptLabArray.push({
                            name: labNode.length > 30 ? labNode.substring(0, 30).concat("...") : labNode,
                            key: "deptlab_4_" + deptLab.ndeptlabcode,
                            children: labSectionArray,
                            textProps: { x: -25, y: 10 },
                            gProps: {
                                className: 'labClass', item: deptLab,
                                onClick: () => dispatch(organisationService({inputData:{ndeptlabcode:deptLab.ndeptlabcode,
                                                    userinfo:userInfo, graphview:true},
                                                    selectedtreepath :"", 
                                                    selectedNode :"Lab",
                                                    url:"organisation/getLabSection"}))                                    
                            },
                        }
                        )
                    }
                    return null;
                });
                
                const deptNode = siteDept.sdeptname;
                return siteDeptArray.push({
                    name: deptNode.length > 30 ? deptNode.substring(0, 30).concat("...") : deptNode,
                    key: "sitedept_4_" + siteDept.nsitedeptcode,
                    children: deptLabArray,
                    textProps: { x: -25, y: 10 },
                    gProps: {
                        className: 'deptClass', item: siteDept,
                        onClick: () => dispatch(organisationService({inputData:{nsitedeptcode:siteDept.nsitedeptcode,
                                                userinfo:userInfo, graphview:true},
                                                selectedtreepath :"", 
                                                selectedNode :"Department",
                                                url:"organisation/getDepartmentLab"}))
                        
                    },
                })
            };

            return null;
        });

        initialNode = {
            name: selectedOrgSite && selectedOrgSite.ssitename,
            key: "selectedOrgSite_4_" + selectedOrgSite.nsitecode,
            children: siteDeptArray,
            textProps: { x: 0, y: 10 },
            gProps: {
                className: 'siteClass',
                onClick: () => dispatch(organisationService({inputData:{nsitecode:selectedOrgSite.nsitecode,
                                                userinfo:userInfo, graphview:true},
                                                 selectedtreepath :"",
                                                 selectedNode:"Site",
                                                 url:"organisation/getSiteDepartment"}))                        
                            
            }
        };
    }
    else if (graphSelectedNode === "Department") {
        const selectedSiteDepartment = masterData.SelectedSiteDepartment || {};

        const deptLabList = masterData.DepartmentLab || [];
        const deptLabArray = [];

        deptLabList.map((deptLab, j) => {
            dataHeight++;
            if (deptLab.nsitedeptcode === selectedSiteDepartment.nsitedeptcode) {
                const labSectionList = masterData.LabSection || [];
                const labSectionArray = [];

                labSectionList.map((labSection, index) => {
                    dataHeight++;
                    if (labSection.ndeptlabcode === deptLab.ndeptlabcode) {
                        const sectionUsersList = masterData.SectionUsers || [];
                        const sectionUserArray = [];
                        sectionUsersList.map((sectionUser, userIndex) => {
                            dataHeight++;
                            if (sectionUser.nlabsectioncode === labSection.nlabsectioncode) {
                                const userNode = sectionUser.susername;
                                return sectionUserArray.push({
                                    name: userNode.length > 30 ? userNode.substring(0, 30).concat("...") : userNode,
                                    key: "sectionuser_4_" + sectionUser.nsectionusercode,
                                    textProps: { x: -25, y: 10 },
                                    gProps: { className: "userClass", item: sectionUser }
                                })
                            }

                            return null;
                        })
                        const sectionNode = labSection.ssectionname;

                        return labSectionArray.push({
                            name: sectionNode.length > 30 ? sectionNode.substring(0, 30).concat("...") : sectionNode,
                            key: "labsection_3_" + labSection.nlabsectioncode,
                            textProps: { x: -25, y: 25 },
                            children: sectionUserArray,
                            gProps: {
                                className: 'sectionClass', item: labSection,
                                  onClick: () => 
                                    dispatch(organisationService({inputData:{nlabsectioncode:labSection.nlabsectioncode,
                                            userinfo:userInfo, graphview:true},
                                            selectedtreepath :"", 
                                            selectedNode :"Section",
                                            url:"organisation/getSectionUsers"}))                                 
                            }
                        })
                    }
                    return null;

                });
                                   
                const labNode = deptLab.slabname;
                return deptLabArray.push({
                    name: labNode.length > 30 ? labNode.substring(0, 30).concat("...") : labNode,
                    key: "deptlab_3_" + deptLab.ndeptlabcode,
                    children: labSectionArray,
                    textProps: { x: -25, y: 25 },
                    gProps: {
                        className: 'labClass', item: deptLab,
                        onClick: () => dispatch(organisationService({inputData:{ndeptlabcode:deptLab.ndeptlabcode,
                                    userinfo:userInfo, graphview:true},
                                    selectedtreepath :"", 
                                    selectedNode :"Lab",
                                    url:"organisation/getLabSection"}))                      
                    },
                })
            }
            return null;
        });

        const deptNode = selectedSiteDepartment.sdeptname;

        initialNode = {
            name: deptNode,
            key: 'selectedSiteDepartment_3_' + selectedSiteDepartment.nsitedeptcode,
            children: deptLabArray,
            textProps: { x: 0, y: 25 },
            gProps: { className: 'deptClass' },
        };
    }
    else if (graphSelectedNode === "Lab") {

        const selectedDepartmentLab = masterData.SelectedDepartmentLab || {};
        const labSectionList = masterData.LabSection || [];
        const labSectionArray = [];

        labSectionList.map((labSection, index) => {
            dataHeight++;
            if (labSection.ndeptlabcode === selectedDepartmentLab.ndeptlabcode) {
                const sectionUsersList = masterData.SectionUsers || [];
                const sectionUserArray = [];
                sectionUsersList.map((sectionUser, userIndex) => {
                    dataHeight++;
                    if (sectionUser.nlabsectioncode === labSection.nlabsectioncode) {
                        const userNode = sectionUser.susername;

                        return sectionUserArray.push({
                            name: userNode.length > 30 ? userNode.substring(0, 30).concat("...") : userNode,
                            key: "sectionuser_2_" + sectionUser.nsectionusercode,
                            textProps: { x: -25, y: 25 },
                            gProps: { className: "userClass", item: sectionUser }
                        })
                    }
                    return null;
                })
                const sectionNode = labSection.ssectionname;

                return labSectionArray.push({
                    name: sectionNode.length > 30 ? sectionNode.substring(0, 30).concat("...") : sectionNode,
                    key: "labsection_2_" + labSection.nlabsectioncode,
                    textProps: { x: -25, y: 25 },
                    children: sectionUserArray,
                    gProps: {
                        className: 'sectionClass', item: labSection,
                          onClick: () =>  dispatch(organisationService({inputData:{nlabsectioncode:labSection.nlabsectioncode,
                                    userinfo:userInfo, graphview:true},
                                    selectedtreepath :"", 
                                    selectedNode :"Section",
                                    url:"organisation/getSectionUsers"}))
                    }
                })
            }
            return null;

        });
        const labNode = selectedDepartmentLab.slabname;

        initialNode = {
            name: labNode,
            key: 'deptlab_2_' + selectedDepartmentLab.ndeptlabcode,
            children: labSectionArray,
            textProps: { x: 0, y: 25 },
            gProps: { className: 'deptClass' },
        };

    }
    else if (graphSelectedNode === "Section") {

        const selectedLabSection = masterData.SelectedLabSection || {};

        const sectionUsersList = masterData.SectionUsers || [];
        const sectionUserArray = [];
        sectionUsersList.map((sectionUser, userIndex) => {
            dataHeight++;
            if (sectionUser.nlabsectioncode === selectedLabSection.nlabsectioncode) {
               const userNode = sectionUser.susername;
               return sectionUserArray.push({
                    name: userNode.length > 30 ? userNode.substring(0, 30).concat("...") : userNode,
                    key: "sectionuser_1_" + sectionUser.nsectionusercode,
                    textProps: { x: -25, y: 25 },
                    gProps: { className: "userClass", item: sectionUser }
                })
            }
            return null;
        })
        const sectionNode = selectedLabSection.ssectionname;

        initialNode = {
            name: sectionNode,
            key: "labSection_1_" + selectedLabSection.nlabsectioncode,
            children: sectionUserArray,
            textProps: { x: 0, y: 25 },
            gProps: { className: 'deptClass' },
        };

    }
    const graphData = {initialNode, dataHeight};
    return graphData;
}


export function organisationService(methodParam){
    return function (dispatch) {  
    dispatch(initRequest(true));
    return rsapi().post(methodParam.url, methodParam.inputData)
    .then(response=>{       
                   
            if (methodParam.inputData.graphview === true){               
                   
                const updateInfo = { typeName: DEFAULT_RETURN,
                                     data: { openModal:false}
                                   };
                dispatch(updateStore(updateInfo));

                const data = {...response.data};   
                
                const graphData = constructGraphView(data,methodParam.selectedNode, methodParam.inputData.userinfo, dispatch);
                dispatch({type: DEFAULT_RETURN, payload:{   graphData:graphData["initialNode"],
                                                            graphHeight :graphData["dataHeight"],
                                                            graphSelectedNode:methodParam.selectedNode,
                                                            loading:false, 
                                                            graphView: data.GraphView,
                                                            openModal:true
                                                        }});                   
            }
            else{
                const masterData = {...methodParam.masterData, ...response.data};
                sortData(masterData);  

                dispatch({type: DEFAULT_RETURN, payload:{masterData,
                                                            organisation :methodParam.organisation,
                                                            data:undefined, dataState:undefined,
                                                            //selectedTreePath :methodParam.inputData.selectedtreepath,
                                                            loading:false,// treeData:site
                                                            graphView:false
                                                        }});
            }                      
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
               } else if (error.response.status === 500){
                toast.error(error.message);
            } 
            else{               
                toast.warn(error.response.data);
            }  
        })        
    }
}

export function getOrganisationComboService(methodParam) {            
    return function (dispatch) {  
    dispatch(initRequest(true));
    return rsapi().post(methodParam.url, methodParam.inputData)
    .then(response=>{                  
        const respObject = {};
        if (methodParam.organisation){
            respObject["organisation"] = methodParam.organisation
        }
        //const index = methodParam.columnList.findIndex(item=>item.controlType === "selectbox")
        // const selected = methodParam.selectedRecord;

        // const foundIndex = response.data.findIndex(
        //     x => x["ndefaultstatus"] === transactionStatus.YES);
        // const defaultStatus =  response.data[foundIndex] ;
        // selected[methodParam.columnList[index].dataField] = defaultStatus;

        // const dataMap = constructOptionList(response.data || [],methodParam.columnList[index].optionId, 
        //     methodParam.columnList[index].optionValue, undefined, undefined, true) ;
        // const dataList = dataMap.get("OptionList");
        // const selected = methodParam.selectedRecord;
        // if (dataMap.get("DefaultValue") !== undefined){
        //     selected[methodParam.columnList[index].dataField] = [dataMap.get("DefaultValue")];
        // }
            dispatch({type: DEFAULT_RETURN, payload:{...respObject,
                        [methodParam.listName]:response.data || [],                               
                        operation:methodParam.operation, 
                        screenName:methodParam.screenName, 
                        selectedRecord:methodParam.selectedRecord, 
                        openModal : true,
                        ncontrolCode:methodParam.ncontrolCode,
                        loading:false, graphView:false
                    }});
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
               } else if (error.response.status === 500){
                toast.error(error.message);
            } 
            else{               
                toast.warn(error.response.data);
            }  
        })        
    }
}

export function getSectionUserRole (methodParam) {            
    return function (dispatch) {  
    dispatch(initRequest(true));
    return rsapi().post("organisation/getSectionUserRole", 
                                    {nsitecode:methodParam.nsitecode, nusercode:methodParam.primaryKeyValue,
                                    userinfo:methodParam.userInfo})
    .then(response=>{ 
            let userRoleMap = methodParam.masterData.userRoleMap || new Map();           
            userRoleMap.set(parseInt(Object.keys(response.data["SectionUserRoleMap"])[0]), Object.values(response.data["SectionUserRoleMap"])[0]);
            const masterData = {...methodParam.masterData, userRoleMap};
            sortData(masterData);
            dispatch({type: DEFAULT_RETURN, payload:{masterData,
                        data: methodParam.data, userRoleMap,
                        dataState:methodParam.dataState,
                        loading:false
                    }});
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
               } else if (error.response.status === 500){
                toast.error(error.message);
            } 
            else{               
                toast.warn(error.response.data);
            }  
        })        
    }
}

// export function reloadTreeData (methodParam) {            
//     return function (dispatch) {  
//     const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { masterData:{}, organisation:undefined,}
//         }
//     dispatch(updateStore(updateInfo))
//     dispatch(callService(methodParam))
         
//     }
// }