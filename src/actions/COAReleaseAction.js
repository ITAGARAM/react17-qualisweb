import { toast } from "react-toastify";
import { intl } from "../components/App";
import { constructOptionList, replaceUpdatedObject, sortData } from "../components/CommonScript";
import { reportCOAType, REPORTTYPE } from "../components/Enumeration";
import rsapi from "../rsapi";
import { initRequest } from "./LoginAction";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";

export function getSubSampleBySample(methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("coarelease/getSubSampleBySample",
            {
                nsitecode: methodParam.nsitecode, npreregno: methodParam.primaryKeyValue,
                userinfo: methodParam.userInfo
            })
            .then(response => {
                // let releaseSubSample = response.data["ReleaseSubSample"];  
                let releaseSubSample = methodParam.masterData.releaseSubSample || new Map();

                releaseSubSample.set(parseInt(Object.keys(response.data["ReleaseSubSample"])[0]), Object.values(response.data["ReleaseSubSample"])[0]);
                let masterData = { ...methodParam.masterData, releaseSubSample, ...response.data };

                //  sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        data: methodParam.data, releaseSubSample,
                        dataState: methodParam.dataState,
                        loading: false
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

export function getReleaseSelectedSamples(userInfo, controlId, selectedSampleData, data, flag) {
    let npreregno = "";
    selectedSampleData.map((item, i) => {
        let s = "";
        npreregno = npreregno + item.npreregno;
        if (i < selectedSampleData.length) {
            if (i < selectedSampleData.length - 1) {
                s = ",";
            }
            npreregno = npreregno + s;
        }
        else {
            npreregno = item.npreregno;
        }
    })
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("coarelease/updateReleasedSample",
            {
                npreregno: npreregno,
                nregtypecode: selectedSampleData[0].nregtypecode,
                nregsubtypecode: selectedSampleData[0].nregsubtypecode,
                userinfo: userInfo
            })
            .then(response => {
                // let releaseSubSample =response.data["ReleaseSample"];           
                let masterData = { ...data, ...response.data };

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        data: response.data,
                        loading: false
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
export function getReleaseSelectedSubSamples(userInfo, controlId, selectedSubSampleData, data, flag) {
    let ntransactionsamplecode = ""
    let npreregno = ""

    selectedSubSampleData.map((item, i) => {
        let s = ""
        ntransactionsamplecode = ntransactionsamplecode + item.ntransactionsamplecode;
        npreregno = npreregno + item.npreregno;

        if (i < selectedSubSampleData.length) {
            if (i < selectedSubSampleData.length - 1) {
                s = ","
            }
            ntransactionsamplecode = ntransactionsamplecode + s;
            npreregno = npreregno + s;

        }
        else {
            ntransactionsamplecode = item.ntransactionsamplecode;
            npreregno = item.npreregno;

        }
    })
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("coarelease/updateReleasedSubSample",
            {

                npreregno: npreregno,
                ntransactionsamplecode: ntransactionsamplecode,

                userinfo: userInfo
            })

            .then(response => {
                // let releaseSubSample =response.data["ReleaseSample"];           
                let masterData = { ...data, ...response.data };

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        data: response.data,
                        loading: false
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
export function getTestBySample(methodParam, kjkj) {

    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("coarelease/getTestBySample",
            {
                nsitecode: methodParam.nsitecode, npreregno: methodParam.viewRow.npreregno,
                ntransactionsamplecode: methodParam.viewRow.ntransactionsamplecode,
                userinfo: methodParam.userInfo
            })
            .then(response => {
                let releaseTest = methodParam.masterData.releaseTest || new Map();
                releaseTest.set(parseInt(Object.keys(response.data["ReleaseTest"])[0]), Object.values(response.data["ReleaseTest"])[0]);
                let masterData = { ...methodParam.masterData, releaseTest, ...response.data };

                //  sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        data: methodParam.data,
                        releaseTest,
                        dataState: methodParam.dataState,
                        loading: false
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
export function getReleaseSelectedTest(userInfo, controlId, selectedTestData, data, flag) {
    let ntransactionsamplecode = ""
    let npreregno = ""
    let ntransactiontestcode = ""

    selectedTestData.map((item, i) => {
        let s = ""
        ntransactionsamplecode = ntransactionsamplecode + item.ntransactionsamplecode;
        npreregno = npreregno + item.npreregno;
        ntransactiontestcode = ntransactiontestcode + item.ntransactiontestcode;

        if (i < selectedTestData.length) {
            if (i < selectedTestData.length - 1) {
                s = ","
            }
            ntransactionsamplecode = ntransactionsamplecode + s;
            npreregno = npreregno + s;
            ntransactiontestcode = ntransactiontestcode + s;

        }
        else {
            ntransactionsamplecode = item.ntransactionsamplecode;
            npreregno = item.npreregno;
            ntransactiontestcode = item.ntransactiontestcode;

        }
    })
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("coarelease/updateReleasedTest",
            {

                npreregno: npreregno,
                ntransactionsamplecode: ntransactionsamplecode,
                ntransactiontestcode: ntransactiontestcode,

                userinfo: userInfo
            })

            .then(response => {
                // let releaseSubSample =response.data["ReleaseSample"];           
                let masterData = { ...data, ...response.data };

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        data: response.data,
                        loading: false
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
// export function getReleaseSelectedSampleSubSampleTest(userInfo, control, SampleArray1, SubSampleArray1, TestArray1,SampleArray,SubSampleArray,TestArray,Data1,k) {    
//    let ntransactionsamplecode = ""
//    let npreregno = ""
//     let ntransactiontestcode = "" 
//     let bFlag = "" 
//     if (TestArray !== undefined) {
//         TestArray.map(test => {
//             ntransactionsamplecode += test.ntransactionsamplecode + ',';
//             npreregno += test.npreregno + ',';
//             ntransactiontestcode += test.ntransactiontestcode + ',';
//         })
//         TestArray = {
//             ntransactionsamplecode: ntransactionsamplecode,
//             npreregno: npreregno,
//             ntransactiontestcode: ntransactiontestcode,
//             bFlag:"3"

//         }
//     }   
//     if (SubSampleArray !== undefined) {
//         SubSampleArray.map(SubSample => {
//             ntransactionsamplecode += SubSample.ntransactionsamplecode + ',';
//             npreregno += SubSample.npreregno + ',';
//             ntransactiontestcode += SubSample.ntransactiontestcode + ',';
//             SubSampleArray = {
//                 ntransactionsamplecode: ntransactionsamplecode,
//                 npreregno: npreregno,
//                 ntransactiontestcode: ntransactiontestcode,
//                 bFlag:"2"

//             }
//         })
//     }
//     if (SampleArray !== undefined) {

//         SampleArray.map(Sample => {
//             ntransactionsamplecode += Sample.ntransactionsamplecode + ',';
//             npreregno += Sample.npreregno + ',';
//             ntransactiontestcode += Sample.ntransactiontestcode + ',';

//         })
//         SampleArray = {
//             ntransactionsamplecode: ntransactionsamplecode,
//             npreregno: npreregno,
//             ntransactiontestcode: ntransactiontestcode,
//             bFlag:"1"

//         }
//     }
//     let allNpreregno = []
//     if (SampleArray1 !== undefined) {

//         SampleArray1.map(temp => {
//             allNpreregno += temp + ','
//         })
//     }
//     let allNtransactionsamplecode = []
//     if (SubSampleArray1 !== undefined) {

//         SubSampleArray1.map(temp => {
//             allNtransactionsamplecode += temp + ','
//         })
//     }
//     let allNtransactiontestcode = []
//     if (TestArray1 !== undefined) {

//         TestArray1.map(temp => {
//             allNtransactiontestcode += temp + ','
//         })
//     }

//     return function (dispatch) {  
//     dispatch(initRequest(true));
//     return rsapi().post("coarelease/updateStatus", 
//         {
//             SampleArray:SampleArray,
//             SubSampleArray:SubSampleArray,
//             TestArray: TestArray,
//             userinfo: userInfo,
//             allNtransactionsamplecode: allNtransactionsamplecode,
//             allNtransactiontestcode: allNtransactiontestcode,
//             allNpreregno:allNpreregno
//         })
//     .then(response=>{ 
//        // let releaseSubSample = response.data["ReleaseSubSample"];  
//        let releaseSubSample = Data1.releaseSubSample || new Map();           
//        let releaseTest = Data1.releaseTest || new Map();           
//        releaseSubSample = Data1.releaseSubSample || new Map();           

//              releaseTest = Data1.releaseTest || new Map();
// if(response.data.body["cFlag"]==="3"){
//             releaseTest.set(parseInt(Object.keys(response.data.body["ReleaseTest"])[0]), Object.values(response.data.body["ReleaseTest"])[0]);
//        }
//       //  else {
//         if(response.data.body["cFlag"]==="2"){


//             releaseSubSample.set(parseInt(Object.keys(response.data.body["ReleaseSubSample"])[0]), Object.values(response.data.body["ReleaseSubSample"])[0]);

//         }
//         let masterData = { ...Data1, releaseSubSample,releaseTest,...response.data.body};

//             sortData(masterData);
//             dispatch({type: DEFAULT_RETURN, payload:{masterData,
//                 data:releaseSubSample,releaseTest,
//                       //  dataState:dataState,
//                         loading:false
//                     }});
//         })
//         .catch(error=>{
//             dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//             if (error.response?.status === 429) {
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
//            
//          });
//        } else if (error.response.status === 500){
//                 toast.error(error.message);
//             } 
//             else{               
//                 toast.warn(error.response.data);
//             }  
//         })        
//     }
// }
export function getReleaseSelectedSampleSubSampleTest(userInfo, Data1, inputData) {


    return function (dispatch) {
      if (inputData !== undefined &&inputData.npreregno!=="") {

        dispatch(initRequest(true));
        return rsapi().post("coarelease/updateStatus",

            inputData
        )
            .then(response => {
                if (response.data.statusCodeValue !== 200) {
                    toast.warn(intl.formatMessage({
                        id: response.data.body
                    }));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        }
                    });


                }
                else {
                    let selected = []
                    let expanded = []
                    let testdata = []
                    let subsampleData = []
                    let subsampleexpanded = []
                    let subsampleselected = []
                    let subsampleDataRes = []
                   // let y = []
                   // let a = []
                    // let SubSample = Object.values(Data1.ReleaseSubSample).forEach(item1 => {
                    //     item1.map(item2 => {
                    //         subsampleData.push(item2)
                    //         if (item2.expanded === true) {
                    //             subsampleexpanded.push({ "ntransactionsamplecode": item2.ntransactionsamplecode, "expanded": item2.expanded })
                    //         }
                    //         if (item2.selected === true) {
                    //             subsampleselected.push({ "ntransactionsamplecode": item2.ntransactionsamplecode, "selected": item2.selected })
                    //         }

                    //     })
                    // });
                    // let SubSampleRes = Object.values(response.data.body.ReleaseSubSample).forEach(item1 => {
                    //     item1.map(item2 => {
                    //         subsampleDataRes.push(item2)
                    //         subsampleexpanded.map(item1 => {
                    //             if (item1.ntransactionsamplecode === item2.ntransactionsamplecode) {
                    //                 item2["expanded"] = true
                    //             }
                    //         })
                    //         subsampleselected.map(item1 => {
                    //             if (item1.ntransactionsamplecode === item2.ntransactionsamplecode) {
                    //                 item2["selected"] = true
                    //             }
                    //         })
                    //     })
                    // });
                    let testDataRes = []
                    let testDataPrevious = []
                    // let testDataSelected = []
                    // let testDataExpanded = []
                    // testDataSelected = Object.values(Data1.ReleaseTest).forEach(item1 => {
                    //     item1.map(item2 => {
                    //         testDataPrevious.push(item2)
                    //         if (item2.selected === true) {
                    //             testdata.push({ "ntransactiontestcode": item2.ntransactiontestcode })
                    //         }
                    //     })
                    // });
                    // testDataExpanded = Object.values(response.data.body.ReleaseTest||{}).forEach(item1 => {
                    //     item1.map(item2 => {
                    //         testDataRes.push(item2)

                    //         testdata.map(x => {
                    //             if (item2.ntransactiontestcode === x.ntransactiontestcode) {
                    //                 item2["selected"] = true
                    //             }
                    //         })
                    //     })
                    // });
                    let ReleaseTest = replaceUpdatedObject(testDataRes, testDataPrevious, 'ntransactiontestcode');
                    let ReleaseTest1 = groupBy(ReleaseTest, 'ntransactionsamplecode');
                    let ReleaseSubSample = replaceUpdatedObject(subsampleDataRes, subsampleData, 'ntransactionsamplecode');
                    let ReleaseSubSample1 = groupBy(ReleaseSubSample, 'npreregno');

                    function groupBy(objectArray, property) {
                        return objectArray.reduce((acc, obj) => {
                            const key = obj[property];
                            if (!acc[key]) {
                                acc[key] = [];
                            }
                            acc[key].push(obj);
                            return acc;
                        }, {});
                    }
                    // Data1.ReleaseSample.map(item => {
                    //     delete item["expanded"]
                    // });
                    Data1.ReleaseSample.map(item2 => {
                        if (item2.expanded === true) {
                            expanded.push({ "npreregno": item2.npreregno, "expanded": item2.expanded })
                        }
                        if (item2.selected === true) {
                            selected.push({ "npreregno": item2.npreregno, "selected": item2.selected })
                        }
                    })
                    response.data.body.ReleaseSample&&response.data.body.ReleaseSample.map(item2 => {
                        expanded.map(item1 => {
                            if (item1.npreregno === item2.npreregno) {
                                item2["expanded"] = true
                            }
                        })
                        selected.map(item1 => {
                            if (item1.npreregno === item2.npreregno) {
                                item2["selected"] = true
                            }
                        })

                    })

                    let masterData = {

                        ...Data1, ...response.data.body,
                        ReleaseTest: ReleaseTest1,
                        ReleaseSubSample: ReleaseSubSample1,

                        ReleaseSample: replaceUpdatedObject(response.data.body.ReleaseSample, Data1.ReleaseSample, 'npreregno'),


                    };

                    // sortData(masterData);
                  //  dispatch(generateReport(inputData,masterData))

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            checkedflag:false,
                            change: inputData.change,
                            loading: false
                        }
                    });
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
        else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTANYONESAMPLE/SUBSAMPLE/TEST"
            }));
        }
    }
}
export function getReleaseRegistrationType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("coarelease/getRegistrationType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            SampleTypeValue: inputData.SampleTypeValue
                        },
                        loading: false
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
export function getReleaseRegistrationSubType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("coarelease/getRegistrationSubType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegTypeValue: inputData.RegTypeValue
                        },
                        loading: false
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
export function getReleaseFilterStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("coarelease/getFilterStatus", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegSubTypeValue: inputData.RegSubTypeValue
                        },
                        loading: false
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

export function getReleaseFilterBasedTest(inputData) {
    return function (dispatch) {
        if (inputData.napprovalversioncode) {
            dispatch(initRequest(true));
            rsapi().post("coarelease/getFilterBasedTest", inputData)
                .then(response => {


                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...inputData.masterData,
                                ...responseData,
                                RegSubTypeValue: inputData.RegSubTypeValue,
                                ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
                                DesignTemplateMappingValue: inputData.DesignTemplateMappingValue
                            },
                            loading: false
                        }
                    })
                    if (response.data.rtn) {
                        toast.warn(response.data.rtn);
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
        else {
            toast.warn(intl.formatMessage({
                id: "IDS_PLSSELECTALLVALUESINFILTER"
            }));
        }
    }

}

export function getReleaseApprovalVersion(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("coarelease/getApprovalVersion", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            // fromDate: inputParam.inputData.dfrom,
                            // toDate: inputParam.inputData.dto,
                        },
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
export function getReleaseSample(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("coarelease/getReleaseSample", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                // responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchSampleRef !== undefined && inputParam.searchSampleRef.current !== null) {
                    inputParam.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null) {
                    inputParam.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null) {
                    inputParam.searchTestRef.current.value = ""
                    // masterData['searchedTest'] = undefined
                    masterData['searchedTests'] = undefined

                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        take: inputParam.take,
                        testskip: 0,
                        testtake: inputParam.testtake,
                        resultDataState: { ...inputParam.resultDataState, sort: undefined, filter: undefined },
                        instrumentDataState: { ...inputParam.instrumentDataState, sort: undefined, filter: undefined },
                        materialDataState: { ...inputParam.materialDataState, sort: undefined, filter: undefined },
                        taskDataState: { ...inputParam.taskDataState, sort: undefined, filter: undefined },
                        documentDataState: { ...inputParam.documentDataState, sort: undefined, filter: undefined },
                        resultChangeDataState: { ...inputParam.resultChangeDataState, sort: undefined, filter: undefined },
                        testCommentDataState: { ...inputParam.testCommentDataState, sort: undefined, filter: undefined },
                        historyDataState: { ...inputParam.historyDataState, sort: undefined, filter: undefined },
                        samplePrintHistoryDataState: { ...inputParam.samplePrintHistoryDataState, sort: undefined, filter: undefined },
                        sampleHistoryDataState: { ...inputParam.sampleHistoryDataState, sort: undefined, filter: undefined },
                        checkedflag:false,
                        npreregno:[]
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
export function getCOAReportType(releaseParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("coarelease/getCOAReportType", {userinfo: releaseParam.userInfo })
            .then(response => {
                let reportType = [];

                const reportTypeMap = constructOptionList(response.data.ReportType || [], "ncoareporttypecode",
                    "scoareporttypename", undefined, undefined, false);

                const ReportTypeList = reportTypeMap.get("OptionList");
                let selectedRecord = {"ncoareporttypecode": {
                    "value": response.data.ReportType[0].ncoareporttypecode,
                     "label": response.data.ReportType[0].scoareporttypename
                 }};
                
                dispatch({
                    type: DEFAULT_RETURN,
                     payload: {
                        operation: null, modalName: undefined,
                        loading: false, dataState: undefined//,modalShow: true
                        ,ReportTypeList
                        ,modalTitle:"IDS_RELEASEANDREPORTGENERATION"
                       ,selectedRecord

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
export function generateReport(inputParam,Data) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const inputData = {
            npreregno: inputParam.npreregno,
         //   nsectioncode: inputParam.nsectioncode || -1,
            userinfo: inputParam.userinfo,
            nprimarykey: inputParam.npreregno,
            ncoareporttypecode: reportCOAType.SAMPLEWISE,
            nreporttypecode: REPORTTYPE.COAREPORT,
            sprimarykeyname: "npreregno",
            ncontrolcode: inputParam.ncontrolCode,
            nregtypecode: inputParam.nregtypecode,
            nregsubtypecode: inputParam.nregsubtypecode,
            ntransactiontestcode:inputParam.ntransactiontestcode,
            napproveconfversioncode: inputParam.napprovalversioncode,
            action:inputParam.action
        }
        rsapi().post("approval/generateCOAReport", inputData)
            .then(response => {

                if (response.data.rtn === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data.filepath);
                    document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }
               
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false,change: inputParam.change,masterData:Data,
                    modalShow: false, selectedRecord: {}, loadEsign: false } })
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