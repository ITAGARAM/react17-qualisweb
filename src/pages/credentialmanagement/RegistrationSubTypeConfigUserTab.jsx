import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
//import { transactionStatus } from '../../components/Enumeration';
import { process } from '@progress/kendo-data-query';
//const InstrumentSectionTab = (props) =>
class  RegistrationSubTypeConfigUserTab extends React.Component{
    constructor(props) {
    super(props);
    this.state = ({
        DataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
    });
}


// dataStateChange = (event) => {
//     this.setState({
//         dataResult: process(this.props.Login.masterData["selectedSection"], event.dataState),
//         sectionDataState: event.dataState
//     });
//}
    render(){
        const addUserId = this.props.controlMap.has("AddUser") && this.props.controlMap.get("AddUser").ncontrolcode;
        const ColumnList = [
            {"idsName":"IDS_USERNAME","dataField":"susername","width":"150px"},
            ];
            const methodUrl = "User";
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addtestsection" className="add-txt-btn" 
                    hidden={this.props.userRoleControlRights.indexOf(addUserId) === -1}
            onClick={()=>this.props.getListofUsers(this.props.selectedRegSubType, 
                            "getInstrumentSection", "section", "IDS_USERS", this.props.userInfo, addUserId,this.props.selectedRecord)}
                        >
                            <FontAwesomeIcon icon = { faPlus } /> { }
                            <FormattedMessage id="IDS_USERS" defaultMessage="Add Users"></FormattedMessage>
                        </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                     key="transfiltertypeconfigkey"
                     primaryKeyField = "ntransfiltertypeconfigcode"
                       data = {this.props.DepartmentAndUser}
                       dataResult = {process(this.props.DepartmentAndUser||[],this.state.DataState)}
                       dataState = {this.state.DataState}
                       dataStateChange = {(event) => this.setState({ DataState: event.dataState })}
                       extractedColumnList = {ColumnList}
                       controlMap = {this.props.controlMap}
                       userRoleControlRights={this.props.userRoleControlRights}
                       inputParam = {this.props.inputParam}
                       userInfo = {this.props.userInfo}
                       deleteRecord = {this.props.deleteRecord}
                       onSwitchChange = {this.props.defaultRecord}
                       pageable={true}
                       scrollable={'scrollable'}
                       isActionRequired={true}
                       deleteParam={{operation:"delete", methodUrl,screenName:this.props.screenName}}
                       methodUrl={methodUrl}                      
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
}
componentDidUpdate(previousProps) {
    if (this.props.DepartmentAndUser !== previousProps.DepartmentAndUser) {
        let { DataState} = this.state;
        if (this.props.dataState=== undefined) {
            DataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
        }
        this.setState({ DataState });
    }

}
};

export default injectIntl(RegistrationSubTypeConfigUserTab);