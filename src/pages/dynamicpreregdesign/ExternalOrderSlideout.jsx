import { process } from '@progress/kendo-data-query';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { MediaHeader } from '../../components/App.styles';

class ExternalOrderSlideout extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0
        };

        this.state = {
            data: this.props.dynamicExternalSample,
            dataResult: process(this.props.dynamicExternalSample, dataState),
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            dynamicGridSelectedId: this.props.dynamicGridSelectedId

        };
        this.parentColumnList = [{ "idsName": "IDS_SAMPLEID", "dataField": "sexternalsampleid", "width": "185px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                                { "idsName": "IDS_COMPONENT", "dataField": "scomponentname", "width": "185px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                                { "idsName": "IDS_SAMPLEQTY", "dataField": "ssampleqty", "width": "185px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                                ];

        this.childColumnList = [{ "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            // { "idsName": "IDS_DEFAULTROLE", "dataField": "sdefaultstatus", "width": "100px" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        ];
    }


    dataStateChange = (event) => {
        this.setState({ dataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
    }

    handleExpandChange = (row, dataState) => {
        this.setState({ dynamicGridSelectedId: Object.keys(row["dataItem"]["nexternalordersamplecode"]) })
    }

    render() {
        return (
            <>
                <Row className="mb-4">
                    <Col md={12}>

                        <MediaHeader className={`labelfont`} style={{"font-size":"20px"}}>{this.props.selectedDynamicViewControl.label}:{" " + this.props.selectedRecord[this.props.selectedDynamicViewControl.label].label}</MediaHeader>
                        {/* <MediaSubHeader>
                            <MediaLabel className={`labelfont`}>Parameter: {props.selecteRecord.sparametersynonym}</MediaLabel>
                        </MediaSubHeader> */}
                    </Col>
                </Row>
                <Row>
                    <DataGrid
                        primaryKeyField={"nusercode"}
                        data={this.state.data}
                        dataResult={this.state.dataResult}
                        dataState={this.state.dataState}
                        dataStateChange={this.dataStateChange}
                        extractedColumnList={this.parentColumnList}
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        inputParam={this.props.inputParam}
                        userInfo={this.props.userInfo}
                        isRefreshRequired={false}
                        isImportRequired={false}
                        hideColumnFilter={true}
                        //methodUrl="SectionUsers"
                        //  deleteRecord={this.deleteRecord}
                        // deleteParam={usersDeleteParam}
                        pageable={false}
                        scrollable={"scrollable"}
                        //isComponent={false}
                        //isActionRequired={true}
                        isToolBarRequired={false}
                        selectedId={this.state.dynamicGridSelectedId}
                        expandField="expanded"
                        handleExpandChange={this.handleExpandChange}
                        hasChild={true}
                        childColumnList={this.childColumnList}
                        childMappingField={"nexternalordersamplecode"}
                        childList={this.props.dynamicExternalTestChild || new Map()}
                    /**Uncomment below handleRowClick when row click is needed */
                    //handleRowClick={this.handleRowClick}  
                    />
                </Row>
            </>
        )

    }
}
export default injectIntl(ExternalOrderSlideout);