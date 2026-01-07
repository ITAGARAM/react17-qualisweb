import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import { faSave} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row, Col } from 'react-bootstrap';

import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DataGrid from '../../../components/data-grid/data-grid.component';

class ParameterActionMapping extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: 10,
        };
        this.state = {
            selectedRecord: {}, dataState:dataState
        }
    }
    // dataStateChange = (event) => {
    //     this.setState({
    //         dataResult: process(this.props.addDesignParam, event.dataState),
    //         dataState: event.dataState
    //     });
    // }
    render() {

        return (
            <>
                <Row>
                    
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_CHILDPARAMETER" })}
                            isSearchable={true}
                            name={"nreportdesigncode"}
                            isDisabled={false}
                            placeholder="Please Select..."
                            isMandatory={true}
                            isClearable={true}
                            options={this.props.actionMappingChildList}
                            optionId='nreportdesigncode'
                            optionValue='sdisplayname'
                            value={this.props.selectedRecord["nreportdesigncode"] }
                            onChange={value => this.props.handleChange(value, "nreportdesigncode")}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                   
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_ACTIONPARAMETER" })}
                            isSearchable={true}
                            name={"nparentreportdesigncode"}
                            isDisabled={false}
                            placeholder="Please Select..."
                            isMandatory={true}
                            isClearable={true}
                            options={this.props.actionMappingParentList}
                            //optionId='nreportparametermappingcode'
                            optionId='nparentreportdesigncode'
                            optionValue='sparentparametername'
                            value={this.props.selectedRecord["nparentreportdesigncode"] }
                            onChange={value => this.props.handleChange(value, "nparentreportdesigncode")}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    {/* </Col>
                  
                    
                    <Col className="d-flex justify-content-end" md={12}> */}
                        <Button className="btn-user btn-primary-blue"
                            onClick={() => this.props.addActionInDataGrid(this.props.selectedRecord)}
                        >
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                        </Button>
                    </Col>
                </Row>
              
                    <Row noGutters>
                        <Col md={12}>
                             <DataGrid   primaryKeyField={"nreportparameteractioncode"}
                                        data={this.props.actionGridData || []}
                                        dataResult={process(this.props.actionGridData || [], this.state.dataState)}
                                        dataState={this.state.dataState}
                                        dataStateChange={(event)=> this.setState({dataState: event.dataState})}                                                           
                                        extractedColumnList={this.props.actionGridColumnList}
                                        controlMap={this.props.controlMap}
                                        userRoleControlRights={this.props.userRoleControlRights}
                                        inputParam={this.props.inputParam}
                                        userInfo={this.props.userInfo}
                                        deleteRecordWORights={this.props.deleteRecordWORights} 
                                        pageable={false}
                                        scrollable={"scrollable"}                                            
                                        isActionRequired={true}
                                        isToolBarRequired={false}
                                        //selectedId={this.props.selectedId}
                                        hideColumnFilter={true}
                                        hasControlWithOutRights={true}
                                        showdeleteRecordWORights={true}
                                    />
                        </Col>
                    </Row>
                
            </>
        );        
    }

  
}
export default injectIntl(ParameterActionMapping);
