import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListWrapper } from '../../components/client-group.styles';
import { callService, updateStore, crudMaster, SyncRecords } from '../../actions';
import { getControlMap } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SyncConfiguration extends React.Component {

    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };

        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map()
        };
    };

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
            dataResult: process(this.state.data.JsonExceptionLogs, event.dataState),
            dataState: event.dataState
        });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);
    }

    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },

            classUrl: "syncconfiguration",
            methodUrl: "SyncConfiguration",
            displayName: this.props.Login.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }



    render() {
      
        const syncConfiguration = this.state.controlMap.has("Sync Configuration") && this.state.controlMap.get("Sync Configuration").ncontrolcode;

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "idsName": "IDS_TRANSFERID", "dataField": "stransferid", "width": "200px" },
                { "idsName": "IDS_STATUS", "dataField": "sstatuscode", "width": "200px" },
                { "idsName": "IDS_TRANSFERTYPE", "dataField": "stransfertype", "width": "200px" },
                { "idsName": "IDS_DATETIME", "dataField": "dmodifieddate", "width": "200px" }
            ]
           
        }
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <Row>
                                <Col md={3}>
                                    <Button className="btn-user btn-primary-blue"
                                     hidden={this.state.userRoleControlRights.indexOf(syncConfiguration) === -1}
                                      onClick={() => this.props.SyncRecords(this.props.Login.userInfo)}>
                                        <FontAwesomeIcon icon={faSync} /> { }
                                        <FormattedMessage id='IDS_SYNC' defaultMessage='Sync' />
                                    </Button>
                                </Col>
                                <Col md={3}>

                                </Col>

                            </Row>

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nsynchistorycode"}
                                    selectedId={this.props.Login.selectedId}
                                    data={this.state.data.syncHistory}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    reloadData={this.reloadData}
                                    scrollable={"scrollable"}
                                    gridHeight={"600px"}
                                    isActionRequired={false}
                                    isToolBarRequired={true}
                                    pageable={true}
                                    isAddRequired={false}
                                    isDownloadPDFRequired={false}
                                // actionIcons={[{
                                //     title: this.props.intl.formatMessage({ id: "IDS_VIEW" }),
                                //     controlname: "faEye",
                                //     objectName: "ExceptionLogs",
                                //     hidden: this.state.userRoleControlRights.indexOf(viewJsonExceptionLogs) === -1,
                                //     onClick: (viewJsonExceptionLogs) => this.viewJsonExceptionLogs(viewJsonExceptionLogs)
                                // }]}
                                />
                                : ""}

                        </ListWrapper>
                    </Col>
                </Row>
            </>
        );
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
                    dataResult: process(this.props.Login.masterData.syncHistory, this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.syncHistory ? this.props.Login.masterData.syncHistory : [], dataState),
                    //dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
}

export default connect(mapStateToProps, { callService, updateStore, crudMaster, SyncRecords })(injectIntl(SyncConfiguration));