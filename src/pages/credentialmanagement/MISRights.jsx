import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Card  } from 'react-bootstrap';
import { toast } from 'react-toastify';
import MISRightsTab from './MISRightsTab';
import {getAlertRightsComboDataService,getMISRightsDetail, callService, crudMaster,getReportRightsComboDataService,
    getDashBoardRightsComboDataService,filterColumnData, validateEsignCredential, updateStore,getHomeRightsComboDataService,getAlertHomeRightsComboDataService } from '../../actions';
import { getControlMap } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ContentPanel} from '../../components/App.styles';
import ListMaster from '../../components/list-master/list-master.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class MISRights extends React.Component {
    
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        // this.closeModal = this.closeModal.bind(this);
        this.extractedColumnList = [];
        this.userColumnList=[];
        this.fieldList = [];
       
       
        this.state = {
            availableDatas:"",
            availableList:"",
            dataSource: [], masterStatus: "", error: "", selectedRecord: {},
            isOpen: false,
            userRoleControlRights: [],
            sidebarview: false,
            controlMap: new Map()
        };
        this.searchRef = React.createRef();

        this.searchFieldList=["suserrolename"];
     
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
        return null;
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        } else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord ,selectedId:null}
        }
        this.props.updateStore(updateInfo);
    }


    render() {
      

        const filterParam = { inputListName :"UserRole", selectedObject : "SelectedMIS",  primaryKeyField: "nuserrolecode",
                             fetchUrl : "misrights/getMISRights", fecthInputObject : {userinfo:this.props.Login.userInfo},
                             masterData:this.props.Login.masterData, searchFieldList: this.searchFieldList
                            };
  

        return(<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4">
            <Row noGutters={true}>
                <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                    <Row noGutters={true}><Col md={12}>
                        <div className="list-fixed-wrap">
                            <ListMaster
                                screenName = {this.props.intl.formatMessage({id:"IDS_USERROLE"})}     
                                masterData ={this.props.Login.masterData}
                                userInfo = {this.props.Login.userInfo}                         
                                masterList = {this.props.Login.masterData.searchedData ||this.props.Login.masterData.UserRole}
                                getMasterDetail = {(MISRights)=>this.props.getMISRightsDetail(MISRights, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster = {this.props.Login.masterData.SelectedMIS}
                                primaryKeyField = "nuserrolecode"
                                mainField = "suserrolename"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                searchRef = {this.searchRef}
                                reloadData = {this.reloadData}
                                isMultiSelecct={false}
                                hidePaging={true}
                               />
                        </div>
                    </Col></Row>
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
                    <Row><Col md={12}>
                    <ContentPanel className="panel-main-content">
                        <Card className="border-0">
                            {this.props.Login.masterData.UserRole && this.props.Login.masterData.UserRole.length > 0 && this.props.Login.masterData.SelectedMIS ?
                                <>
                                <Card.Header>
                                    <Card.Title className="product-title-main">
                                            {this.props.Login.masterData.SelectedMIS.suserrolename}
                                    </Card.Title>
                                  
                                </Card.Header>                                   
                                <Card.Body>
                                    <MISRightsTab
                                               formatMessage={this.props.intl.formatMessage}
                                               operation={this.props.Login.operation}
                                               inputParam={this.props.Login.inputParam}
                                               screenName={this.props.Login.screenName}
                                               userInfo={this.props.Login.userInfo}
                                               masterData={this.props.Login.masterData}
                                               crudMaster={this.props.crudMaster}
                                               errorCode={this.props.Login.errorCode}
                                               masterStatus={this.props.Login.masterStatus}
                                               openChildModal={this.props.Login.openChildModal}
                                               DashBoardType={this.props.Login.DashBoardType}
                                               Reports={this.props.Login.Reports}
                                               Alert={this.props.Login.Alert}
                                               HomeRights={this.props.Login.HomeRights}
                                               AlertHomeRights={this.props.Login.AlertHomeRights}
                                               updateStore={this.props.updateStore}
                                               selectedRecord={this.props.Login.selectedRecord}
                                               getDashBoardRightsComboDataService={this.props.getDashBoardRightsComboDataService}
                                               getReportRightsComboDataService={this.props.getReportRightsComboDataService}
                                               getAlertRightsComboDataService={this.props.getAlertRightsComboDataService}
                                               getHomeRightsComboDataService={this.props.getHomeRightsComboDataService}
                                               getAlertHomeRightsComboDataService={this.props.getAlertHomeRightsComboDataService}
                                               ncontrolCode={this.props.Login.ncontrolCode}
                                               userRoleControlRights={this.state.userRoleControlRights}
                                               esignRights={this.props.Login.userRoleControlRights}
                                               screenData={this.props.Login.screenData}
                                               validateEsignCredential={this.props.validateEsignCredential}
                                               loadEsign={this.props.Login.loadEsign}
                                               controlMap={this.state.controlMap}
                                               showAccordian={this.state.showAccordian}
                                               //selectedId={this.props.Login.selectedId}
                                               dataState={this.props.Login.dataState}
                                               onTabChange={this.onTabChange}
                                               searchRef = {this.searchRef}
                                               updateDataState = {this.props.Login.masterData.updateDataState}
                                            />
                                </Card.Body>                                
                                </>
                                :""
                            }
                        </Card>
                    </ContentPanel>
                    </Col></Row>
                </Col>
            </Row>    
            </div>
               
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
                    userRoleControlRights, controlMap
                   
                });
            }
           
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
           
        }   
    }

    reloadData = () => {
        this.searchRef.current.value = "";

        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },

            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "MISRights",
            displayName:"MIS Rights",
            userInfo: this.props.Login.userInfo
           // displayName: this.props.Login.inputParam.displayName
        };

        this.props.callService(inputParam);
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
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

}
export default connect(mapStateToProps, { getAlertRightsComboDataService,getMISRightsDetail,callService,filterColumnData,getReportRightsComboDataService,
    getDashBoardRightsComboDataService, crudMaster, validateEsignCredential, updateStore,getHomeRightsComboDataService ,getAlertHomeRightsComboDataService})(injectIntl(MISRights));