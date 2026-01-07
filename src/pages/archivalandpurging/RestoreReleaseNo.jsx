import React from 'react';
import { Row, Col, Card, Nav,Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';

import { connect } from 'react-redux';
import { injectIntl} from 'react-intl';
import {
    callService, crudMaster, updateStore, validateEsignCredential,
    filterColumnData,getRestoreReleaseNo,updateRestoreReleaseNo,getRestoreDataDetails,getPurgeDate,getReleasedSamples,
    filterTransactionList,ViewRegSampleDetails,getReleasedSamplesRefresh
    
} from '../../actions';

import { getControlMap,   constructOptionList, sortData } from '../../components/CommonScript';
import {  designProperties, transactionStatus} from '../../components/Enumeration';

import DataGrid from '../../components/data-grid/data-grid.component';
import RestoreReleaseFilter from './RestoreReleaseFilter';
import ReleaseSampleInfo from './ReleaseSampleInfo';
import { Affix } from 'rsuite';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';

import { ContentPanel, ProductList } from '../product/product.styled';
import {faSync} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as RestoreIcon } from '../../assets/image/database-restore.svg';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class RestoreReleaseNo extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        //this.confirmMessage = new ConfirmMessage();
        const dataState = {
            skip: 0,
            take: 5,
        };
        const restoreSampleDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            restoreSampleDataState: restoreSampleDataState,
            childDataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            searchedData: [],
            count: 0,
            SampleGridItem: [],
            combinedSearchField: [],
            sidebarview: false,
            showSample:false,
            splitChangeWidthPercentage: 20.6,
            skip: 0,
            take: 10,
            sreleaseno:"",
            sarno:"",
            smorereleaseno:"",
            smorearno:"",
            realsitename:"",
            realstodate:"",
            realsreleaseno:"",
            realsarno:"",
            realsmorereleaseno:"",
            realsmorearno:"",
            realFlag:true,
            nrestorefiltercode:-1,
            temprestorefilter:"",
             //Added by L.Subashini on 25/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '20%', resizable: true, collapsible:true }    
            ],
            // ,
            // nmultiplesampleinsinglerelease: this.props.Login.masterData.realReportTypeValue && 
            //     this.props.Login.masterData.realReportTypeValue.nmultiplesampleinsinglerelease
        };
        this.searchRef = React.createRef();
        this.searchFieldList = ["sreportno", "ssitename", "stransstatus"];
    }

     //Added by L.Subashini on 25/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };

    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })
    }
    restoreSampleDataChange = (event) => {


        this.setState({ restoreSampleDataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        
    }
    dataStateChange = (event) => {


        this.setState({ dataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // this.expandNextData(event.dataState);
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    closeFilter = () => {
        let inputValues = {
            Site:this.props.Login.masterData.Site || {},
            selectedSite: this.props.Login.masterData.selectedSite || {},
            PurgeMaster: this.props.Login.masterData.PurgeMaster || {},
            selectedPurgeMaster: this.props.Login.masterData.selectedPurgeMaster || {},
            RestoreFilter:this.props.Login.masterData.RestoreFilter || {},
            selectedRestoreFilter:this.props.Login.masterData.TempRestoreFilter || {}
            
            //FilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            
            //FilterStatus: this.props.Login.masterData.realFilterStatusList || [],
            

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...inputValues } },
        };
        this.props.updateStore(updateInfo);
        // let selectedRecord=this.state;
        // selectedRecord.smorearno="";
        //          selectedRecord.smorereleaseno="";
        //          selectedRecord.sarno="";
        //          selectedRecord.sreleaseno="";
        //          this.setState({ selectedRecord });
    }

    closeModal = () => {
        let openModal = this.props.Login.openModal;
        openModal = false;
        let inputValues = {
            Site:this.props.Login.masterData.Site || {},
            selectedSite: this.props.Login.masterData.selectedSite || {},
            PurgeMaster: this.props.Login.masterData.PurgeMaster || {},
            selectedPurgeMaster: this.props.Login.masterData.selectedPurgeMaster || {}
            
            //FilterStatusValue: this.props.Login.masterData.realFilterStatusValue || {},
            
            //FilterStatus: this.props.Login.masterData.realFilterStatusList || [],
            

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showSample: false,openModal:false, masterData: { ...this.props.Login.masterData, ...inputValues } },
        };
        this.props.updateStore(updateInfo);
    }

    onFilterComboChange = (comboData, fieldName) => {

        if (comboData) {
            //let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            let inputParamData = {};
            if (fieldName === 'nsitecode') {
                if (comboData.value !== this.props.Login.masterData.selectedSite.nsitecode) {
                    inputParamData = {
                        nsitecode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        Site:this.props.Login.masterData.Site || [],
                        //selectedSite:this.props.Login.masterData.selectedSite,
                        selectedSite:comboData.item,
                        PurgeMaster:this.props.Login.masterData.PurgeMaster || [],
                        selectedPurgeMaster:this.props.Login.masterData.selectedPurgeMaster
                    }
                    this.props.getPurgeDate(inputParamData)
                }
            } 
            
            else if (fieldName === 'npurgemastercode') {
                if (comboData.value !== this.props.Login.masterData.selectedPurgeMaster.npurgemastercode) {
                    let masterData = { ...this.props.Login.masterData, selectedPurgeMaster: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
            else if (fieldName === 'nrestorefiltercode') {
                if (comboData.value !== this.props.Login.masterData.selectedRestoreFilter.nrestorefiltercode) {
                    let masterData = { ...this.props.Login.masterData, selectedRestoreFilter: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                    // let selectedRecord=this.state;
                    // selectedRecord.nrestorefiltercode=comboData.value;
                    // this.setState({ selectedRecord });

                }
                if (this.props.Login.masterData.selectedRestoreFilter.nrestorefiltercode>1) {
                let { selectedRecord } = this.state;
                selectedRecord.smorearno="";
                selectedRecord.smorereleaseno="";
                //selectedRecord.sarno="";
                //selectedRecord.sreleaseno="";
                this.setState({ selectedRecord });
                }
                
            }
            
        }
    }
    onInputOnChange = (event) => {
        let { selectedRecord } = this.state;
        
        selectedRecord[event.target.name] = event.target.value;
        // if(event.target.name==="sreleaseno")
        // {
        //   selectedRecord["realsreleaseno"] = event.target.value;
        // }
        // else if(event.target.name==="sarno")
        // {
        //   selectedRecord["realsarno"] = event.target.value;
        // }
        // else if(event.target.name==="smorereleaseno")
        // {
        //   selectedRecord["realsmorereleaseno"] = event.target.value;
        // }
        // else if(event.target.name==="smorearno")
        // {
        //   selectedRecord["realsmorearno"] = event.target.value;
        // }
        this.setState({ selectedRecord });

        // let masterData = { ...this.props.Login.masterData, selectedRecord[event.target.name] : event.target.value }
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { masterData }
        // }
        // this.props.updateStore(updateInfo);
    }
    // componentWillUpdate(previousProps) {
    //     if (this.props !== previousProps) {
    //          let realFlag=false;
    //          this.setState({realFlag});
            
        
    // }
    // }

    componentDidUpdate(previousProps) {
        let { userRoleControlRights, controlMap,
            SiteList,PurgeMasterList,RestoreFilterList } = this.state;

            let bFlag = false;

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                bFlag=true;
            }

            if (this.props.Login.masterData !== previousProps.Login.masterData) {
                
                
                const SiteListMap = constructOptionList(this.props.Login.masterData.Site || [], "nsitecode", "ssitename", undefined, undefined, undefined);
                const PurgeMasterListMap = constructOptionList(this.props.Login.masterData.PurgeMaster || [], "npurgemastercode", "stodate", "npurgemastercode", "ascending", false);
                const RestoreFilterListMap = constructOptionList(this.props.Login.masterData.RestoreFilter || [], "nrestorefiltercode", "srestorefiltername", "nsorter", "ascending",false);
                
               
                
                SiteList = SiteListMap.get("OptionList");
                PurgeMasterList = PurgeMasterListMap.get("OptionList");
                RestoreFilterList = RestoreFilterListMap.get("OptionList");
                bFlag=true;
                
            }
            if( bFlag)
            {
                bFlag = false;
                let allData = {};
                //&& this.state.realFlag
                if(RestoreFilterList.length >0  && this.props.Login.masterData.bFilterSubmitFlag)
                {
                let { selectedRecord } = this.state;
                 
                 selectedRecord.realsitename=this.props.Login.masterData.selectedSite
                 ? this.props.Login.masterData.selectedSite.ssitename || "NA"
                 : "NA";
                 selectedRecord.realstodate=this.props.Login.masterData.selectedPurgeMaster
                 ? this.props.Login.masterData.selectedPurgeMaster.stodate || "NA"
                 : "NA";
                 selectedRecord.nrestorefiltercode=this.props.Login.masterData.TempRestoreFilter ? 
                 this.props.Login.masterData.TempRestoreFilter.nrestorefiltercode:-1;
                //  selectedRecord.nrestorefiltercode=this.state.selectedRecord.temprestorefilter
                //  ? this.state.selectedRecord.temprestorefilter.nrestorefiltercode || -1
                //  : -1;
                 selectedRecord.realsreleaseno= this.state.selectedRecord.sreleaseno
                 ? this.state.selectedRecord.sreleaseno
                 : "NA";
                 selectedRecord.realsarno=this.state.selectedRecord.sarno
                 ? this.state.selectedRecord.sarno
                 : "NA";
                 selectedRecord.realsmorereleaseno=this.state.selectedRecord.smorereleaseno
                 ? this.state.selectedRecord.smorereleaseno
                 : "NA";
                 selectedRecord.realsmorearno=this.state.selectedRecord.smorearno
                 ? this.state.selectedRecord.smorearno
                 : "NA";
                //  selectedRecord.smorearno="";
                //  selectedRecord.smorereleaseno="";
                //  selectedRecord.sarno="";
                //  selectedRecord.sreleaseno="";
                 let realFlag=false;
                 
                 allData = {
                    userRoleControlRights, controlMap,
                    SiteList, PurgeMasterList,RestoreFilterList,selectedRecord,realFlag
                    
                }
                }
                else
                {
                    allData = {
                        userRoleControlRights, controlMap,
                        SiteList, PurgeMasterList,RestoreFilterList
                        
                    }
                }
             
            
                 //this.setState({ selectedRecord });
            this.setState(allData);
            }
    }
    ViewSampleDetails = (viewdetails) => {
       // console.log('ewe', viewdetails)
        let openModal = this.props.Login.openModal;
        openModal = true;
        let screenName = '"IDS_SAMPLEDETAILS"'
        let showSample=true;
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { openModal, screenName }
        // }
        this.props.ViewRegSampleDetails(this.props.Login.masterData, this.props.Login.userInfo, viewdetails, screenName);
        this.setState({showSample});
    };
    onFilterSubmit = () => {
        this.searchRef.current.value = "";
        this.props.Login.change = false

        
        let Site = this.props.Login.masterData.Site || [];
        let selectedSite = this.props.Login.masterData.selectedSite && this.props.Login.masterData.selectedSite;
        let PurgeMaster = this.props.Login.masterData.PurgeMaster || [];
        let selectedPurgeMaster = this.props.Login.masterData.selectedPurgeMaster && this.props.Login.masterData.selectedPurgeMaster;
        let RestoreIndividual = this.props.Login.masterData.RestoreIndividual || [];
        let selectedRestoreIndividual = this.props.Login.masterData.selectedRestoreIndividual && this.props.Login.masterData.selectedRestoreIndividual;
        let RestoreSample = this.props.Login.masterData.RestoreSample || [];
        let selectedRestoreSample = this.props.Login.masterData.selectedRestoreSample && this.props.Login.masterData.selectedRestoreSample;
        let RestoreFilter = this.props.Login.masterData.RestoreFilter || [];
        let selectedRestoreFilter = this.props.Login.masterData.selectedRestoreFilter && this.props.Login.masterData.selectedRestoreFilter;
        let bFilterSubmitFlag=false;
        let masterData = {
            ...this.props.Login.masterData, Site, selectedSite, PurgeMaster, selectedPurgeMaster,
            RestoreIndividual, selectedRestoreIndividual, RestoreSample,selectedRestoreSample,
            RestoreFilter,selectedRestoreFilter,bFilterSubmitFlag
            
        }
        let inputData = {
            
            nsitecode: (this.props.Login.masterData.selectedSite && this.props.Login.masterData.selectedSite.nsitecode) || -1,
            npurgemastercode: parseInt(this.props.Login.masterData.selectedPurgeMaster && this.props.Login.masterData.selectedPurgeMaster.npurgemastercode) || -1,
            nrestorefiltercode:parseInt(this.props.Login.masterData.selectedRestoreFilter && this.props.Login.masterData.selectedRestoreFilter.nrestorefiltercode) || -1,
            sreleaseno:this.state.selectedRecord.sreleaseno?this.state.selectedRecord.sreleaseno:"",
            sarno:this.state.selectedRecord.sarno?this.state.selectedRecord.sarno:"",
            smorereleaseno:this.state.selectedRecord.smorereleaseno?this.state.selectedRecord.smorereleaseno:"",
            smorearno:this.state.selectedRecord.smorearno?this.state.selectedRecord.smorearno:"",
            userinfo: this.props.Login.userInfo
            
        }
        if (inputData.nsitecode !== -1 && ((inputData.nrestorefiltercode === 1 && 
            inputData.npurgemastercode !== -1) || 
            (inputData.nrestorefiltercode === 2 && inputData.sreleaseno!=="") || 
            (inputData.nrestorefiltercode === 3 && inputData.sarno!==""))) {
            // ||
            // (inputData.nrestorefiltercode === 2 && inputData.sreleaseno!=="") ||
            // (inputData.nrestorefiltercode === 3 && inputData.sarno!=="")
            // if(inputData.nrestorefiltercode === 2 && inputData.sreleaseno==="")
            // {
            //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
            // }
            // if(inputData.nrestorefiltercode === 3 && inputData.sarno==="")
            // {
            //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
            // }
            masterData.TempRestoreFilter=selectedRestoreFilter;
            let inputParam = {
                masterData,
                inputData
            }
            this.props.getReleasedSamples(inputParam)

            //  if(this.props.Login.masterData.bFilterSubmitFlag)
            //  {
                  let { selectedRecord } = this.state;
                 
            //      selectedRecord.realsitename=this.props.Login.masterData.selectedSite
            //      ? this.props.Login.masterData.selectedSite.ssitename || "NA"
            //      : "NA";
            //      selectedRecord.realstodate=this.props.Login.masterData.selectedPurgeMaster
            //      ? this.props.Login.masterData.selectedPurgeMaster.stodate || "NA"
            //      : "NA";
            //      selectedRecord.realsreleaseno= this.state.selectedRecord.sreleaseno
            //      ? this.state.selectedRecord.sreleaseno
            //      : "NA";
            //      selectedRecord.realsarno=this.state.selectedRecord.sarno
            //      ? this.state.selectedRecord.sarno
            //      : "NA";
            //      selectedRecord.realsmorereleaseno=this.state.selectedRecord.smorereleaseno
            //      ? this.state.selectedRecord.smorereleaseno
            //      : "NA";
            //      selectedRecord.realsmorearno=this.state.selectedRecord.smorearno
            //      ? this.state.selectedRecord.smorearno
            //      : "NA";
                   //selectedRecord.smorearno="";
                   //selectedRecord.smorereleaseno="";
                   //selectedRecord.sarno="";
                   //selectedRecord.sreleaseno="";
                 let realFlag=true;
                
                  this.setState({ selectedRecord,realFlag});
            //  }

        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
        }

    }
    handleReportNoPageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };
    render() {
        
        this.props.Login.masterData && this.props.Login.masterData.RestoreIndividual && this.props.Login.masterData.RestoreIndividual.length > 0 
            && sortData(this.props.Login.masterData.RestoreIndividual, "", 'ncoaparentcode');

            this.feildsForGrid =
            [
                // { "idsName": "IDS_TEST", "dataField": "stestsynonym", "width": "200px" },  
                { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
                { "idsName": "IDS_SAMPLEARNO", "dataField": "samplearno", "width": "200px" },
                //{ "idsName": "IDS_SAMPLENAME", "dataField": "ssamplename", "width": "300px" },
                //{ "idsName": "IDS_SUBSAMPLE", "dataField": "ssubsample", "width": "400px" },
                { "idsName": "IDS_SECTIONNAME", "dataField": "ssectionname", "width": "200px" },
                { "idsName": "IDS_TESTNAME", "dataField": "stestname", "width": "400px" },
                { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametername", "width": "400px" },
                { "idsName": "IDS_RESULTS", "dataField": "sresult", "width": "150px" },
                { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "150px" }
                
            ];
            let breadCrumbData=[];
             breadCrumbData.push(
                                 {
                    "label": "IDS_SITENAME",
                    "value": this.state.selectedRecord
                        ? this.state.selectedRecord.realsitename || "NA"
                        : "NA"
                }
             );
                // ...(this.props.Login.masterData.selectedRestoreFilter &&
                // this.props.Login.masterData.selectedRestoreFilter.nrestorefiltercode === 1
                if(this.state.selectedRecord && this.state.selectedRecord.nrestorefiltercode === 1)
                    {                  
                          breadCrumbData.push({
                            "label": "IDS_PURGEDATE",
                            "value": this.state.selectedRecord
                                ? this.state.selectedRecord.realstodate || "NA"
                                : "NA"
                        },
                       {
                            "label": "IDS_RELEASENO",
                            "value": this.state.selectedRecord.realsmorereleaseno
                                ? this.state.selectedRecord.realsmorereleaseno
                                : "NA"
                        },
                        {
                            "label": "IDS_ARNO",
                            "value": this.state.selectedRecord.realsmorearno
                                ? this.state.selectedRecord.realsmorearno
                                : "NA"
                        })
                    }
                    if(this.state.selectedRecord && this.state.selectedRecord.nrestorefiltercode === 2)
                    {
                        breadCrumbData.push({
                                         "label": "IDS_RELEASENO",
                                         "value": this.state.selectedRecord.realsreleaseno
                                             ? this.state.selectedRecord.realsreleaseno
                                             : "NA"
                                     }
                        )
                    }
                    if(this.state.selectedRecord && this.state.selectedRecord.nrestorefiltercode === 3)
                    {
                        breadCrumbData.push({
                                         "label": "IDS_ARNO",
                                         "value": this.state.selectedRecord.realsarno
                                             ? this.state.selectedRecord.realsarno
                                             : "NA"
                                     }
                        )
                    }
                    
            
            const restoreId = this.props.Login.inputParam && this.state.controlMap.has("CreateRestoreIndividual")
            && this.state.controlMap.get('CreateRestoreIndividual').ncontrolcode;

            const ViewSampleDetails = this.state.controlMap.has("ViewSampleDetails") && this.state.controlMap.get("ViewSampleDetails").ncontrolcode;

            const reportSubFields = [{
                [designProperties.VALUE]: "ssitename",
                [designProperties.LABEL]: "IDS_SITENAME"
            }
            ];
            const RestoreParam = {
                
                masterData: { ...this.props.Login.masterData },
                
                inputData: {
                    
                   'userinfo': this.props.Login.userInfo,
                    //'ncoaparentcode': this.props.Login.masterData.selectedRestoreIndividual  && this.props.Login.masterData.selectedRestoreIndividual.ncoaparentcode || -1,
                    'nsitecode':this.props.Login.masterData.selectedSite  && this.props.Login.masterData.selectedSite.nsitecode || -1,
                    ncontrolCode: restoreId,
                    npurgemastercode: parseInt(this.props.Login.masterData.selectedPurgeMaster && this.props.Login.masterData.selectedPurgeMaster.npurgemastercode) || -1,
                    Site:this.props.Login.masterData.Site || [],
                    selectedSite:this.props.Login.masterData.selectedSite,
                    PurgeMaster:this.props.Login.masterData.PurgeMaster || [],
                    selectedPurgeMaster:this.props.Login.masterData.selectedPurgeMaster,
                    //screenName: this.props.intl.formatMessage({ id: "IDS_REMOVESAMPLES" }),
                    nrestorefiltercode:parseInt(this.props.Login.masterData.selectedRestoreFilter && this.props.Login.masterData.selectedRestoreFilter.nrestorefiltercode) || -1,
                   // nrestorefiltercode:parseInt(this.state.selectedRecord.temprestorefilter && this.state.selectedRecord.temprestorefilter.nrestorefiltercode) || -1,
                    
                    sreleaseno:this.state.selectedRecord.sreleaseno?this.state.selectedRecord.sreleaseno:"",
                    sarno:this.state.selectedRecord.sarno?this.state.selectedRecord.sarno:"",
                    smorereleaseno:this.state.selectedRecord.smorereleaseno?this.state.selectedRecord.smorereleaseno:"",
                    smorearno:this.state.selectedRecord.smorearno?this.state.selectedRecord.smorearno:"",
                    
    
                }
            };
            const RestoresampleDataParam = {
                masterData: { ...this.props.Login.masterData },
    
                inputData: {
                    
                    'nsitecode': (this.props.Login.masterData.selectedRestoreIndividual && this.props.Login.masterData.selectedRestoreIndividual.length >0 && this.props.Login.masterData.selectedRestoreIndividual[0].nsitecode) || "0",
                    
                    'userinfo': this.props.Login.userInfo,
                    
                    //'ncoaparentcode': this.props.Login.masterData.selectedRestoreIndividual && this.props.Login.masterData.selectedRestoreIndividual.ncoaparentcode,
                    
    
                }
            };

            const filterParam = {
                inputListName: "RestoreIndividual",
                selectedObject: "selectedRestoreIndividual",
                primaryKeyField: "ncoaparentcode",
                fetchUrl: "restoreindividual/getRestoreSampleData",
                masterData: this.props.Login.masterData,
                searchFieldList: this.searchFieldList,
                changeList:[],
                fecthInputObject: {
                    isSearch: true, userinfo: this.props.Login.userInfo,
                    nsitecode: this.props.Login.masterData.selectedSite && this.props.Login.masterData.selectedSite.nsitecode,
                    npurgemastercode: this.props.Login.masterData.selectedPurgeMaster && this.props.Login.masterData.selectedPurgeMaster.npurgemastercode,
                    // obj: convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo),
                    // dfrom: obj.fromDate,
                    // dto: obj.toDate,
                    masterData: this.props.Login.masterData,
                    searchFieldList: this.searchFieldList,
                    
                    nsitecode: parseInt(this.props.Login.masterData.selectedSite && this.props.Login.masterData.selectedSite.nsitecode) || -1,
                    npurgemastercode: parseInt(this.props.Login.masterData.selectedPurgeMaster && this.props.Login.masterData.selectedPurgeMaster.npurgemastercode) || -1,
                    ncoaparentcode: this.props.Login.masterData.selectedRestoreIndividual ? this.props.Login.masterData.selectedRestoreIndividual.map(item => item.ncoaparentcode).join(",") : "-1",
                    //ntransactionstatus: ((this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== undefined)
                    //    || this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus !== '0') ? String(this.props.Login.masterData.FilterStatusValue.ntransactionstatus) : "-1",
                    
                    
                }
            };

        return (
            <>
            <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
            {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
           {/* if(breadCrumbData.length !== 0 && this.props.Login.masterData.bFilterSubmitFlag)
           {
            <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix>
           } */}

    {/* {this.props.Login.showSample ? 
    <ReleaseSampleInfo
    data={(this.props.Login.masterData && this.props.Login.masterData["JsonData"] ) ?
        this.props.Login.masterData["JsonData"] : {}}
    // SingleItem={this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample ?
    //     this.state.SingleItem : []}
    screenName="IDS_RELEASESAMPLEINFO"
    userInfo={this.props.Login.userInfo}
    closeSample={this.closeSample}
    //viewFile={this.viewFile}

/>:''} */}


            <Row noGutters={true}>
            <Col md={12} className="parent-port-height">
            {/* <SplitterLayout 
                            borderColor="#999"
                            primaryIndex={1} 
                            percentage={true}
                            secondaryInitialSize={this.state.splitChangeWidthPercentage}
                            primaryMinSize={30}
                            secondaryMinSize={20}
                        > */}
               <Splitter className='layout-splitter' orientation="horizontal"
                           panes={this.state.panes} onChange={this.onSplitterChange}>
                 <SplitterPane size="50%" min="20%">   
                        <TransactionListMasterJsonView
                            clickIconGroup={true}
                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.RestoreIndividual || []}
                            selectedMaster={this.props.Login.masterData && this.props.Login.masterData.selectedRestoreIndividual && this.props.Login.masterData.selectedRestoreIndividual.length >0  ? this.props.Login.masterData.selectedRestoreIndividual : undefined}
                            primaryKeyField="ncoaparentcode"
                            filterColumnData={this.props.filterTransactionList}
                            getMasterDetail={(RestoreSample) =>
                                this.props.getRestoreDataDetails(

                                    {
                                        ...RestoresampleDataParam,
                                        ...RestoreSample
                                    }
                                )}
                            
                            //selectionList={this.props.Login.masterData && this.props.Login.masterData.transactionStatusSelectionList && this.props.Login.masterData.transactionStatusSelectionList.length > 0 ? this.props.Login.masterData.transactionStatusSelectionList : []}
                            
                            selectionColorField="scolorhexcode"
                            mainField={"sreportno"}
                            showStatusLink={true}
                            showStatusName={true}
                            statusFieldName="stransstatus"
                            statusField="stransstatus"
                            selectedListName="selectedRestoreIndividual"
                            searchListName="searchedData"
                            searchRef={this.searchRef}
                            objectName="releaseno"
                            listName="IDS_RELEASENO"
                            //selectionField="stransstatus"
                            //selectionFieldName="stransstatus"
                            //showFilter={this.props.Login.showFilter}
                            //showFilter={true}
                            openFilter={this.openFilter}
                            closeFilter={this.closeFilter}
                            onFilterSubmit={this.onFilterSubmit}
                            subFields={reportSubFields}
                            moreField={[]}
                            needMultiSelect={this.props.Login.settings && this.props.Login.settings[50] ? parseInt(this.props.Login.settings[50]) === transactionStatus.YES ? true : false : false}
                            showStatusBlink={true}
                            callCloseFunction={true}
                            filterParam={filterParam}
                            subFieldsLabel={true}
                            handlePageChange={this.handleReportNoPageChange}
                            skip={this.state.skip}
                            take={this.state.take}
                            childTabsKey={["selectedRestoreIndividual", "releaseno", "RestoreSample", "selectedRestoreSample"]}
                            // actionIcons={[
                            //     {
                            //         title: this.props.intl.formatMessage({ id: "IDS_EDITREPORTTEMPLATE" }),
                            //         controlname: "faPencilAlt",
                            //         objectName: "editReportTemplate",
                            //         hidden: this.state.userRoleControlRights.indexOf(editReportTemplateId) === -1,
                            //         onClick: this.editReportTemplate,
                            //         inputData: {
                            //             primaryKeyName: "ncoaparentcode",
                            //             operation: "update",
                            //             masterData: this.props.Login.masterData,
                            //             userInfo: this.props.Login.userInfo
                            //         },
                            //     },
                            //     {
                            //         title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                            //         controlname: "faTrashAlt",
                            //         objectName: "deleteSamples",
                            //         hidden: this.state.userRoleControlRights.indexOf(deleteSampleId) === -1,
                            //         onClick: this.ConfirmDelete,
                            //         inputData: {
                            //             primaryKeyName: "ncoaparentcode",
                            //             operation: "delete",
                            //             masterData: this.props.Login.masterData,
                            //             userInfo: this.props.Login.userInfo,
                            //             controlId: deleteSampleId
                            //         },
                            //     }
                            // ]}
                            needFilter={true}
                            commonActions={
                                <ProductList className="d-flex product-category float-right icon-group-wrap">
                                    {/* <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                        hidden={this.state.userRoleControlRights.indexOf(releaseId) === -1}
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                        // data-for="tooltip_list_wrap"
                                        onClick={() => this.getApprovedSample(ApprovedModalParam, releaseId)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                    </Button> */}
                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                        //   data-for="tooltip-common-wrap"
                                        onClick={this.reloadData} >
                                        <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }} />
                                    </Button>
                                    <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RESTOREDATA" })} data-place="left"
                                                            //hidden={this.state.userRoleControlRights.indexOf(restoreId) === -1}
                                                            onClick={(RestoreSample) => this.props.updateRestoreReleaseNo(RestoreParam,RestoreSample)}
                                                        >
                                                            <RestoreIcon className='custom_icons'/>
                                                            
                                                            {/* <FontAwesomeIcon icon="database-restore-svgrepo-com" /> */}
                                                            {/* <FontAwesomeIcon icon="fas fa-trash-alt" /> */}
                                                            {/* <FontAwesomeIcon icon="fas fa-trash-restore" /> */}
                                                            {/* <FontAwesomeIcon icon={faSpinner} /> */}
                                                            {/* <FontAwesomeIcon icon={far fa-trash-restore} /> */}
                                                            {/* <FontAwesomeIcon icon="fa-solid fa-window-restore" /> */}
                                                        </Nav.Link>
                                </ProductList>
                            }
                            filterComponent={[
                                {
                                    "Sample Filter": <RestoreReleaseFilter
                                        Site={this.state.SiteList || []}
                                        selectedSite={this.props.Login.masterData.selectedSite || []}
                                        PurgeMaster={this.state.PurgeMasterList || []}
                                        selectedPurgeMaster={this.props.Login.masterData.selectedPurgeMaster || []}
                                        RestoreFilter={this.state.RestoreFilterList || []}
                                        selectedRestoreFilter={this.props.Login.masterData.selectedRestoreFilter || []}
                                        selectedRecord={this.state.selectedRecord}
                                        
                                        //FilterStatus={this.state.FilterStatusList || []}
                                        //FilterStatusValue={this.props.Login.masterData.FilterStatusValue || []}
                                        //fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                        //toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                        onFilterComboChange={this.onFilterComboChange}
                                        onInputOnChange={this.onInputOnChange}
                                        handleDateChange={this.handleDateChange}
                                        userInfo={this.props.Login.userInfo}
                                        

                                    />
                                }
                            ]}
                            />
                    </SplitterPane>  
                    <SplitterPane size="70%" min="20%">    
                        {
                            this.props.Login.masterData && this.props.Login.masterData.RestoreIndividual && this.props.Login.masterData.RestoreIndividual.length > 0 && this.props.Login.masterData.selectedRestoreIndividual ?
                            <ContentPanel className="panel-main-content">
                            <Card className="border-0">
                                <Card.Header>
                                <Card.Subtitle>
                                <ProductList className="d-flex product-category float-right icon-group-wrap">
                                {/* <Nav.Link
                                                        className="btn btn-circle outline-grey ml-2"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RESTOREDATA" })} data-place="left"
                                                            //hidden={this.state.userRoleControlRights.indexOf(restoreId) === -1}
                                                        onClick={(RestoreSample) => this.props.updateRestoreReleaseNo(RestoreParam,RestoreSample)}
                                                    >
                                                        <FontAwesomeIcon icon={faSpinner} />
                                                    </Nav.Link> */}
                                </ProductList>
                                        {/* </div> */}
                                    </Card.Subtitle>
                                </Card.Header>
                                <Card.Body className="form-static-wrap">

                                <DataGrid
                                                                    //key="restoresamplecode"
                                                                    primaryKeyField="ncoaparentcode"
                                                                    data={this.props.Login.masterData.RestoreSample || []}
                                                                    dataResult={process(this.props.Login.masterData.RestoreSample && this.props.Login.masterData.RestoreSample || [], this.state.restoreSampleDataState)}
                                                                    dataState={this.state.restoreSampleDataState}
                                                                    
                                                                    //expandField="expanded"
                                                                    isExportExcelRequired={false}
                                                                    //dataStateChange={(event) => this.setState({ restoreSampleDataState: event.dataState })}
                                                                    controlMap={this.state.controlMap}
                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                    extractedColumnList={this.feildsForGrid}
                                                                    //detailedFieldList={this.props.detailedFieldList}
                                                                    //editParam={editReportParam}
                                                                    //selectedId={this.props.Login.selectedId}
                                                                    //fetchRecord={this.props.fetchReportInfoReleaseById}
                                                                    pageable={true}
                                                                    dataStateChange={this.restoreSampleDataChange}
                                                                    scrollable={'scrollable'}
                                                                    gridHeight={'630px'}
                                                                    isActionRequired={true}
                                                                    actionIcons={[{
                                                                        title: this.props.intl.formatMessage({ id: "IDS_SAMPLEINFORMATION" }),
                                                                        controlname: "faEye",
                                                                        objectName: "SampleDetails",
                                                                        hidden: this.state.userRoleControlRights.indexOf(ViewSampleDetails) === -1,
                                                                        onClick: (viewdetails) => this.ViewSampleDetails(viewdetails)
                                                                    }]}
                                                                    methodUrl={'RestoreSample'}
                                                                
                                                                >
                                                                </DataGrid>
                                </Card.Body>
{/* </Card.Body> */}
                            </Card>
                        </ContentPanel>
                        : ""
                        }
                    </SplitterPane>     
                </Splitter>
                                {/* </SplitterLayout> */}
                                </Col>
                                {/* <Col md={8} className="parent-port-height"> 
                           </Col> */}
                       
                           
            
            </Row>

            {
                    this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                    size={"xl"}
                    closeModal={this.closeModal}
                        inputParam={this.props.Login.inputParam}
                        screenName={'IDS_SAMPLEINFORMATION'}//{"IDS_RELEASESAMPLEINFO"}
                        hideSave={true}
                        addComponent={
                            <>

                                <Card className='one' >
                                    <Card.Body>
                                    <ReleaseSampleInfo
    data={(this.props.Login.masterData && this.props.Login.masterData["JsonData"] ) ?
        this.props.Login.masterData["JsonData"] : {}}
    sarno={(this.props.Login.masterData && this.props.Login.masterData["sarno"] ) ?
    this.props.Login.masterData["sarno"] : ""}
    sreportno={(this.props.Login.masterData && this.props.Login.masterData["sreportno"] ) ?
    this.props.Login.masterData["sreportno"] : ""}
    // SingleItem={this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample ?
    //     this.state.SingleItem : []}
    screenName="IDS_SAMPLEDETAILS"
    controlMap={this.state.controlMap}
    userInfo={this.props.Login.userInfo}
    //closeSample={this.closeSample}
    //viewFile={this.viewFile}

/>
                                    </Card.Body>
                                </Card>
                                <br></br>

                                
                            </>
                        }
                    />



                }

            </div>
            
            </>
        );

    }

    reloadData = () => {
        this.searchRef.current.value = "";
        delete this.props.Login.masterData["searchedData"]

        //this.props.Login.change = false
        // let { Site, selectedSite, PurgeMaster,selectedPurgeMaster,
        //     RestoreIndividual, selectedRestoreIndividual } = this.props.Login.masterData
        // let masterData = {
        //     ...this.props.Login.masterData, Site, selectedSite, PurgeMaster, selectedPurgeMaster, RestoreIndividual,
        //     selectedRestoreIndividual
        // }
        // let inputData = {
        //     //npreregno: "0",
        //     //nneedsubsample: (realRegSubTypeValue && realRegSubTypeValue.nneedsubsample) || false,
        //     //nneedtemplatebasedflow: (realRegSubTypeValue && realRegSubTypeValue.nneedtemplatebasedflow) || false,
        //     //nsampletypecode: (realSampleTypeValue && realSampleTypeValue.nsampletypecode) || -1,
        //     //nregtypecode: (realRegTypeValue && realRegTypeValue.nregtypecode) || -1,
        //     //nregsubtypecode: (realRegSubTypeValue && realRegSubTypeValue.nregsubtypecode) || -1,
        //     //ncoareporttypecode: (realReportTypeValue && realReportTypeValue.ncoareporttypecode) || -1,
        //     //isneedsection: parseInt(realReportTypeValue && realReportTypeValue.isneedsection) || transactionStatus.NO,

        //     //ntransactionstatus: realFilterStatusValue && ((realFilterStatusValue.ntransactionstatus !== undefined) || (realFilterStatusValue.ntransactionstatus !== '0')) ? String(realFilterStatusValue.ntransactionstatus) + ',' + String(transactionStatus.RELEASED) : "-1",
        //     //napprovalconfigcode: realApprovalVersionValue ? realApprovalVersionValue.napprovalconfigcode || -1 : null,
        //     //napprovalversioncode: realApprovalVersionValue && realApprovalVersionValue.napprovalconfigversioncode ? String(realApprovalVersionValue.napprovalconfigversioncode) : -1,
        //     // ntestcode: realTestValue && realTestValue.ntestcode ? realTestValue.ntestcode : -1,
        //     userinfo: this.props.Login.userInfo,
        //     //ndesigntemplatemappingcode: (this.props.Login.masterData.realDesignTemplateMappingValue && this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode) || -1,
        // }
        // //if (inputData.nsampletypecode !== -1 && inputData.nregtypecode !== -1 && inputData.nregsubtypecode !== -1
        //  //   && inputData.ntransactionstatus !== "-1" && inputData.napprovalconfigcode !== -1 && inputData.napprovalversioncode !== "-1"
           
        //  //   && inputData.ncoareporttypecode !== -1
        // //) {
        //     //let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
        //     //inputData['dfrom'] = obj.fromDate;
        //     //inputData['dto'] = obj.toDate;
        //     let inputParam = {
        //         masterData,
        //         inputData,
        //     }
        //     this.props.getRestoreReleaseNo(inputParam,this.state.selectedRecord,this.props.Login.selectedRecord,this.props.Login)
        //} else {
        //    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
       // }

       let Site = this.props.Login.masterData.Site || [];
       let selectedSite = this.props.Login.masterData.selectedSite && this.props.Login.masterData.selectedSite;
       let PurgeMaster = this.props.Login.masterData.PurgeMaster || [];
       let selectedPurgeMaster = this.props.Login.masterData.selectedPurgeMaster && this.props.Login.masterData.selectedPurgeMaster;
       let RestoreIndividual = this.props.Login.masterData.RestoreIndividual || [];
       let selectedRestoreIndividual = this.props.Login.masterData.selectedRestoreIndividual && this.props.Login.masterData.selectedRestoreIndividual;
       let RestoreSample = this.props.Login.masterData.RestoreSample || [];
       let selectedRestoreSample = this.props.Login.masterData.selectedRestoreSample && this.props.Login.masterData.selectedRestoreSample;
       let RestoreFilter = this.props.Login.masterData.RestoreFilter || [];
       let selectedRestoreFilter = this.props.Login.masterData.selectedRestoreFilter && this.props.Login.masterData.selectedRestoreFilter;
       
       let masterData = {
           ...this.props.Login.masterData, Site, selectedSite, PurgeMaster, selectedPurgeMaster,
           RestoreIndividual, selectedRestoreIndividual, RestoreSample,selectedRestoreSample,
           RestoreFilter,selectedRestoreFilter
           
       }
       let inputData = {
           
           nsitecode: (this.props.Login.masterData.selectedSite && this.props.Login.masterData.selectedSite.nsitecode) || -1,
           npurgemastercode: parseInt(this.props.Login.masterData.selectedPurgeMaster && this.props.Login.masterData.selectedPurgeMaster.npurgemastercode) || -1,
           //nrestorefiltercode:parseInt(this.props.Login.masterData.selectedRestoreFilter && this.props.Login.masterData.selectedRestoreFilter.nrestorefiltercode) || -1,
           nrestorefiltercode:parseInt(this.state.selectedRecord && this.state.selectedRecord.nrestorefiltercode) || -1,
           sreleaseno:this.state.selectedRecord.realsreleaseno && this.state.selectedRecord.realsreleaseno !== "NA"? this.state.selectedRecord.realsreleaseno:"",
           sarno:this.state.selectedRecord.realsarno && this.state.selectedRecord.realsarno !== "NA" ? this.state.selectedRecord.realsarno:"",
           smorereleaseno:this.state.selectedRecord.realsmorereleaseno && this.state.selectedRecord.realsmorereleaseno !== "NA" ? this.state.selectedRecord.realsmorereleaseno:"",
           smorearno:this.state.selectedRecord.realsmorearno && this.state.selectedRecord.realsmorearno !== "NA" ? this.state.selectedRecord.realsmorearno:"",
           userinfo: this.props.Login.userInfo
           
       }

       let inputParam = {
        masterData,
        inputData
    }
    //this.props.getReleasedSamplesRefresh(inputParam);
    this.props.getReleasedSamples(inputParam);

    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential, filterColumnData,getRestoreReleaseNo,updateRestoreReleaseNo,
    getRestoreDataDetails,getPurgeDate,getReleasedSamples,filterTransactionList,ViewRegSampleDetails,getReleasedSamplesRefresh
    
})(injectIntl(RestoreReleaseNo));  