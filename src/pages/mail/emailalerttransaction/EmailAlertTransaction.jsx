import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import { ListWrapper } from '../../../components/client-group.styles';
import {
    callService, crudMaster,
    updateStore, validateEsignCredential,
} from '../../../actions';
// import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { getControlMap, getStartOfDay, getEndOfDay, convertDateValuetoString, rearrangeDateFormat } from '../../../components/CommonScript';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EmailAlertTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.searchRef = React.createRef();

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            showSaveContinue: true
        };

        this.extractedColumnList = [
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "200px" },
            { "idsName": "IDS_SUBJECT", "dataField": "ssubject", "width": "300px" },
            { "idsName": "IDS_SCREENNAME", "dataField": "sscreenname", "width": "250px" },
            { "idsName": "IDS_CONTROLNAME", "dataField": "scontrolname", "width": "250px" },
            { "idsName": "IDS_REFERENCEID", "dataField": "ssystemid", "width": "250px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "250px" },
            { "idsName": "IDS_CREATEDDATE", "dataField": "screateddate", "width": "250px" },
            // { "idsName": "IDS_TRANSACTIONDATE", "dataField": "stransdate", "width": "250px" },
            // { "idsName": "IDS_REASON", "dataField": "sreason", "width": "250px" },
            { "idsName": "IDS_MAILSTATUS", "dataField": "ssentstatus", "width": "200px" },

        ];
        this.detailedFieldList = [
            { "idsName": "IDS_TEMPLATEBODY", "dataField": "stemplatebody", "width": "300px", "isHTML": true }
        ];


    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
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


    render() {

        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate);
        }
        return (
            <>
                {/* <Preloader loadng={this.props.Login.loading}/> */}
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <Row>
                                <Col md={3}>
                                    <DateTimePicker
                                        name={"fromdate"}
                                        label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={this.state.selectedRecord["fromdate"] || fromDate}
                                        dateFormat={this.props.Login.userInfo.ssitedate}
                                        isClearable={false}
                                        onChange={date => this.handleDateChange("fromdate", date)}
                                        value={this.state.selectedRecord["fromdate"] || fromDate}

                                    />
                                </Col>
                                <Col md={3}>
                                    <DateTimePicker
                                        name={"todate"}
                                        label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={this.state.selectedRecord["todate"] || toDate}
                                        dateFormat={this.props.Login.userInfo.ssitedate}
                                        isClearable={false}
                                        onChange={date => this.handleDateChange("todate", date)}
                                        value={this.state.selectedRecord["todate"] || toDate}

                                    />
                                </Col>
                                {/* <Col></Col> */}
                            </Row>

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nrunningno"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    scrollable={"scrollable"}
                                    pageable={true}
                                    isComponent={true}
                                    gridHeight={'600px'}
                                    isToolBarRequired={true}
                                    expandField="expanded"
                                    detailedFieldList={this.detailedFieldList}
                                    selectedId={0}
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
            </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData.EmailAlertTransaction,
                    dataResult: process(this.props.Login.masterData.EmailAlertTransaction || [], this.state.dataState),
                });
            }
            else {
                if (this.props.Login.masterData.EmailAlertTransaction) {
                    this.setState({
                        data: this.props.Login.masterData.EmailAlertTransaction,
                        dataState : {skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5},
                        dataResult: process(this.props.Login.masterData.EmailAlertTransaction || [], {skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}),
                    });
                }
            }
        }



    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
       // this.setState({ selectedRecord });
       // this.reloadData(selectedRecord, true);

       let dateObj = {};
       if (dateName === "fromdate") {
            dateObj = convertDateValuetoString(dateValue, this.props.Login.masterData.toDate, this.props.Login.userInfo, true);
       }
       else{
            dateObj = convertDateValuetoString(this.props.Login.masterData.toDate, dateValue, this.props.Login.userInfo, true);
       }

       const inputParam = {
                                inputData: {
                                    "userinfo": this.props.Login.userInfo,
                                    fromDate:dateObj.fromDate, 
                                    toDate:dateObj.toDate,
                                },
                                classUrl: 'emailalerttransaction',
                                methodUrl: "EmailAlertTransaction",
                                displayName: "IDS_MAILALERTTRANSACTION",
                                userInfo: this.props.Login.userInfo
                            };
        this.props.callService(inputParam);
    }

    reloadData = (selectedRecord, isDateChange) => {
        //this.searchRef.current.value = "";
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
       
        // if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
        //     fromDate = getStartOfDay(selectedRecord["fromdate"]);
        //  }
        // if (selectedRecord && selectedRecord["todate"] !== undefined) {
        //     toDate = getEndOfDay(selectedRecord["todate"]);
        //  }
        let obj = convertDateValuetoString(fromDate,toDate, this.props.Login.userInfo, true);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate:obj.fromDate, 
                toDate:obj.toDate,
                // currentdate: isDateChange === true ? null : formatInputDate(new Date(), true)
            },
            classUrl: 'emailalerttransaction',
            methodUrl: "EmailAlertTransaction",
            displayName: "IDS_MAILALERTTRANSACTION",
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }


}
export default connect(mapStateToProps, {
    callService, crudMaster,
    updateStore, validateEsignCredential
})(injectIntl(EmailAlertTransaction));