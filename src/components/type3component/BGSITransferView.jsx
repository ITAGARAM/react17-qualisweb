import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';

import { showEsign, getControlMap, extractFieldHeader, formatInputDate, validateEmail, rearrangeDateFormatDateOnly } from '../CommonScript';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class BGSITransferView extends Component {

    constructor(props) {
            super(props);
            const dataState = {
            skip: 0,
            take: 5, 
             };
             
        const safeData = Array.isArray(props.bgsiTransferData)
            ? props.bgsiTransferData
            : Array.isArray(props.bgsiTransferData?.data)
            ? props.bgsiTransferData.data
            : [];
            this.state = ({
                selectedRecord: {},
                error: "",
                 dataResult: [],
                 data:[],
                 dataState: dataState,
                 sidebarview: false,
                // bgsidataview: safeData && process(safeData,dataState) || [],
                bgsidataview: safeData && safeData || [],
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
  const { bgsidataview } = this.state;


const safeData = Array.isArray(this.props.bgsiTransferData)
            ? this.props.bgsiTransferData
            : Array.isArray(this.props.bgsiTransferData?.data)
            ? this.props.bgsiTransferData.data
            : [];


this.setState({
    // dataResult: process(this.state.data, event.dataState),
    dataResult: process(bgsidataview, event.dataState),
    dataState: event.dataState
  });
};





render() {

    const bgsiTransferColumnList = [
        
        //{"idsName":"IDS_TEMPERATURE","dataField":"stemperature","width":"150px"},
        //{"idsName":"IDS_COURIERNAME","dataField":"scouriername","width":"150px"},
        //{"idsName":"IDS_STATUS","dataField":"status","width":"150px"},
        //{"idsName":"IDS_TRANSFERSTATUS","dataField":"transferstatus","width":"150px"},
        {"idsName":"IDS_REPOSITORYCODE","dataField":"srepositorycode","width":"150px"},
        {"idsName":"IDS_POSITIONCODE","dataField":"spositioncode","width":"150px"},
        {"idsName":"IDS_PARENTSAMPLECODE","dataField":"sparentsamplecode","width":"150px"},
        {"idsName":"IDS_COHORTNO","dataField":"ncohortno","width":"150px"},
        {"idsName":"IDS_STORAGECODE","dataField":"storagecode","width":"150px"},
        {"idsName":"VOLUME","dataField":"nqty","width":"150px"},
        {"idsName":"IDS_TRANSFERDATE","dataField":"stransferdate","width":"250px"}
    ];
    const methodUrl = "BGSITransfer";
    const gridData = Array.isArray(this.state.bgsidataview)
  ? this.state.bgsidataview
  : this.state.bgsidataview
    ? [this.state.bgsidataview]
    : [];


    return (
        <>
            
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        //key="methodvaliditykey"
                        primaryKeyField = "ntransferdetcode"
                        // selectedId={props.operation === "update" ? props.selectedId : props.selectedComponent ?
                        // props.selectedComponent.nmethodvaliditycode : null}
                        data = {this.state.bgsidataview?.data || []}
                        //data={gridData}
                         dataResult = { this.state.bgsidataview}
                         //dataResult = {process(this.state.bgsidataview,this.state.dataState)}
                         dataState = {this.state.dataState}
                        dataStateChange = {this.dataStateChange}
                        
                        extractedColumnList = {bgsiTransferColumnList}
                        controlMap = {this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        //fetchRecord={props.fetchMethodValidityById}
                        //editParam={props.editParam}
                        isRefreshRequired = {false}
                        isDownloadPDFRequired={false}
                        isDownloadExcelRequired={false}
                        inputParam = {this.state.inputParam}
                        userInfo = {this.state.userInfo}
                        //deleteRecord = {props.deleteRecord}
                        //handleRowClick={props.handleComponentRowClick}
                        pageable={true}
                        scrollable={'scrollable'}
                        gridHeight = {'580px'}
                        isToolBarRequired={true}
                        //isActionRequired={true}
                        //deleteParam={{operation:"delete", methodUrl}}
                        methodUrl={methodUrl}
                        hideColumnFilter={false}
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

componentDidUpdate(previousProps) {
        if (this.props.Login.bgsiTransferData !== previousProps.Login.bgsiTransferData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData ? this.props.Login.masterData : [], this.state.dataState),
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
                    data: this.props.bgsiTransferData, selectedRecord: this.props.Login.bgsiTransferData,
                    dataResult: process(this.props.Login.bgsiTransferData ? this.props.Login.bgsiTransferData : [], dataState),
                    dataState
                              

                });
            }
        }

        

        

        
    }

};

//export default injectIntl(BGSITransferView);
export default connect(mapStateToProps, { })(injectIntl(BGSITransferView));