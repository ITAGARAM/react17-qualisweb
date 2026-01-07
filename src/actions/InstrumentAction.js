import rsapi from '../rsapi';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import {
    sortData,
    constructOptionList,
    rearrangeDateFormat, getRecordBasedOnPrimaryKeyName   	//added by sujatha ALPDJ21-21 
} from '../components/CommonScript';
import Axios from 'axios';
import {
    initRequest
} from './LoginAction';
import {
    intl
} from '../components/App';
import {
    toast
} from 'react-toastify';
import {
    transactionStatus,
    attachmentType
} from "../components/Enumeration";

export function getInstrumentCombo(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        if ( masterData.SelectedInsCat !== undefined) {
            let check=true;
            if(operation==="update"){
                if(masterData.selectedInstrument.ninstrumentstatus===transactionStatus.Disposed){
                    check=false
            }}
            if(check){
        let urlArray = [];
        const InstrumentCategory = rsapi().post("/instrumentcategory/fetchinstrumentcategory", {
            "userinfo": userInfo
        });
        const Supplier = rsapi().post("/instrument/getSupplier", {
            "userinfo": userInfo
        });
        const Manufacturer = rsapi().post("/instrument/getManufacturer", {
            "userinfo": userInfo
        });
        const InstrumentStatus = rsapi().post("/instrument/getInstrumentStatus", {
            "userinfo": userInfo
        });
        // ALPD-5330 - Gowtham R - Default Section not loaded initially
        const Lab = rsapi().post("/instrument/getSection", {
            "userinfo": userInfo
        });
        const Period = rsapi().post("/period/getPeriodByControl", {
            "ncontrolcode": ncontrolCode,
            "userinfo": userInfo
        });
        const timeZoneService = rsapi().post("timezone/getTimeZone");

        const Instrumentdate = rsapi().post("/instrument/addInstrumentDate", {
            "ncontrolcode": ncontrolCode,
            "userinfo": userInfo
        });
        const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: userInfo
        });
        const validationStatus = rsapi().post("instrument/getInstrumentValidationStatus", {
            "userinfo": userInfo
        });
        const calibrationStatus = rsapi().post("instrument/getInstrumentCalibrationStatus", {
            "userinfo": userInfo
        });
        const maintenanceStatus = rsapi().post("instrument/getInstrumentMaintenanceStatus", {
            "userinfo": userInfo
        });
        const calibrationRequired =rsapi().post("instrument/getCalibrationRequired",{
            "ninstrumentcatcode":masterData.SelectedInsCat.ninstrumentcatcode,
            userinfo:userInfo
        });
        const siteService = rsapi().post("site/getSite",{userinfo:userInfo});
        const InstrumentName = rsapi().post("/instrument/getInstrumentName", {
            "userinfo": userInfo
        });
        const InstrumentLocation = rsapi().post("/instrument/getInstrumentLocation", {
            "userinfo": userInfo
        });
        if (operation === "create") {
            urlArray = [InstrumentCategory, Supplier, Manufacturer, InstrumentStatus, Lab, Period, timeZoneService, Instrumentdate, UTCtimeZoneService,validationStatus,calibrationStatus,maintenanceStatus,calibrationRequired,siteService,InstrumentName,InstrumentLocation];

        } else {
            const InstrumentId = rsapi().post("/instrument/getActiveInstrumentById", {
                [primaryKeyName]: masterData.selectedInstrument[primaryKeyName],
                "userinfo": userInfo
            });
            const ValidateInst = rsapi().post("/instrument/validateOpenDate", {
                [primaryKeyName]: masterData.selectedInstrument[primaryKeyName],
                "userinfo": userInfo
            });
            //const ManufacturerByID = rsapi().post("/manufacturer/getManufacturerById", { [primaryKeyName] :masterData.selectedManufacturer[primaryKeyName], "userinfo": userInfo });
            urlArray = [InstrumentCategory, Supplier, Manufacturer, InstrumentStatus, Lab, Period, timeZoneService, InstrumentId, Instrumentdate, UTCtimeZoneService,siteService,ValidateInst,InstrumentName,InstrumentLocation, calibrationRequired];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                let expiryDate = undefined;
                let currentTime = undefined;
                let validateOpenDate=false;
                let insLocationMap=[];
                const instcatMap = constructOptionList(response[0].data || [], "ninstrumentcatcode",
                    "sinstrumentcatname", undefined, undefined, false);

                const supplierMap = constructOptionList(response[1].data.Supplier || [], "nsuppliercode",
                    "ssuppliername", undefined, undefined, false);

                const manufMap = constructOptionList(response[2].data.Manufacturer || [], "nmanufcode",
                    "smanufname", undefined, undefined, false);

                const inststatusMap = constructOptionList(response[3].data || [], "ntranscode",
                    "stransstatus", undefined, undefined, false);

                // ALPD-5330 - Gowtham R - Default Section not loaded initially
                const sectionMap = constructOptionList(response[4].data || [], "nsectioncode",
                    "ssectionname", undefined, undefined, false);

                const periodMap = constructOptionList(response[5].data || [], "nperiodcode",
                    "speriodname", undefined, undefined, false);

                const timezoneMap = constructOptionList(response[6].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, false);
                  
                    if(operation==="update"){
                         insLocationMap = constructOptionList(response[13].data.InstrumentLocation || [], "ninstrumentlocationcode",
                        "sinstrumentlocationname", undefined, undefined, false);
                    }
                    else{
                         insLocationMap = constructOptionList(response[15].data.InstrumentLocation || [], "ninstrumentlocationcode",
                        "sinstrumentlocationname", undefined, undefined, false);
                    }

                    


                    const instrumentNamemap = constructOptionList(  operation === "update"? response[12].data.InstrumentName.filter(x => x.ninstrumentnamecode !== -1) || []:response[14].data.InstrumentName.filter(x => x.ninstrumentnamecode !== -1) || [], "ninstrumentnamecode",
                    "sinstrumentname", undefined, undefined, false);
                  
                // const validationMap={};
                // const calibrationMap ={};
                // const maintenanceMap ={};
                let ValidationStatus =[];
                let CalibrationStatus=[];
                let MaintenanceStatus=[];
                let CalibrationRequired ="";
                let siteList=[];

                const InstrumentCategory = instcatMap.get("OptionList");
                const Supplier = supplierMap.get("OptionList");
                const Manufacturer = manufMap.get("OptionList");
                const InstrumentStatus = inststatusMap.get("OptionList");
                // ALPD-5330 - Gowtham R - Default Section not loaded initially
                const Lab = sectionMap.get("OptionList");
                const Period = periodMap.get("OptionList");

                const TimeZoneList = timezoneMap.get("OptionList");
                const instName=instrumentNamemap.get("OptionList")
                const InstrumentLocation=insLocationMap.get("OptionList");

                let selectedRecord = {"ninstrumentcatcode": {
                            "value": masterData.SelectedInsCat.ninstrumentcatcode,
                             "label": masterData.SelectedInsCat.sinstrumentcatname
                         }};
                // let selectedRecord = {
                //     "ninstrumentcatcode": {
                //         "value": masterData.SelectedInsCat.ninstrumentcatcode,
                //         "label": masterData.SelectedInsCat.sinstrumentcatname
                //     },
                //     "ntzmanufdate": {
                //         "value": userInfo.ntimezonecode,
                //         "label": userInfo.stimezoneid
                //     },
                //     //"stzmanufdate":userInfo.stimezoneid

                //     "ntzpodate": {
                //         "value": userInfo.ntimezonecode,
                //         "label": userInfo.stimezoneid
                //     },
                //     "stzpodate": userInfo.stimezoneid,


                //     "ntzreceivedate": {
                //         "value": userInfo.ntimezonecode,
                //         "label": userInfo.stimezoneid
                //     },
                //     "stzreceivedate": userInfo.stimezoneid,


                //     "ntzinstallationdate": {
                //         "value": userInfo.ntimezonecode,
                //         "label": userInfo.stimezoneid
                //     },
                //     "stzinstallationdate": userInfo.stimezoneid,


                //     "ntzexpirydate": {
                //         "value": userInfo.ntimezonecode,
                //         "label": userInfo.stimezoneid
                //     },
                //     "stzexpirydate": userInfo.stimezoneid
                // };
                let instrumentCategory = [];
                let supplier = [];
                let regionalSite = [];
                let manufacturer = [];
                let instrumentstatus = [];
                let nwindowsperiodminusunit = [];
                let nwindowsperiodplusunit = [];;
                let nnextcalibrationperiod=[];
                let nnextmaintenanceperiod = [];  	//added by sujatha ALPDJ21-21 
                let lab = [];
                let ntzmanufdate = [];
                let ntzpodate = [];
                let ntzreceivedate = [];
                let ntzinstallationdate = [];
                let ntzexpirydate = [];
                let susername = [];
                let service = [];
                let instname = [];
                let ntzservicedate=[];
                let inslocation=[];
               
                // let validation = [];
                // let calibration = [];
                // let maintenance = [];

                //if (operation === "create") {
                    // let date = rearrangeDateFormat(userInfo, response[8].data);
                    // selectedRecord["dmanufacdate"] = date; //new Date(response[8].data);
                    // selectedRecord["dpodate"] = date;
                    // selectedRecord["dreceiveddate"] = date;
                    // selectedRecord["dinstallationdate"] = date;
                    // currentTime = date;
                    // if (response[7].data["ExpiryDate"] !== "") {
                    //     expiryDate = rearrangeDateFormat(userInfo, response[7].data["ExpiryDate"]); //new Date(response[7].data["ExpiryDate"]);
                    //     selectedRecord["dexpirydate"] = expiryDate;
                    // }
             //   }
         
                if (operation === "update") {
                    selectedRecord = response[7].data;
                    instrumentCategory.push({
                        "value": response[7].data["ninstrumentcatcode"],
                        "label": response[7].data["sinstrumentcatname"]
                    });
                    supplier.push({
                        
                        "value": response[7].data["nsuppliercode"],
                        "label": response[7].data["ssuppliername"]
                    });
                    regionalSite.push({
                        "value": response[7].data["nregionalsitecode"],
                        "label": response[7].data["sregionalsitename"]
                    });
                    service.push({
                        "value": response[7].data["nservicecode"],
                        "label": response[7].data["sserviceby"]
                    });
                    manufacturer.push({
                        "value": response[7].data["nmanufcode"],
                        "label": response[7].data["smanufname"]
                    });
                    instrumentstatus.push({
                        "value": response[7].data["ntranscode"],
                        "label": response[7].data["sactivestatus"]
                    });
                    nwindowsperiodminusunit.push({
                        "value": response[7].data["nwindowsperiodminusunit"],
                        "label": response[7].data["swindowsperiodminusunit"]
                    });
                    nwindowsperiodplusunit.push({
                        "value": response[7].data["nwindowsperiodplusunit"],
                        "label": response[7].data["swindowsperiodplusunit"]
                    });
                    nnextcalibrationperiod.push({
                        "value": response[7].data["nnextcalibrationperiod"],
                        "label": response[7].data["snextcalibrationperiod"]
                    });
	              //added by sujatha ALPDJ21-21 
                    nnextmaintenanceperiod.push({
                                "value": response[7].data["nnextmaintenanceperiod"],
                                "label": response[7].data["snextmaintenanceperiod"]
                            });
                    lab.push({
                        "value": response[7].data["nsectioncode"],
                        "label": response[7].data["ssectionname"]
                    })
                    ntzmanufdate.push({
                        "value": response[7].data["ntzmanufdate"],
                        "label": response[7].data["stzmanufdate"]
                    })
                    ntzpodate.push({
                        "value": response[7].data["ntzpodate"],
                        "label": response[7].data["stzpodate"]
                    })
                    ntzreceivedate.push({
                        "value": response[7].data["ntzreceivedate"],
                        "label": response[7].data["stzreceivedate"]
                    })
                    ntzinstallationdate.push({
                        "value": response[7].data["ntzinstallationdate"],
                        "label": response[7].data["stzinstallationdate"]
                    })
                    ntzexpirydate.push({
                        "value": response[7].data["ntzexpirydate"],
                        "label": response[7].data["stzexpirydate"]
                    })
                    ntzservicedate.push({
                        "value": response[7].data["ntzservicedate"],
                        "label": response[7].data["sservicedate"]
                    })
                    susername.push({
                        "value": response[7].data["nusercode1"],
                        "label": response[7].data["susername"]
                    })
                    instname.push({
                        "value": response[7].data["ninstrumentnamecode"],
                        "label": response[7].data["sinstrumentname"]
                    })

                    inslocation.push({
                        "value": response[7].data["ninstrumentlocationcode"],
                        "label": response[7].data["sinstrumentlocationname"] 
                    })
                    // validation.push({
                    //     "value": response[8].data["ntranscode"],
                    //     "label": response[8].data["stransdisplaystatus"]
                    // })
                    // calibration.push({
                    //     "value": response[9].data["ntranscode"],
                    //     "label": response[9].data["stransdisplaystatus"]
                    // })
                    // maintenance.push({
                    //     "value": response[10].data["ntranscode"],
                    //     "label": response[10].data["stransdisplaystatus"]
                    // })
                    if (response[7].data["smanufacdate"] !== "") {

                        selectedRecord["dmanufacdate"] = rearrangeDateFormat(userInfo, response[7].data["smanufacdate"]); //new Date(response[7].data["smanufacdate"]);
                    }

                    if (response[7].data["spodate"] !== "") {
                        selectedRecord["dpodate"] = rearrangeDateFormat(userInfo, response[7].data["spodate"]); //new Date(response[7].data["spodate"]);
                    }
                    // else{
                    //     selectedRecord["dpodate"] = " ";
                    // }

                    if (response[7].data["sreceiveddate"] !== "") {
                        selectedRecord["dreceiveddate"] = rearrangeDateFormat(userInfo, response[7].data["sreceiveddate"]); //new Date(response[7].data["sreceiveddate"]);
                    }
                    if (response[7].data["sinstallationdate"] !== "") {
                        selectedRecord["dinstallationdate"] = rearrangeDateFormat(userInfo, response[7].data["sinstallationdate"]); //new Date(response[7].data["sinstallationdate"]);
                    }

                    if (response[7].data["sexpirydate"] !== "") {
                        selectedRecord["dexpirydate"] = rearrangeDateFormat(userInfo, response[7].data["sexpirydate"]); //new Date(response[7].data["sexpirydate"]);
                    }
                    if (response[7].data["sservicedate"] !== "") {
                        selectedRecord["dservicedate"] = rearrangeDateFormat(userInfo, response[7].data["sservicedate"]); //new Date(response[7].data["sexpirydate"]);
                    }



                    selectedRecord["ninstrumentcatcode"] = instrumentCategory[0];
                    if(supplier[0].value!==-1)
                        selectedRecord["nsuppliercode"] =supplier[0];
                    selectedRecord["nservicecode"] = service[0];
                    selectedRecord["nregionalsitecode"] = regionalSite[0];
                    selectedRecord["ninstrumentnamecode"]= instname[0];
                    if(inslocation[0].value!==-1)
                        selectedRecord["ninstrumentlocationcode"]=inslocation[0];
                    
                   
                    if (manufacturer[0].value !== -1)
                        selectedRecord["nmanufcode"] = manufacturer[0];
                    if (instrumentstatus[0].value !== -1)
                        selectedRecord["ntranscode"] = instrumentstatus[0];
                    if (nwindowsperiodminusunit[0].value !== -1)
                        selectedRecord["nwindowsperiodminusunit"] = nwindowsperiodminusunit[0];
                    if (nwindowsperiodplusunit[0].value !== -1)
                        selectedRecord["nwindowsperiodplusunit"] = nwindowsperiodplusunit[0];
                    if (nnextcalibrationperiod[0].value !== -1)
                        selectedRecord["nnextcalibrationperiod"] = nnextcalibrationperiod[0];
	              //added by sujatha ALPDJ21-21 
                    if (nnextmaintenanceperiod[0].value !== -1)
                        selectedRecord["nnextmaintenanceperiod"] = nnextmaintenanceperiod[0];
                    selectedRecord["nsectioncode"] = lab[0];
                    selectedRecord["ntzmanufdate"] = ntzmanufdate[0];
                    selectedRecord["stzmanufdate"] = ntzmanufdate[0].label;
                    selectedRecord["ntzpodate"] = ntzpodate[0];
                    selectedRecord["stzpodate"] = ntzpodate[0].label;
                    selectedRecord["ntzreceivedate"] = ntzreceivedate[0];
                    selectedRecord["stzreceivedate"] = ntzreceivedate[0].label;
                    selectedRecord["ntzinstallationdate"] = ntzinstallationdate[0];
                    selectedRecord["stzinstallationdate"] = ntzinstallationdate[0].label;
                    selectedRecord["ntzexpirydate"] = ntzexpirydate[0];
                    selectedRecord["stzexpirydate"] = ntzexpirydate[0].label;

                    selectedRecord["ntzservicedate"] = ntzservicedate[0];
                    selectedRecord["sservicedate"] = ntzservicedate[0].label;

                    selectedRecord["susername"] = susername[0];
                  //  selectedRecord["ntranscode"] = validation[0];
                 //  selectedRecord["ntranscode"] = calibration[0];
               //     selectedRecord["ntranscode"] = maintenance[0];
               const siteMap = constructOptionList(response[10].data || [],"nsitecode", "ssitename",
               undefined, undefined, true) ;
               siteList = siteMap.get("OptionList");
               validateOpenDate=response[11].data.ValidateOpenDate;
                CalibrationRequired = selectedRecord.ncalibrationreq;  	//added by sujatha ALPDJ21-21 
                }
                else{
                    const validationMap = constructOptionList(response[9].data.ValidationStatus || [], "ntranscode",
                    "stransstatus", undefined, undefined, false);

                    const calibrationMap = constructOptionList(response[10].data.CalibrationStatus || [], "ntranscode",
                    "stransstatus", undefined, undefined, false);

                    const maintenanceMap = constructOptionList(response[11].data.MaintenanceStatus || [], "ntranscode",
                    "stransstatus", undefined, undefined, false);

                    CalibrationRequired =response[12].data.ncalibrationrequired;
                    
                    const siteMap = constructOptionList(response[13].data || [],"nsitecode", "ssitename",
                    undefined, undefined, true) ;
                    siteList = siteMap.get("OptionList");

                  //selectedRecord["nregionalsitecode"]=getComboLabelValue({...userInfo},response[13].data||[],"nsitecode", "ssitename")
                  // ALPD-5330 - Gowtham R - Default Section not loaded initially
                  selectedRecord["nregionalsitecode"]=siteMap.get("DefaultValue");

                 ValidationStatus = validationMap.get("OptionList");
                 CalibrationStatus = calibrationMap.get("OptionList");
                 MaintenanceStatus = maintenanceMap.get("OptionList");

                   const timezone=  TimeZoneList.filter(x=>x.value===userInfo.ntimezonecode);

                   selectedRecord["ntzmanufdate"] = timezone[0];
                  // selectedRecord["stzmanufdate"] = ntzmanufdate[0].label;
                   selectedRecord["ntzpodate"] = timezone[0];
                  // selectedRecord["stzpodate"] = ntzpodate[0].label;
                   selectedRecord["ntzreceivedate"] = timezone[0];
                  // selectedRecord["stzreceivedate"] = ntzreceivedate[0].label;
                   selectedRecord["ntzinstallationdate"] = timezone[0];
                  // selectedRecord["stzinstallationdate"] = ntzinstallationdate[0].label;
                   selectedRecord["ntzexpirydate"] = timezone[0];

                   selectedRecord["ntzservicedate"] = timezone[0];
                   //selectedRecord["stzexpirydate"] = ntzexpirydate[0].label;


                   let date = rearrangeDateFormat(userInfo, response[8].data?.date);
                     selectedRecord["dclosedate"] = date; 
                     selectedRecord["dopendate"] = date;
                     selectedRecord["dlastcalibrationdate"] = date; 
                     selectedRecord["dlastmaintenancedate"] = date;
                     selectedRecord["dduedate"] = date; 
                     selectedRecord["dvalidationdate"] = date;

                     selectedRecord["ntzclosedate"] = timezone[0]; 
                     selectedRecord["ntzopendate"] = timezone[0];
                     selectedRecord["ntzlastcalibrationdate"] = timezone[0]; 
                     selectedRecord["ntzlastmaintenancedate"] = timezone[0];
                     selectedRecord["ntzduedate"] = timezone[0]; 
                     selectedRecord["ntzvalidationdate"] = timezone[0];

                }
          
               
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        InstrumentCategory,
                        Supplier,
                        Manufacturer,
                        InstrumentStatus,
                        InstrumentLocation,
                        instrumentCategory: instrumentCategory,
                        supplier: supplier,
                        manufacturer: manufacturer,
                        inslocation:inslocation,
                        Lab,
                        Period,
                        TimeZoneList,
                        ValidationStatus,
                        CalibrationStatus,
                        MaintenanceStatus,
                        CalibrationRequired,
                        siteList,
                        validateOpenDate,
                        isOpen: true,
                        selectedRecord: selectedRecord,
                        operation: operation,
                        screenName: screenName,
                        openModal:true,
                        ncontrolCode: ncontrolCode,
                        loading: false,
                        currentTime,
                        expiryDate,instName
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
        else{
            toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
        }

        }
        else{
            toast.warn(intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORYNOTAVALIABLE"}));
        }
    }
}


export function getSectionUsers(nsectioncode, userInfo, selectedRecord, masterData, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("instrument/getSectionBasedUser", {
                "nsectioncode": nsectioncode,
                // ALPD-3514 taking nregionalsitecode from selectedRecord incase of Adding new instrument and from masterData's selected Instrument incase of adding section user
                "nregionalsitecode":selectedRecord && selectedRecord.nregionalsitecode ? selectedRecord.nregionalsitecode.value : masterData.selectedInstrument.nregionalsitecode, 
                "userinfo": userInfo,
            }
            )
            .then(response => {
                //console.log(" response:", response); 
                let Users = [];
                if (screenName === "IDS_SECTION") {
                    //let sectionusers=[];
                    const userName = constructOptionList(response.data || [], "nusercode",
                        "susername", undefined, undefined, false);
                    Users = userName.get("OptionList");
                    //selectedRecord["nusercode"]="";
                    selectedRecord["nusercode"] = undefined; //{label:SectionUsers[0].label,value:SectionUsers[0].value,item:SectionUsers[0]};
                } else {
                    Users = response.data;
                    selectedRecord["nusercode"] = undefined;
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Users,
                        selectedRecord,
                        loading: false

                    }
                });

            }).catch(error => {
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

            })
    }
}


export function getCalibrationRequired(ninstrumentcatcode, userInfo, selectedRecord, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("instrument/getCalibrationRequired", {
                "ninstrumentcatcode": ninstrumentcatcode,userinfo: userInfo})
            .then(response => {
                let CalibrationRequired = [];
                CalibrationRequired=response.data.ncalibrationrequired

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        CalibrationRequired,
                        selectedRecord,
                        loading: false

                    }
                });

            }).catch(error => {
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

            })
    }
}




export function getInstrumentDetail(Instrument, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("instrument/getInstrument", {
                ninstrumentcode: Instrument.ninstrumentcode,
                userinfo: userInfo
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
                        operation: null,
                        modalName: undefined,
                        loading: false,
                        dataState: undefined
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

            })
    }
}


export const getAvailableInstData = (instItem, url, key, screenName, userInfo, ncontrolCode, selectedRecord) => {
    return function (dispatch) {
        if(instItem.ninstrumentstatus!==transactionStatus.Disposed){
        dispatch(initRequest(true));
        let url = ''

        url = "/instrument/getUsers";

        return rsapi().post(url, {
                "userinfo": userInfo,"ninstrumentcode":instItem.ninstrumentcode, "nregionalsitecode":instItem.nregionalsitecode
            })
            .then(response => {

                const secMap = constructOptionList(response.data.Section || [], "nsectioncode",
                    "ssectionname", undefined, undefined, false);
                const userMap = constructOptionList(response.data.Users || [], "nusercode",
                    "susername", undefined, undefined, false);
                const Lab = secMap.get("OptionList");
                const LabDefault = secMap.get("DefaultValue");
                if (LabDefault !== undefined) {
                    selectedRecord = {
                        "nsectioncode": {
                            "value": LabDefault.value,
                            "label": LabDefault.label
                        },
                    }
                }
                const Users = userMap.get("OptionList");

                // let  openChildModal=true;
                
                //     openChildModal=false;
                //     toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
                // }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        Lab,
                        Users,
                        isOpen: true,
                        selectedRecord,
                        operation: "create",
                        screenName: screenName,
                        // openModal: true,
                        openChildModal:true,
                        ncontrolCode: ncontrolCode,
                        instItem: instItem,
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
                });
                if (error.response?.status === 417) {
                    toast.info(error.response.data)
                } else if (error.response?.status === 429) {
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
                } else  {
                    toast.error(error.message)
                }
            });
    }

else{
    toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
}}
}



export const changeInstrumentCategoryFilter = (inputParam, filterInstrumentCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/instrument/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                //const masterData = response.data
                const masterData = {...inputParam.masterData,...response.data}
                sortData(masterData);
                    
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState: undefined,
                        masterData: {
                            ...masterData,
                            filterInstrumentCategory,
                            nfilterInstrumentCategory: inputParam.inputData.nfilterInstrumentCategory
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
                });
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
        } else {
                toast.error(error.message);
        }
            });
    }
}

export const addInstrumentFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
        urlArray.push(rsapi().post("/instrument/editInstrumentFile", {
            userinfo: inputParam.userInfo,
            Instrumentfile: inputParam.selectedRecord
        }))
    }
        Axios.all(urlArray)
            .then(response => {
                // let selectedRecord = {};
                // let editObject = {};
                // let operation = "update";
                // editObject = response[0].data;


                const linkMap = constructOptionList(response[0].data.LinkMaster, "nlinkcode", "slinkname", false, false, true);
                const linkmaster = linkMap.get("OptionList");
                let selectedRecord = {};
                const defaultLink = linkmaster.filter(items => items.item.ndefaultlink === transactionStatus.YES);
                let disabled = false;
                let editObject = {};
                if (inputParam.operation === "update") {
                    editObject = response[1].data;
                    let nlinkcode = {};
                    let link = {};
                    if (editObject.nattachmenttypecode === attachmentType.LINK) {
                        nlinkcode = {
                            "label": editObject.slinkname,
                            "value": editObject.nlinkcode
                        }

                        link = {
                            slinkfilename:editObject.sfilename,
                            slinkdescription:editObject.sfiledesc,
                            nlinkdefaultstatus:editObject.ndefaultstatus,
                            sfilesize:'',
                            nfilesize:0,
                            ndefaultstatus:4,
                            sfilename:'',
                        }

                    } else {
                        nlinkcode = defaultLink.length > 0 ? defaultLink[0] : "" //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:""
                        link = {
                            slinkfilename:'',
                            slinkdescription:'',
                            nlinkdefaultstatus:4,
                            sfiledesc: editObject.sfiledesc,
                            sfilesize:editObject.sfilesize,
                            nfilesize:editObject.nfilesize,
                            ndefaultstatus:editObject.ndefaultstatus,
                            sfilename:editObject.sfilename,
                            ssystemfilename:editObject.ssystemfilename
                        }
                    }



                    selectedRecord = {
                        ninstrumentfilecode: editObject.ninstrumentfilecode,
                        // sfiledesc: editObject.sfiledesc,
    
                        // sfilename: editObject.sfilename,
                        // sdescription: editObject.sdescription,
                        // ssystemfilename: editObject.ssystemfilename,
                        nattachmenttypecode:editObject.nattachmenttypecode,
                        ...link, 
                        //...editObject,
                        nlinkcode,
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode:response[0].data.AttachmentType.length>0?
                        response[0].data.AttachmentType[0].nattachmenttypecode:attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:"",
                        disabled
                    };
                }

                // selectedRecord = {
                //     ninstrumentfilecode: editObject.ninstrumentfilecode,
                //     sfiledesc: editObject.sfiledesc,

                //     sfilename: editObject.sfilename,
                //     sdescription: editObject.sdescription,
                //     ssystemfilename: editObject.ssystemfilename
                // };


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        // openModal: true,
                        openChildModal: true,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord,
                        loading: false,
                        linkMaster: linkmaster,
                        showSaveContinue: false,
                        editFiles: editObject.nattachmenttypecode === "1" ? editObject : {}

                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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

export const getDataForAddEditValidation = (screenName, operation, userInfo, ncontrolCode, selectedRecord, masterData, primaryKeyName) => {
    return function (dispatch) {
        if(masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
        let urlArray = [];
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", {userinfo: userInfo});
        const validationStatusService = rsapi().post("instrument/getInstrumentValidationStatus", {"userinfo": userInfo,"ninstrumentcode":masterData.selectedInstrument.ninstrumentcode});

        if (operation === "create") {
            urlArray = [validationStatusService, UTCtimeZoneService, timeZoneService];

        } else {
            const ValidationById = rsapi().post("instrument/getActiveInstrumentValidationById", {
                [primaryKeyName]: masterData.selectedInstrumentValidation.ninstrumentvalidationcode,
                "userinfo": userInfo,"ninstrumentcode":masterData.selectedInstrument.ninstrumentcode
            });
            urlArray = [validationStatusService, UTCtimeZoneService, timeZoneService, ValidationById];

        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                let ValidationData = [];


                const validationMap = constructOptionList(response[0].data.ValidationStatus || [], "ntranscode",
                    "stransstatus", undefined, undefined, false);

                const ValidationStatus = validationMap.get("OptionList");

                let ntzvalidationdate = [];
                const timezoneMap = constructOptionList(response[2].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, false);

                const TimeZoneList = timezoneMap.get("OptionList");
                if (operation === "create") {
                     selectedRecord = {
                        "ntzvalidationdate": {
                            "value": userInfo.ntimezonecode,
                            "label": userInfo.stimezoneid
                        },
                        "stzvalidationdate": userInfo.stimezoneid,
                    };
                    let date = rearrangeDateFormat(userInfo, response[1].data?.date);
                    selectedRecord["dvalidationdate"] = date;

                }
                if (operation === "update") {

                    ValidationData.push({
                        "value": response[3].data["nvalidationstatus"],
                        "label": response[3].data["stransdisplaystatus"]
                    });
                    selectedRecord = response[3].data;
                    selectedRecord["ntranscode"] = ValidationData[0];

                    ntzvalidationdate.push({
                        "value": response[3].data["ntzvalidationdate"],
                        "label": response[3].data["stzvalidationdate"]
                    });
                    selectedRecord["ntzvalidationdate"] = ntzvalidationdate[0];
                    if (response[3].data["svalidationdate"] !== "") {

                        selectedRecord["dvalidationdate"] = rearrangeDateFormat(userInfo, response[3].data["svalidationdate"]); //new Date(response[7].data["smanufacdate"]);
                    }
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ValidationStatus,
                        TimeZoneList,
                        selectedRecord: selectedRecord,
                        isOpen: true,
                        operation: operation,
                        screenName: screenName,
                        // openModal: true,
                        openChildModal: true,
                        ncontrolCode: ncontrolCode,
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
                        id: error.response.data
                    }));
                }
            })
        }
        else{
            toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
        }
    }
}
export const getDataForAddEditCalibration = (screenName, operation, userInfo, ncontrolCode, selectedRecord, masterData, primaryKeyName) => {
    return function (dispatch) {
        if(masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
        let urlArray = [];
        const timeZoneService = rsapi().post("timezone/getTimeZone");
     
        const calibrationStatusService = rsapi().post("instrument/getInstrumentCalibrationStatus", {
            "userinfo": userInfo
        });
        const LastCalibrationDateService =
        rsapi().post("instrument/getInstrumentLastCalibrationDate", {
            "userinfo": userInfo,
            ninstrumentcode: masterData.selectedInstrument.ninstrumentcode

        });
        if (operation === "create") {
            const calibrationValidationService = rsapi().post("instrument/getInstrumentCalibrationValidation", {
                "userinfo": userInfo,
                nFlag: 1,
                ninstrumentcode: masterData.selectedInstrument.ninstrumentcode
            });
           
            urlArray = [calibrationStatusService, LastCalibrationDateService, timeZoneService, calibrationValidationService];

        } else {
            const calibrationValidationService = rsapi().post("instrument/getInstrumentCalibrationValidation", {
                "userinfo": userInfo,
                nFlag: 2,
                ninstrumentcalibrationcode: masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode,
                ninstrumentcode: masterData.selectedInstrumentCalibration.ninstrumentcode

            });

            const CalibrationById = rsapi().post("instrument/getActiveInstrumentCalibrationById", {
                [primaryKeyName]: masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode,
                "userinfo": userInfo
            });

            urlArray = [calibrationStatusService, LastCalibrationDateService, timeZoneService, calibrationValidationService, CalibrationById];

        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let CalibrationStatus = [];
                let TimeZoneList = [];
                if (response[3].data.OpenCloseStatus === "Success") {
                    let selectedRecord = {};
                    let CalibrationData = [];


                    const calibrationMap = constructOptionList(response[0].data.CalibrationStatus || [], "ntranscode",
                        "stransstatus", undefined, undefined, false);

                    CalibrationStatus = calibrationMap.get("OptionList");
	                //added by sujatha ALPDJ21-21 
                
                    CalibrationStatus=getRecordBasedOnPrimaryKeyName(CalibrationStatus,transactionStatus.UNDERCALIBIRATION,"value" );
                    selectedRecord["ntranscode"] = CalibrationStatus && CalibrationStatus[0];
                    let Action;
                    let ntzlastcalibrationdate = [];
                    let ntzduedate = [];
                    const timezoneMap = constructOptionList(response[2].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, false);

                    TimeZoneList = timezoneMap.get("OptionList");
                    if (operation === "create") {
                        selectedRecord = {
                            "ntzlastcalibrationdate": {
                                "value": userInfo.ntimezonecode,
                                "label": userInfo.stimezoneid
                            },
                            "stzlastcalibrationdate": userInfo.stimezoneid,

                            "ntzduedate": {
                                "value": userInfo.ntimezonecode,
                                "label": userInfo.stimezoneid
                            },
                            "stzduedate": userInfo.stimezoneid
                        };
                        //Added by sonia on 07th Mar 2025 for  jira id:ALPD-5519
                        let date = rearrangeDateFormat(userInfo, response[1].data.date !=="" ? response[1].data.date : new Date());
                       // let date = rearrangeDateFormat(userInfo, response[1].data.date);

                        selectedRecord["dlastcalibrationdate"] = date;
	                    //added by sujatha ALPDJ21-21 
                        // selectedRecord["ntranscode"] = underCalibrationStatus;
                        selectedRecord["ntranscode"] =  CalibrationStatus && CalibrationStatus[0];
                        selectedRecord["dduedate"] = rearrangeDateFormat(userInfo, new Date());
                        Action = 'Add';

                    }
                    if (operation === "update") {
                        Action = 'Edit';

                        CalibrationData.push({
                            "value": response[4].data["ncalibrationstatus"],
                            "label": response[4].data["stransdisplaystatus"]
                        });
                        selectedRecord = response[4].data;
                        selectedRecord["ntranscode"] = CalibrationData[0];

                        ntzlastcalibrationdate.push({
                            "value": response[4].data["ntzlastcalibrationdate"],
                            "label": response[4].data["stzlastcalibrationdate"]
                        });
                        ntzduedate.push({
                            "value": response[4].data["ntzduedate"],
                            "label": response[4].data["stzduedate"]
                        });
                        selectedRecord["ntzlastcalibrationdate"] = ntzlastcalibrationdate[0];
                        selectedRecord["ntzduedate"] = ntzduedate[0];
                        if (response[4].data["slastcalibrationdate"] !== "") {

                            selectedRecord["dlastcalibrationdate"] = rearrangeDateFormat(userInfo, response[4].data["slastcalibrationdate"]);
                        }
                        if (response[4].data["sduedate"] !== "") {

                            selectedRecord["dduedate"] = rearrangeDateFormat(userInfo, response[4].data["sduedate"]);
                        }

                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            CalibrationStatus,
                            Action: Action,
                            TimeZoneList,
                            selectedRecord: selectedRecord,
                            isOpen: true,
                            operation: operation,
                            screenName: screenName,
                            // openModal: true,
                            openChildModal: true,
                            ncontrolCode: ncontrolCode,
                            loading: false,
                            popUp:""
                        }
                    });
                } else {
                    toast.warn(intl.formatMessage({
                        id: response[3].data.Status
                    }));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: { 
                            operation: operation,
                            screenName: screenName,
                            ncontrolCode: ncontrolCode,
                            loading: false
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
        else{
            toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
        }
    }
}

export const getTabDetails = (inputParam) => {
    return function (dispatch) {

        const instrumentValidation = inputParam.instrumentValidation;
        const instrumentCalibration = inputParam.instrumentCalibration;
        const instrumentMaintenance = inputParam.instrumentMaintenance;
        let urlArray = [];
        dispatch(initRequest(true));
        if (inputParam.screenName === "IDS_INSTRUMENTVALIDATION") {
            urlArray.push(rsapi().post("/instrument/getothertabdetails", {
                ninstrumentcode: instrumentValidation.ninstrumentcode,
                "nFlag": inputParam.nFlag,
                ninstrumentvalidationcode: instrumentValidation.ninstrumentvalidationcode,
                userinfo: inputParam.userInfo
            }))
        } else if (inputParam.screenName === "IDS_INSTRUMENTCALIBRATION") {
            urlArray.push(rsapi().post("/instrument/getothertabdetails", {
                ninstrumentcode: instrumentCalibration.ninstrumentcode,
                "nFlag": inputParam.nFlag,
                ninstrumentcalibrationcode: instrumentCalibration.ninstrumentcalibrationcode,
                userinfo: inputParam.userInfo
            }))
        } else if (inputParam.screenName === "IDS_INSTRUMENTMAINTENANCE") {
            urlArray.push(rsapi().post("/instrument/getothertabdetails", {
                ninstrumentcode: instrumentMaintenance.ninstrumentcode,
                "nFlag": inputParam.nFlag,
                ninstrumentmaintenancecode: instrumentMaintenance.ninstrumentmaintenancecode,
                userinfo: inputParam.userInfo
            }))
        }

        Axios.all(urlArray)

            .then(response => {
                let masterData = inputParam.masterData
                masterData = {
                    ...masterData,
                    ...response[0].data
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
                });
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

export const getDataForAddEditMaintenance = (screenName, operation, userInfo, ncontrolCode, selectedRecord, masterData, primaryKeyName) => {
    return function (dispatch) {
        if(masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
        let urlArray = [];
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        
        const LastMaintenanceDateService =
                rsapi().post("instrument/getInstrumentLastMaintenanceDate", {
                    "userinfo": userInfo,
                    ninstrumentcode: masterData.selectedInstrument.ninstrumentcode
        });
        
        const maintenanceStatusService = rsapi().post("instrument/getInstrumentMaintenanceStatus", {
            "userinfo": userInfo  
         });

        if (operation === "create") {
            const maintenanceValidationService = rsapi().post("instrument/getInstrumentMaintenanceValidation", {
                "userinfo": userInfo,
                nFlag: 1,
                ninstrumentcode: masterData.selectedInstrument.ninstrumentcode
            });

            urlArray = [maintenanceStatusService, LastMaintenanceDateService, timeZoneService, maintenanceValidationService];

        } else {
            const maintenanceValidationService = rsapi().post("instrument/getInstrumentMaintenanceValidation", {
                "userinfo": userInfo,
                nFlag: 2,
                ninstrumentmaintenancecode: masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode,
                ninstrumentcode: masterData.selectedInstrumentMaintenance.ninstrumentcode
            });

            const MaintenanceById = rsapi().post("instrument/getActiveInstrumentMaintenanceById", {
                [primaryKeyName]: masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode,
                "userinfo": userInfo
            });

            urlArray = [maintenanceStatusService, LastMaintenanceDateService, timeZoneService, maintenanceValidationService, MaintenanceById];

        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let MaintenanceStatus = [];
                let TimeZoneList = [];
                if (response[3].data.OpenCloseStatus === "Success") {
                    let selectedRecord = {};
                    let MaintenanceData = [];

                    const maintenanceMap = constructOptionList(response[0].data.MaintenanceStatus || [], "ntranscode",
                        "stransstatus", undefined, undefined, false);

                        MaintenanceStatus = maintenanceMap.get("OptionList");
	                //added by sujatha ALPDJ21-21 
                    MaintenanceStatus=getRecordBasedOnPrimaryKeyName(MaintenanceStatus,transactionStatus.UNDERMAINTANENCE,"value" );
                    selectedRecord["ntranscode"] = MaintenanceStatus && MaintenanceStatus[0];
                    let Action;
                    let ntzlastmaintenancedate = [];
                    let ntzduedate = [];
                    const timezoneMap = constructOptionList(response[2].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, false);

                    TimeZoneList = timezoneMap.get("OptionList");
                    if (operation === "create") {
                        selectedRecord = {
                            "ntzlastmaintenancedate": {
                                "value": userInfo.ntimezonecode,
                                "label": userInfo.stimezoneid
                            },
                            "stzlastmaintenancedate": userInfo.stimezoneid,

                            "ntzduedate": {
                                "value": userInfo.ntimezonecode,
                                "label": userInfo.stimezoneid
                            },
                            "stzduedate": userInfo.stimezoneid
                        };
                        let date = rearrangeDateFormat(userInfo, response[1].data.date);
                        selectedRecord["dlastmaintenancedate"] = date;
                        selectedRecord["dduedate"] = rearrangeDateFormat(userInfo, new Date());
                        selectedRecord["ntranscode"] =  MaintenanceStatus && MaintenanceStatus[0]; 	//added by sujatha ALPDJ21-21 
                        Action = 'Add';

                    }
                    if (operation === "update") {
                        Action = 'Edit';

                        MaintenanceData.push({
                            "value": response[4].data["nmaintenancestatus"],
                            "label": response[4].data["stransdisplaystatus"]
                        });
                        selectedRecord = response[4].data;
                        selectedRecord["ntranscode"] = MaintenanceData[0];

                        ntzlastmaintenancedate.push({
                            "value": response[4].data["ntzlastmaintenancedate"],
                            "label": response[4].data["stzlastmaintenancedate"]
                        });
                        ntzduedate.push({
                            "value": response[4].data["ntzduedate"],
                            "label": response[4].data["stzduedate"]
                        });
                        selectedRecord["ntzlastmaintenancedate"] = ntzlastmaintenancedate[0];
                        selectedRecord["ntzduedate"] = ntzduedate[0];
                        if (response[4].data["slastmaintenancedate"] !== "") {

                            selectedRecord["dlastmaintenancedate"] = rearrangeDateFormat(userInfo, response[4].data["slastmaintenancedate"]); //new Date(response[7].data["smanufacdate"]);
                        }
                        if (response[4].data["sduedate"] !== "") {

                            selectedRecord["dduedate"] = rearrangeDateFormat(userInfo, response[4].data["sduedate"]); //new Date(response[7].data["smanufacdate"]);
                        }

                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            MaintenanceStatus,
                            Action: Action,
                            TimeZoneList,
                            selectedRecord: selectedRecord,
                            isOpen: true,
                            operation: operation,
                            screenName: screenName,
                            // openModal: true,
                            openChildModal: true,
                            ncontrolCode: ncontrolCode,
                            loading: false,
                            popUp:""
                        }
                    });
                } else {
                    toast.warn(intl.formatMessage({
                        id: response[3].data.Status
                    }));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {  
                            operation: operation,
                            screenName: screenName,
                            ncontrolCode: ncontrolCode,
                            loading: false
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
        else{
            toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
        }

    }
}

export const OpenDate = (screenName, userInfo, ncontrolCode, selectedRecord, masterData) => {
    return function (dispatch) {
        if(masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
        let urlArray = [];
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: userInfo
        });

        if (screenName === "IDS_INSTRUMENTCALIBRATION") {
            const calibrationValidationService = rsapi().post("instrument/getInstrumentCalibrationValidation", {
                "userinfo": userInfo,
                nFlag: 3,
                ninstrumentcalibrationcode: masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode,
                ninstrumentcode: masterData.selectedInstrumentCalibration.ninstrumentcode
            });

            const calibrationStatusService = rsapi().post("instrument/getInstrumentCalibrationOpenDateStatus", {
                "userinfo": userInfo,
                nFlag: 2,
                ninstrumentcalibrationcode: masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode,
                ninstrumentcode:masterData.selectedInstrumentCalibration.ninstrumentcode
            });
            urlArray = [calibrationStatusService, timeZoneService, UTCtimeZoneService, calibrationValidationService];
        } else {
            const maintenanceValidationService = rsapi().post("instrument/getInstrumentMaintenanceValidation", {
                "userinfo": userInfo,
                nFlag: 3,
                ninstrumentmaintenancecode: masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode,
                ninstrumentcode: masterData.selectedInstrumentMaintenance.ninstrumentcode
            });

            const maintenanceStatusService = rsapi().post("instrument/getInstrumentMaintenanceOpenCloseDateStatus", {
                "userinfo": userInfo,
                nFlag: 2,
                ninstrumentmaintenancecode: masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode,
                ninstrumentcode:masterData.selectedInstrumentMaintenance.ninstrumentcode

            });
            urlArray = [maintenanceStatusService, timeZoneService, UTCtimeZoneService, maintenanceValidationService];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                if (response[3].data.OpenCloseStatus === "Success") {

                    let CalibrationStatus = {};
                    let MaintenanceStatus = {};

                    let selectedRecord = {};
                    const timezoneMap = constructOptionList(response[1].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, false);

                    const TimeZoneList = timezoneMap.get("OptionList");
                    selectedRecord = {
                        "ntzopendate": {
                            "value": userInfo.ntimezonecode,
                            "label": userInfo.stimezoneid
                        },
                        "stzopendate": userInfo.stimezoneid,
                    };
                    let popUp=""
                    //let date = rearrangeDateFormat(userInfo, response[2].data);
                    // selectedRecord["dopendate"] = date;
	                //added by sujatha ALPDJ21-21 
                    let date1 = "";
                    if (screenName === "IDS_INSTRUMENTCALIBRATION") {
	                  //added by sujatha ALPDJ21-21 
                        date1 = masterData.selectedInstrumentCalibration.dlastcalibrationdate;
                        selectedRecord["dopendate"] = new Date(date1);
                        const calibrationMap = constructOptionList(response[0].data.CalibrationStatus || [], "ntranscode",
                            "stransstatus", undefined, undefined, false);

                     CalibrationStatus = calibrationMap.get("OptionList");
	                  //added by sujatha ALPDJ21-21 
                     CalibrationStatus=getRecordBasedOnPrimaryKeyName(CalibrationStatus,transactionStatus.UNDERCALIBIRATION,"value" );
                     selectedRecord["ntranscode"] = CalibrationStatus && CalibrationStatus[0];
                     popUp="IDS_INSTRUMENTCALIBRATIONOPENDATE"

                    //  let CalibrationData=[];
                    //  CalibrationData.push(response[0].data.CalibrationStatus[1]);
                    //  CalibrationData.push({
                    //     "value": response[0].data.CalibrationStatus[1].ntranscode,
                    //     "label": response[0].data.CalibrationStatus[1].stransdisplaystatus
                    // });
                     
                    //  selectedRecord["ntranscode"] = CalibrationData[0];
                        
                    } else {
	                   //added by sujatha ALPDJ21-21 
                        date1 = masterData.selectedInstrumentMaintenance.dlastmaintenancedate;
                        selectedRecord["dopendate"] = new Date(date1);
                        const maintenanceMap = constructOptionList(response[0].data.MaintenanceStatus || [], "ntranscode",
                            "stransstatus", undefined, undefined, false);

                        MaintenanceStatus = maintenanceMap.get("OptionList");
                         	//added by sujatha ALPDJ21-21 
                        MaintenanceStatus=getRecordBasedOnPrimaryKeyName(MaintenanceStatus,transactionStatus.UNDERMAINTANENCE,"value" );
                       selectedRecord["ntranscode"] = MaintenanceStatus && MaintenanceStatus[0];
                        popUp="IDS_INSTRUMENTMAINTENANCEOPENDATE"

                    }

                    let operation = "create";
                    let modalTitle = "IDS_OPENDATE";

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            isOpen: true,
                            selectedRecord: selectedRecord,
                            operation: operation,
                            modalTitle: modalTitle,
                            CalibrationStatus: CalibrationStatus,
                            MaintenanceStatus: MaintenanceStatus,
                            TimeZoneList: TimeZoneList,
                            screenName: screenName,
                            modalShow: true,
                            ncontrolCode: ncontrolCode,
                            popUp:popUp,
                            loading: false,
                            currentTime:date1             	//added by sujatha ALPDJ21-21 
                        }
                    });
                } else {
                    toast.warn(intl.formatMessage({
                        id: response[3].data.Status
                    }));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ncontrolCode: ncontrolCode,
                            loading: false
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
        else{                    toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
    }
    }
}
export const CloseDate = (screenName, userInfo, ncontrolCode, selectedRecord, masterData) => {
    return function (dispatch) {
        if(masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
        let urlArray = [];
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: userInfo
        });

        if (screenName === "IDS_INSTRUMENTCALIBRATION") {
            const calibrationValidationService = rsapi().post("instrument/getInstrumentCalibrationValidation", {
                "userinfo": userInfo,
                nFlag: 4,
                ninstrumentcalibrationcode: masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode,
                ninstrumentcode: masterData.selectedInstrumentCalibration.ninstrumentcode
            });

            const calibrationStatusService = rsapi().post("instrument/getInstrumentCalibrationOpenDateStatus", {
                "userinfo": userInfo,
                nFlag: 2,
                ninstrumentcalibrationcode: masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode,
                ninstrumentcode:masterData.selectedInstrumentCalibration.ninstrumentcode

            });
            urlArray = [calibrationStatusService, timeZoneService, UTCtimeZoneService, calibrationValidationService];
        } else {
            const maintenanceValidationService = rsapi().post("instrument/getInstrumentMaintenanceValidation", {
                "userinfo": userInfo,
                nFlag: 4,
                ninstrumentmaintenancecode: masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode,
                ninstrumentcode: masterData.selectedInstrumentMaintenance.ninstrumentcode
            });

            const maintenanceStatusService = rsapi().post("instrument/getInstrumentMaintenanceOpenCloseDateStatus", {
                "userinfo": userInfo,
                nFlag: 2,
                ninstrumentmaintenancecode: masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode,
                ninstrumentcode:masterData.selectedInstrumentMaintenance.ninstrumentcode
            });
            urlArray = [maintenanceStatusService, timeZoneService, UTCtimeZoneService, maintenanceValidationService];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                if (response[3].data.OpenCloseStatus === "Success") {

                    let CalibrationStatus = [];
                    let MaintenanceStatus = {};

                    let selectedRecord = {};
                    
                    const timezoneMap = constructOptionList(response[1].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, false);

                    const TimeZoneList = timezoneMap.get("OptionList");
                    selectedRecord = {
                        "ntzclosedate": {
                            "value": userInfo.ntimezonecode,
                            "label": userInfo.stimezoneid
                        },
                        "stzclosedate": userInfo.stimezoneid,
                    };
                    //let date = rearrangeDateFormat(userInfo, response[2].data);
                    // selectedRecord["dclosedate"] = date;
	             //added by sujatha ALPDJ21-21 
                    let openDate = "";
                    let popUp=""
                    if (screenName === "IDS_INSTRUMENTCALIBRATION") {
	                   //added by sujatha ALPDJ21-21 
                        openDate = masterData.selectedInstrumentCalibration.dopendate
                            // Ensure it's a proper Date object
                            selectedRecord["dclosedate"] = new Date(openDate);
                         const calibrationMap = constructOptionList(response[0].data.CalibrationStatus || [], "ntranscode",
                            "stransstatus", undefined, undefined, false);

                           CalibrationStatus = calibrationMap.get("OptionList");
                        	//added by sujatha ALPDJ21-21 
                        CalibrationStatus=getRecordBasedOnPrimaryKeyName(CalibrationStatus,transactionStatus.CALIBRATION,"value" );
                        selectedRecord["ntranscode"] = CalibrationStatus && CalibrationStatus[0];

                        popUp="IDS_INSTRUMENTCALIBRATIONCLOSEDATE"

                    //     let CalibrationData=[];
                    //  CalibrationData.push({
                    //     "value": response[0].data.CalibrationStatus[0].ntranscode,
                    //     "label": response[0].data.CalibrationStatus[0].stransstatus
                    // });
                     
                    // selectedRecord["ntranscode"] = CalibrationData[0];
                    //selectedRecord.ntranscode=CalibrationData[0];
                    } else {
	                    //added by sujatha ALPDJ21-21 
                          openDate = masterData.selectedInstrumentMaintenance.dopendate

                            // Ensure it's a proper Date object
                            selectedRecord["dclosedate"] = new Date(openDate);
                        const maintenanceMap = constructOptionList(response[0].data.MaintenanceStatus || [], "ntranscode",
                            "stransstatus", undefined, undefined, false);

                        MaintenanceStatus = maintenanceMap.get("OptionList");
            
                      	//added by sujatha ALPDJ21-21 
                      MaintenanceStatus=getRecordBasedOnPrimaryKeyName(MaintenanceStatus,transactionStatus.MAINTENANCE,"value" );
                      selectedRecord["ntranscode"] = MaintenanceStatus && MaintenanceStatus[0];
                        popUp="IDS_INSTRUMENTMAINTENANCECLOSEDATE"

                    }
                    let operation = "create";
                    let modalTitle = "IDS_CLOSEDATE";

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            isOpen: true,
                            selectedRecord: selectedRecord,
                            operation: operation,
                            modalTitle: modalTitle,
                            CalibrationStatus: CalibrationStatus,
                            MaintenanceStatus: MaintenanceStatus,
                            TimeZoneList: TimeZoneList,
                            screenName: screenName,
                            modalShow: true,
                            ncontrolCode: ncontrolCode,
                            loading: false,
                            popUp:popUp,
                            currentTime: openDate     	//added by sujatha ALPDJ21-21 
                        }
                    });
                } else {
                    toast.warn(intl.formatMessage({
                        id: response[3].data.Status
                    }));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ncontrolCode: ncontrolCode,
                            loading: false
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
        else{
            toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
        }
    }
}
export function getInstrumentSiteSection(nregionalsitecode, userInfo, selectedRecord) {
    return function (dispatch) {
            dispatch(initRequest(true));
            let url = "/instrument/getSiteBasedSection";
            return rsapi().post(url, {
                    "userinfo": userInfo,"nsitecode":nregionalsitecode
                })
                .then(response => {
                    const secMap = constructOptionList(response.data || [], "nsectioncode",
                        "ssectionname", undefined, undefined, false);
                    const Lab = secMap.get("OptionList");
                    selectedRecord["nsectioncode"] = undefined;
                    selectedRecord["nusercode"] = undefined;
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            Lab,
                            selectedRecord,
                            nsitecode: nregionalsitecode,
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
                    });
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

//Added by sonia on 30th Sept 2024 for Jira idL:ALPD-4940
export function updateAutoCalibration(masterData, userInfo, controlId) {
    return function (dispatch) {
            dispatch(initRequest(true));
            const url = "/instrument/updateAutoCalibrationInstrument";
            return rsapi().post(url, {"ninstrumentcode":masterData.selectedInstrument.ninstrumentcode,
                "nautocalibration":masterData.selectedInstrument.nautocalibration,
                "userinfo": userInfo
                })
                .then(response => {
                    masterData = {
                       ...masterData,                    
                        selectedInstrument :response.data && response.data.selectedInstrument,
                        // ALPD-5393 (Case Miss Match) - Gowtham R - Instrument Screen enable/disable auto calibration, manual to automatic existing data not hided
                        InstrumentCalibration :response.data && response.data.InstrumentCalibration,
                        selectedInstrumentCalibration : response.data && response.data.selectedInstrumentCalibration


                    }
                    
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false
                        }
                    });
                })
                .catch(error => {
                  //  console.log("error");
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        }
                    });
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

