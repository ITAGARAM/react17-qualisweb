import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import {
    getExportExcel
} from '../../actions';
import { showEsign, getControlMap, extractFieldHeader, formatInputDate, validateEmail, rearrangeDateFormatDateOnly } from '../../components/CommonScript';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class AuditArchivalHistory extends Component {

    constructor(props) {
            super(props);
            const dataState = {
            skip: 0,
            take: 5, 
             };
             
        // const safeData = Array.isArray(props.bgsiTransferData)
        //     ? props.bgsiTransferData
        //     : Array.isArray(props.bgsiTransferData?.data)
        //     ? props.bgsiTransferData.data
        //     : [];
            this.state = ({
                selectedRecord: {},
                error: "",
                 dataResult: [],
                 data:[],
                 dataState: dataState,
                 sidebarview: false,
                // bgsidataview: safeData && process(safeData,dataState) || [],
                //bgsidataview: safeData && safeData || [],
                controlMap:props.controlMap,
                userRoleControlRights: props.userRoleControlRights,
                inputParam:props.inputParam,
                userInfo:props.userInfo
            });

           
            this.searchRef = React.createRef();
           
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



dataStateChange = (event) => {
        if (this.props.selectedRecord["nauditactionfiltercode"].value === 1) {
            this.setState({
                dataResult: process(this.props.auditArchivalHistory || [], event.dataState),
                dataStateAll: event.dataState, kendoSkip: event.dataState.skip, kendoTake: event.dataState.skip
            });
        }
        else {
            let data = [];
            if (event.dataState.filter === null && event.dataState.sort === null) {
                let auditdata = (this.props.auditArchivalHistory &&
                    this.props.auditArchivalHistory.slice(0,
                        event.dataState.take + event.dataState.skip)) || []
                data = process(auditdata || [], event.dataState)
            } else {

                data = process(this.props.auditArchivalHistory || [], event.dataState)

            }
            this.setState({
                dataResult: data,
                dataState: event.dataState,
            });
        }
    }





render() {

    this.extractedColumnList = [
        {"idsName":"IDS_AUDITDATE","dataField":"sauditdate","width":"150px"},
        {"idsName":"IDS_VIEWTYPE","dataField":"sviewPeriod","width":"150px"},
        {"idsName":"IDS_COMMENTS","dataField":"scomments","width":"150px"},
        {"idsName":"IDS_MODULENAME","dataField":"smodulename","width":"150px"},
        {"idsName":"IDS_FORMNAME","dataField":"sformname","width":"150px"},
        {"idsName":"IDS_USERROLE","dataField":"suserrolename","width":"150px"},
        {"idsName":"IDS_USERNAME","dataField":"susername","width":"150px"}
    ];
    const methodUrl = "BGSITransfer";
//     const gridData = Array.isArray(this.state.bgsidataview)
//   ? this.state.bgsidataview
//   : this.state.bgsidataview
//     ? [this.state.bgsidataview]
//     : [];


    return (
        <>
            
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        
                        primaryKeyField = "nauditarchivalcode"
                        
                        data = {this.props.auditArchivalHistory || []}
                        
                         //dataResult = { {'data': this.props.auditArchivalHistory || []}}
                         dataResult={this.props.auditArchivalHistory && this.props.auditArchivalHistory.length > 0
                                    && process(this.props.auditArchivalHistory,{ skip: 0, take: 50 })}
                        //dataState = {this.state.dataState}
                        //dataStateChange = {this.dataStateChange}
                        dataState= {this.props.selectedRecord["nauditactionfiltercode"] && this.props.selectedRecord["nauditactionfiltercode"].value === 1 ? this.props.dataStateAll
                                      : this.props.dataState}
                        dataStateChange={this.dataStateChange}
                        extractedColumnList = {this.extractedColumnList}
                        controlMap = {this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        //fetchRecord={props.fetchMethodValidityById}
                        //editParam={props.editParam}
                       isToolBarRequired={true}
                       isAddRequired={false}
                       isSyncRequired={false}
                       isRefreshRequired={false}
                       isDownloadPDFRequired={false}
                       isDownloadExcelRequired={true}
                       isExportExcelRequired={false}
                        inputParam = {this.state.inputParam}
                        userInfo = {this.state.userInfo}
                        //deleteRecord = {props.deleteRecord}
                        //handleRowClick={props.handleComponentRowClick}
                        pageable={true}
                        scrollable={'scrollable'}
                        gridHeight = {'580px'}
                        
                        //isActionRequired={true}
                        //deleteParam={{operation:"delete", methodUrl}}
                        methodUrl={methodUrl}
                        hideColumnFilter={false}
                        //exportExcelNew={this.exportExcelNew}
                        //onSwitchChange = {props.defaultRecord}
                        //switchParam={{operation:"Default", methodUrl}} 
                        //approveRecord={props.onApproveClick}
                        >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
}
exportExcelNew = () => {
        
       // const csvfields=[];
        let dataField={};
        [...this.extractedColumnList].map((item)=>{
            
             dataField[item.dataField]=this.props.intl.formatMessage({ id: item.idsName })
            
            
         })

        
        let inputData = {
            // fromDate: obj.fromDate,
            // toDate: obj.toDate,
            // modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
            // formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
            // usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
            // userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
            // viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,
            // viewArchivaltypecode: this.state.selectedRecord["nauditarchivaltypecode"] ? this.state.selectedRecord["nauditarchivaltypecode"].value : 0,
            userinfo: this.props.Login.userInfo,
            //sauditdate: this.props.Login.masterData.SelectedAuditTrail.saudittraildate,
            nauditformcode: 78,
            ncontrolcode: 78,
            dataField

        }

        let inputParam = { inputData }
        this.props.getExportExcel(inputParam);
        
    }
componentDidUpdate(previousProps) {
        //if (this.props.Login.masterData !== previousProps.Login.masterData) {
        if (this.props.auditArchivalHistory !== previousProps.auditArchivalHistory) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.auditArchivalHistory ? this.props.auditArchivalHistory : [], this.state.dataState),
                });
            } else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.state.dataState.take }
                }
                if (this.state.dataResult.data) {
                    if (this.state.dataResult.data.length === 1) {
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }
                }
                
                this.setState({
                    //data: this.props.Login.bgsiTransferData, selectedRecord: this.props.Login.bgsiTransferData,
                    data: this.props.auditArchivalHistory, selectedRecord: this.props.auditArchivalHistory,
                    dataResult: process(this.props.auditArchivalHistory ? this.props.auditArchivalHistory : [], dataState),
                    dataState
                              

                });
            }
        }

        

        

        
    }

};

//export default injectIntl(BGSITransferView);
export default connect(mapStateToProps, { getExportExcel})(injectIntl(AuditArchivalHistory));