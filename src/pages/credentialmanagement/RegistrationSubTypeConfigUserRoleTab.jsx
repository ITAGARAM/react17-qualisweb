import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
//import { transactionStatus } from '../../components/Enumeration';
import { process } from '@progress/kendo-data-query';
//const InstrumentSectionTab = (props) =>
class  RegistrationSubTypeConfigUserRoleTab extends React.Component{
    constructor(props) {
    super(props);
    this.state = ({
        DataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
    });
}

render(){
    const addUserroleId = this.props.controlMap.has("AddUserrole") && this.props.controlMap.get("AddUserrole").ncontrolcode;
    const ColumnList = [
        {"idsName":"IDS_USERROLE","dataField":"sdeptname","width":"150px"},
        {"idsName":"IDS_USERNAME","dataField":"susername","width":"150px"},
        ];
    const methodUrl = "Userrole";
return (
    <>
        <div className="actions-stripe">
            <div className="d-flex justify-content-end">
                <Nav.Link name="addtestsection" className="add-txt-btn" 
                hidden={this.props.userRoleControlRights.indexOf(addUserroleId) === -1}
                        onClick={()=>this.props.getUserroleData(this.props.selectedRegSubType, 
                            "getInstrumentSection", "section", "IDS_USERROLE", this.props.userInfo, addUserroleId,this.props.selectedRecord)}
                        >
                        <FontAwesomeIcon icon = { faPlus } /> { }
                        <FormattedMessage id="IDS_USERROLE" defaultMessage="Add UserRole"></FormattedMessage>
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
                   //gridHeight = {'600px'}
                   isActionRequired={true}
                   deleteParam={{operation:"delete", methodUrl,screenName:this.props.screenName}}
                   methodUrl={methodUrl}
                 //  switchParam={{operation:"Default", methodUrl,screenName:this.props.screenName}}
                   
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

export default injectIntl(RegistrationSubTypeConfigUserRoleTab);