import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
class  InstitiutionSiteTab extends React.Component{
    constructor(props) {
    super(props);
    this.state = ({
        siteDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
    });
}


       render(){
        const addSiteId = this.props.controlMap.has("AddInstitutionSite") && this.props.controlMap.get("AddInstitutionSite").ncontrolcode;
        const InstitutionSiteColumnList = [
            {"idsName":"IDS_INSTITUTIONSITE","dataField":"sinstitutionsitename","width":"150px"},
            {"idsName":"IDS_REGIONNAME","dataField":"sregionname","width":"150px"},
            {"idsName":"IDS_DISTRICTNAME","dataField":"sdistrictname","width":"150px"},
            {"idsName":"IDS_CITY","dataField":"scityname","width":"150px"},
            {"idsName":"IDS_COUNTRY","dataField":"scountryname","width":"150px"},
            {"idsName":"IDS_LIMSSITE","dataField":"ssitename","width":"150px"}
        ];

        const detailedFieldList = [
            { "idsName": "IDS_INSTITUTIONSITEADDRESS", "dataField": "sinstitutionsiteaddress", "width": "300px" },
            { "idsName": "IDS_REGIONCODE", "dataField": "sregioncode", "width": "250px" },
            { "idsName": "IDS_DISTRICTCODE", "dataField": "sdistrictcode", "width": "250px" },
          //  { "idsName": "IDS_CITYCODE", "dataField": "scitycode", "width": "250px" },
            { "idsName": "IDS_ZIPCODE", "dataField": "szipcode", "width": "250px" },
            { "idsName": "IDS_STATE", "dataField": "sstate", "width": "250px" },
            { "idsName": "IDS_LIMSSITECODE", "dataField": "ssitecode", "width": "250px" },
            { "idsName": "IDS_TELEPHONE", "dataField": "stelephone", "width": "250px" },
            { "idsName": "IDS_FAX", "dataField": "sfaxno", "width": "250px" },
            { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "250px" },
            { "idsName": "IDS_WEBSITE", "dataField": "swebsite", "width": "250px" },
        ];

        const methodUrl = "InstitutionSite";
        const methodParam = {screenName:this.props.intl.formatMessage({
            id: "IDS_INSTITUTIONSITE"
          }),
            instItem:this.props.selectedInstitution,operation:"create",userInfo:this.props.userInfo,
                             ncontrolCode: addSiteId,selectedRecord:this.props.selectedRecord,openChildModal:true};
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addsite" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addSiteId) === -1}
                            onClick={()=>this.props.getInstitutionSiteData(methodParam)}
                            >
                            <FontAwesomeIcon icon = { faPlus } /> { }
                            <FormattedMessage id="IDS_ADDSITE" defaultMessage="Add Site"></FormattedMessage>
                        </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                       selectedId = {this.props.selectedId}
                       key="institutitonsitekey"
                       primaryKeyField = "ninstitutionsitecode"
                       data = {this.props.InstitutionSiteData}
                       dataResult = {process(this.props.InstitutionSiteData||[],this.state.siteDataState)}
                       dataState = {this.state.siteDataState}
                       dataStateChange = {(event) => this.setState({ siteDataState: event.dataState })}
                       extractedColumnList = {InstitutionSiteColumnList}
                       detailedFieldList={detailedFieldList}
                       expandField="expanded" 
                       controlMap = {this.props.controlMap}
                       userRoleControlRights={this.props.userRoleControlRights}
                       inputParam = {this.props.inputParam}
                       userInfo = {this.props.userInfo}
                       deleteRecord = {this.props.deleteRecord}
                       fetchRecord ={this.props.fetchRecord}
                       editParam ={this.props.editParam}
                       onSwitchChange = {this.props.defaultRecord}
                       pageable={true}
                       scrollable={'scrollable'}
                       isActionRequired={true}
                       deleteParam={{operation:"delete", methodUrl,screenName:this.props.intl.formatMessage({
                        id: "IDS_INSTITUTIONSITE"})}}
                       methodUrl={methodUrl}
                       
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
}
componentDidUpdate(previousProps) {
    if (this.props.InstitutionSiteData !== previousProps.InstitutionSiteData) {
        let { siteDataState} = this.state;
        if (this.props.dataState=== undefined) {
            siteDataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
        }
        this.setState({ siteDataState });
    }

}
};

export default injectIntl(InstitiutionSiteTab);