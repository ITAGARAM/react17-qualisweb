import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
//import { transactionStatus } from '../../components/Enumeration';
import { process } from '@progress/kendo-data-query';
//const InstrumentSectionTab = (props) =>
class  InstrumentSectionTab extends React.Component{
    constructor(props) {
    super(props);
    this.state = ({
        sectionDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
    });
}


// dataStateChange = (event) => {
//     this.setState({
//         dataResult: process(this.props.Login.masterData["selectedSection"], event.dataState),
//         sectionDataState: event.dataState
//     });
//}
    render(){
        const addSectionId = this.props.controlMap.has("AddSection") && this.props.controlMap.get("AddSection").ncontrolcode;
        const instSectionColumnList = [
            {"idsName":"IDS_SECTION","dataField":"ssectionname","width":"150px"},
            {"idsName":"IDS_INCHARGE","dataField":"susername","width":"150px"}
            // {"idsName":"IDS_STATUS","dataField":"stransdisplaystatus","width":"150px", "componentName": "switch", 
            // "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultSection"}
        ];
        const methodUrl = "Section";
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addtestsection" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addSectionId) === -1}
                            onClick={()=>this.props.getAvailableInstData(this.props.selectedInstrument, 
                                "getInstrumentSection", "section", "IDS_SECTION", this.props.userInfo, addSectionId,this.props.selectedRecord)}
                            >
                            <FontAwesomeIcon icon = { faPlus } /> { }
                            <FormattedMessage id="IDS_ADDSECTION" defaultMessage="Add Section"></FormattedMessage>
                        </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                       key="instrumentsectionkey"
                       primaryKeyField = "ninstrumentsectioncode"
                       data = {this.props.InstrumentSection}
                       dataResult = {process(this.props.InstrumentSection||[],this.state.sectionDataState)}
                       dataState = {this.state.sectionDataState}
                       dataStateChange = {(event) => this.setState({ sectionDataState: event.dataState })}
                       extractedColumnList = {instSectionColumnList}
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
    if (this.props.InstrumentSection !== previousProps.InstrumentSection) {
        let { sectionDataState} = this.state;
        if (this.props.dataState=== undefined) {
                sectionDataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
        }
        this.setState({ sectionDataState });
    }

}
};

export default injectIntl(InstrumentSectionTab);