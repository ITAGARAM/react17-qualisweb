import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { ListWrapper } from '../../../components/client-group.styles';
import { callService, crudMaster, validateEsignCredential, updateStore } from '../../../actions';
import { getControlMap, showEsign } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import { transactionStatus } from '../../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EmailStatus extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.fieldList = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map()
        };
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
        this.setState({
            dataResult: process(this.props.Login.masterData, event.dataState),
            dataState: event.dataState
        });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
                loadEsign = false;
                openModal = false;
        } else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,selectedId:null }
        }
        this.props.updateStore(updateInfo);
    }

    render() {
        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "controlType": "textbox", "idsName": "IDS_SUBJECT", "dataField": "ssubject", "width": "250px" },
                { "controlType": "textbox", "idsName": "IDS_RECIPICIENT", "dataField": "srecipientusers", "width": "250px" },
                { "controlType": "textbox", "idsName": "IDS_MAILSTATUS", "dataField": "ssentstatus", "width": "250px" },
                { "controlType": "textbox", "idsName": "IDS_SENTDATE", "dataField": "stransdate", "width": "250px" },
            ]
        }

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nrunningno"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                   // detailedFieldList={this.detailedFieldList}
                                    //expandField="expanded"
                                    formatMessage={this.props.intl.formatMessage}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    //fetchRecord={this.props.fetchEmailHostById}
                                  //  deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    //editParam={editParam}
                                   // deleteParam={deleteParam}
                                   // addRecord={() => this.props.openEmailHostModal("IDS_MAILHOST", "create", "nemailhostcode", this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                    // isComponent={true}
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    scrollable={"scrollable"}
                                    selectedId={this.props.Login.selectedId}
                                    reSent={this.reSent}
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>   
                {this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : ""
                        }
                    />
                }
               
            </>
        );
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    reSent=(event,operation,ncontrolcode)=>{
        const inputParam = {
            classUrl: "emailstatus",
            methodUrl: "reSentMail",

            inputData: {
                "nrunningno": event.nrunningno,
                "ncontrolcode": ncontrolcode,
                "userinfo": this.props.Login.userInfo
            },
            operation: "create",
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: "create"

                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        } 
    }

   

    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },

            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "EmailStatus",
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.inputParam.displayName
        };

        this.props.callService(inputParam);
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
   

}
export default connect(mapStateToProps, { callService, crudMaster, validateEsignCredential, updateStore })(injectIntl(EmailStatus));