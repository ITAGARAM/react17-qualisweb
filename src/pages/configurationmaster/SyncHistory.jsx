import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, FormGroup, FormLabel} from 'react-bootstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {callService, crudMaster, updateStore, getSyncHistoryDetail, SyncRecords, filterColumnData } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { getControlMap } from '../../components/CommonScript';
import ListMaster from '../../components/list-master/list-master.component';
import { transactionStatus } from '../../components/Enumeration';
import {  ReadOnlyText, ContentPanel } from '../../components/App.styles';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SyncHistory extends React.Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[4]) : 10,
        };
        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            SelectedSyncBatchHistory: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            isClearSearch: false,
            sidebarview: false,
            data: [],
            dataResult: [],
            dataState: dataState            

        };
      
       
        this.searchRef = React.createRef();      

        this.userFieldList = [];
        this.searchFieldList = ["stransfertype", "sbatchfinalstatus","sbatchtransferstatus", "sdestinationsitename", "sbatchtransferid"];

        this.extractedColumnList = [
                                { "idsName": "IDS_TRANSFERID", "dataField": "stransferid", "width": "200px" },
                                { "idsName": "IDS_STATUS", "dataField": "stransferstatus", "width": "200px" },
                                { "idsName": "IDS_ITEM", "dataField": "stablename", "width": "200px" },
                                { "idsName": "IDS_TRANSFERTYPE", "dataField": "stransfertype", "width": "200px" },
                                { "idsName": "IDS_DATETIME", "dataField": "stransactiondatetime", "width": "200px" },
                               // { "idsName": "IDS_FAILUREMSG", "dataField": "serrormsg", "width": "200px" }
                            ]
    }

    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
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
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    render() {

        let syncStatusCSS = "outline-secondary";
        //let activeIconCSS = "fa fa-check";
        let activeIconCSS = "";
        if (this.props.Login.masterData.SelectedSyncBatchHistory && this.props.Login.masterData.SelectedSyncBatchHistory.nbatchtransferstatus === transactionStatus.SENT) {
            syncStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.SelectedSyncBatchHistory && this.props.Login.masterData.SelectedSyncBatchHistory.nbatchtransferstatus === transactionStatus.COMPLETED) {
            syncStatusCSS = "outline-success";
            activeIconCSS = "";
        }
        else if (this.props.Login.masterData.SelectedSyncBatchHistory && this.props.Login.masterData.SelectedSyncBatchHistory.nbatchtransferstatus === transactionStatus.FAIL_43) {
            activeIconCSS = "";
        }
        const filterParam = {
            inputListName: "SyncBatchHistory", selectedObject: "SelectedSyncBatchHistory", primaryKeyField: "nsyncbatchcode",
            fetchUrl: "synchistory/getSyncHistory", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };

        const syncId = this.state.controlMap.has("StartSync") && this.state.controlMap.get("StartSync").ncontrolcode;
        //console.log("syncID:", this.props.Login.userRoleControlRights, this.state.controlMap, syncId);
       
       // console.log("data:", this.props.Login.masterData);
        return (<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                <Row noGutters>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                        <ListMaster
                            screenName={this.props.intl.formatMessage({ id: "IDS_SYNCHISTORY" })}
                            masterData={this.props.Login.masterData}
                            userInfo={this.props.Login.userInfo}
                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.SyncBatchHistory}
                            getMasterDetail={(syncData) => this.props.getSyncHistoryDetail(syncData, this.props.Login.userInfo, this.props.Login.masterData)}
                            selectedMaster={this.props.Login.masterData.SelectedSyncBatchHistory}
                            primaryKeyField="nsyncbatchcode"
                            mainField="sdestinationsitename"
                            //firstField="sbatchtransferid"
                            firstField='sbatchstartdatetime'
                            secondField="sbatchfinalstatus"
                            filterColumnData={this.props.filterColumnData}
                            filterParam={filterParam}
                            userRoleControlRights={this.state.userRoleControlRights}
                            syncId={syncId}
                            searchRef={this.searchRef}
                            reloadData={this.reloadData}
                            openModal={() => this.props.SyncRecords(this.props.Login.userInfo)}
                            isMultiSelecct={false}
                            hidePaging={false}
                            isClearSearch={this.props.Login.isClearSearch}
                        />
                        {/* </div>
                        </Col></Row> */}
                    </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div>
                        {/* <Row>
                            <Col md={12}> */}
                        <ContentPanel className="panel-main-content">
                            <Card className="border-0">
                                {this.props.Login.masterData.SyncBatchHistory && this.props.Login.masterData.SyncBatchHistory.length > 0 && this.props.Login.masterData.SelectedSyncBatchHistory ?
                                    <>
                                        <Card.Header>
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                            <Card.Title className="product-title-main">
                                                {this.props.Login.masterData.SelectedSyncBatchHistory.sdestinationsitename}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">

                                                        <span className={`btn btn-outlined ${syncStatusCSS} btn-sm ml-3`}>
                                                            {activeIconCSS !== "" ? <i class={activeIconCSS}></i> : ""}
                                                            {this.props.Login.masterData.SelectedSyncBatchHistory.sbatchtransferstatus}
                                                            {/* <FormattedMessage id= {this.props.Login.masterData.SelectedSyncBatchHistory.sactivestatus}/> */}

                                                        </span>
                                                    </h2>
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <div className="d-inline">
                                                       

                                                   
                                                    </div>
                                                    {/* </Tooltip> */}
                                                </div>

                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body className="form-static-wrap">  
                                            <Row> 
                                            {this.props.Login.masterData.Synchronization === null? "":
                                                    <>
                                                     <Col md={3}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_LASTSYNCDATETIME" message="Last Successful Sync Date & Time" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.Synchronization.slastsyncdatetime}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={3}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_SYNCDATETIME" message="Sync Date & Time" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.Synchronization.ssyncdatetime}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col></>
                                                }       
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_BATCHTRANSFERID" message="Batch Transfer ID" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedSyncBatchHistory.sbatchtransferid}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                               
                                                </Row>    
                                            
                                                                            
                                            <Row>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_BATCHTRANSFERSTATUS" message="Batch Transfer Status" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedSyncBatchHistory.sbatchtransferstatus}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_SYNCTYPE" message="Sync Type" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedSyncBatchHistory.ssynctype}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_BATCHFINALSTATUS" message="Batch Final Status" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedSyncBatchHistory.sbatchfinalstatus}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_BATCHSTARTDATETIME" message="Batch Start Date & Time" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedSyncBatchHistory.sbatchstartdatetime}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_BATCHENDDATETIME" message="Batch End Date & Time" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedSyncBatchHistory.sbatchenddatetime}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                            {this.props.Login.masterData.SelectedSyncBatchHistory.serrormsg !== '' ?
                                            <Col md={12}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_FAILUREMSG" message="Failure Message" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedSyncBatchHistory.serrormsg}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                            :""}
                                            </Row>
                                          
                                            <Row noGutters={true}>
                                                <Col md={12}>
                                                    <DataGrid
                                                        primaryKeyField={"nsynchistorycode"}
                                                        data={this.state.data}
                                                        dataResult={this.state.dataResult}
                                                        //dataResult={this.props.Login.masterData["SyncHistory"]||[]}
                                                        dataState={this.state.dataState}
                                                        dataStateChange={this.dataStateChange}
                                                        extractedColumnList={this.extractedColumnList}
                                                        controlMap={this.state.controlMap}
                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                        inputParam={this.props.Login.inputParam}
                                                        userInfo={this.props.Login.userInfo}
                                                       // gridHeight = {'600px'}
                                                      //  methodUrl="SyncHistory"
                                                      //  fetchRecord={props.getUserMultiRoleComboDataService}
                                                     //   editParam={roleEditParam}
                                                     //   deleteRecord={props.deleteRecord} 
                                                      //  deleteParam={roleDeleteParam}                                                                                          
                                                        pageable={true}
                                                        scrollable={"auto"}
                                                        isActionRequired={false}
                                                        isToolBarRequired={false}
                                                        selectedId={this.props.Login.selectedId}
                                                        hideColumnFilter={false}
                                                        groupable={true}
                                                    />
                                                </Col>
                                            </Row>

                                        </Card.Body>
                                    </>
                                    : ""
                                }
                            </Card>
                        </ContentPanel>
                    </Col></Row>
                {/* </Col>
                </Row> */}
            </div>

            {/* End of get display*/}          
        </>
        );
    }

    dataStateChange = (event) => {
      
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    componentDidUpdate(previousProps) {
       
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData["SyncHistory"],
                dataResult: process(this.props.Login.masterData["SyncHistory"]||[], this.state.dataState),
            });
        }
        else {   
            if (this.props.Login.masterData !== previousProps.Login.masterData) {     
                let {dataState} = this.state;
                if(this.props.Login.dataState === undefined){
                    dataState = {skip:0, take:this.state.dataState.take}
                }
                if(this.state.dataResult.data){
                    if(this.state.dataResult.data.length ===1){
                        let skipcount = this.state.dataState.skip > 0 ?(this.state.dataState.skip-this.state.dataState.take):
                        this.state.dataState.skip
                        dataState={skip:skipcount,take:this.state.dataState.take}
                    }
                }
                this.setState({
                    data: this.props.Login.masterData["SyncHistory"] ||[], selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData["SyncHistory"] || [], dataState),
                    dataState
                });
            }
            else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
                        this.setState({ selectedRecord: this.props.Login.selectedRecord });
                    }
        }  
    }     

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    // componentDidUpdate(previousProps) {        
    //     if (this.props.Login.masterData !== previousProps.Login.masterData) {
    //         if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
    //             const userRoleControlRights = [];
    //             if (this.props.Login.userRoleControlRights) {
    //                 this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
    //                     userRoleControlRights.push(item.ncontrolcode))
    //             }
    //             const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
    //             this.setState({
    //                 userRoleControlRights, controlMap, data: this.props.Login.masterData["SyncHistory"],
    //                 dataResult: process(this.props.Login.masterData["SyncHistory"]||[], this.state.dataState),
    //             });
    //         }
    //         else {        
    //             let {dataState} = this.state;
    //             if(this.props.Login.dataState === undefined){
    //                 dataState = {skip:0, take:this.state.dataState.take}
    //             }
    //              if(this.state.dataResult.data){
    //                  if(this.state.dataResult.data.length ===1){
    //                     let skipcount = this.state.dataState.skip > 0 ?(this.state.dataState.skip-this.state.dataState.take):
    //                     this.state.dataState.skip
    //                      dataState={skip:skipcount,take:this.state.dataState.take}
    //                  }
    //              }
    //             this.setState({
    //                 data: this.props.Login.masterData["SyncHistory"] ||[], selectedRecord: this.props.Login.selectedRecord,
    //                 dataResult: process(this.props.Login.masterData["SyncHistory"] || [], dataState),
    //                 dataState
    //             });
    //         }  
    //     }
    //     else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
    //         this.setState({ selectedRecord: this.props.Login.selectedRecord });
    //     }
    // }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "synchistory",
            methodUrl: "SyncHistory",
            displayName: this.props.intl.formatMessage({id:"IDS_SYNCHISTORY"}),
            userInfo: this.props.Login.userInfo,
            isClearSearch: this.props.Login.isClearSearch

        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {filterColumnData,
    callService, crudMaster, updateStore, getSyncHistoryDetail, SyncRecords
})(injectIntl(SyncHistory));

