import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
class  SubmitterTab extends React.Component{
    constructor(props) {
    super(props);
    this.state = ({
        submitterMappingDataState: { skip: 0,take: this.props.settings ? parseInt(this.props.settings[14]) : 5  },
    });
}

    render(){
        const addSubmitterMapping = this.props.controlMap.has("AddSubmitterMapping") && this.props.controlMap.get("AddSubmitterMapping").ncontrolcode;
        const instSectionColumnList = [
            {"idsName":"IDS_INSTITUTIONCATEGORY","dataField":"sinstitutioncatname","width":"150px"},
            {"idsName":"IDS_INSTITUTION","dataField":"sinstitutionname","width":"150px"},
            {"idsName":"IDS_INSTITUTIONSITE","dataField":"sinstitutionsitename","width":"150px"}
            ];
        const methodUrl = "SubmitterMapping";

    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addtestsection" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addSubmitterMapping)  === -1}
                            onClick={()=>this.props.getInstitutionCategory(this.props.selectedSubmitter, 
                                "getInstitutionCategory", "site", "IDS_SITE", this.props.userInfo, addSubmitterMapping,this.props.selectedRecord,this.props.masterData)}
                            >
                            <FontAwesomeIcon icon = { faPlus } /> { }
                            <FormattedMessage id="IDS_SITE" defaultMessage="Add Site"></FormattedMessage>
                        </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                       key="submittermapping"
                       primaryKeyField = "nsubmittermappingcode"
                       data = {this.props.SubmitterMapping||[]}
                      // dataResult = {[]}
                      dataResult = {process(this.props.SubmitterMapping||[],this.state.submitterMappingDataState)}
                       dataState = {this.state.submitterMappingDataState||[]}
                       dataStateChange = {(event) => this.setState({ submitterMappingDataState: event.dataState })}
                       extractedColumnList = {instSectionColumnList}
                       controlMap = {this.props.controlMap}
                       userRoleControlRights={this.props.userRoleControlRights}
                       //inputParam = {this.props.inputParam}
                       userInfo = {this.props.userInfo}
                       deleteRecord={this.props.deleteRecord}
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
    if (this.props.SubmitterMapping !== previousProps.SubmitterMapping) {
        let { submitterMappingDataState} = this.state;
        if (this.props.dataState=== undefined) {
            submitterMappingDataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
        }
        this.setState({ submitterMappingDataState });
    }

}
};

export default injectIntl(SubmitterTab);