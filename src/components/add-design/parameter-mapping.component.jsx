import React from 'react'
import { FormattedMessage, injectIntl} from 'react-intl';
import { process } from '@progress/kendo-data-query';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row, Col} from 'react-bootstrap';

import FormSelectSearch from '../form-select-search/form-select-search.component';
import DataGrid from '../data-grid/data-grid.component';

class ParameterMapping extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: 10,
            group: [{ field: 'schildparametername' }]
        };
        this.state = {
            dataState:dataState, dataResult:[],
            selectedRecord: {},
            
        }
    }

    render() {    
       return (
            <>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: this.props.inputColumnList[0].idsName })}
                            name={this.props.inputColumnList[0].dataField}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD"})}                             
                            options={this.props[this.props.inputColumnList[0].listName]}
                            //optionId={this.props.inputColumnList[0].optionId}
                            //optionValue={this.props.inputColumnList[0].optionValue}
                            value={this.props.selectedRecord[this.props.inputColumnList[0].dataField] }
                            closeMenuOnSelect={true}  
                            isMulti={false}                        
                            isSearchable={true}
                            isDisabled={false}                          
                            isMandatory={true}
                            isClearable={false}
                            //alphabeticalSort={true}
                            onChange={value => this.props.handleChange(value, this.props.inputColumnList[0].dataField)}
                           
                        />

                        <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: this.props.inputColumnList[1].idsName })}
                                name={this.props.inputColumnList[1].dataField}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD"})}                             
                                options={this.props[this.props.inputColumnList[1].listName]}
                                //optionId={this.props.inputColumnList[1].optionId}
                                //optionValue={this.props.inputColumnList[1].optionValue}
                                value={this.props.selectedRecord[this.props.inputColumnList[1].dataField] }
                                closeMenuOnSelect={true}                          
                                isSearchable={true}
                                isMandatory={true}
                                isMulti={false}
                                isClearable={false}
                                //alphabeticalSort={true}
                                onChange={value => this.props.handleChange(value, this.props.inputColumnList[1].dataField)}
                            
                            />
                    
                        <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: this.props.inputColumnList[2].idsName })}
                                name={this.props.inputColumnList[2].dataField}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD"})}                             
                                options={this.props[this.props.inputColumnList[2].listName]}
                                //optionId={this.props.inputColumnList[2].optionId}
                                //optionValue={this.props.inputColumnList[2].optionValue}
                                value={this.props.selectedRecord[this.props.inputColumnList[2].dataField] }
                                closeMenuOnSelect={true}                          
                                isSearchable={true}
                                isMandatory={true}
                                isMulti={false}
                                isClearable={false}
                               // alphabeticalSort={true}
                                onChange={value => this.props.handleChange(value, this.props.inputColumnList[2].dataField)}
                            
                            />         

                        {/* <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: this.props.inputColumnList[3].idsName })}
                                name={this.props.inputColumnList[3].dataField}
                                placeholder="Please Select..."                           
                                options={this.props[this.props.inputColumnList[3].listName]}
                                optionId={this.props.inputColumnList[3].optionId}
                                optionValue={this.props.inputColumnList[3].optionValue}
                                value={this.props.selectedRecord[this.props.inputColumnList[3].dataField] }
                                closeMenuOnSelect={true}                          
                                isSearchable={true}
                                isMandatory={true}
                                isMulti={false}
                                isClearable={false}
                                alphabeticalSort={true}
                                onChange={value => this.props.handleChange(value, this.props.inputColumnList[3].dataField)}
                            
                            />      */}
                 
                    <div className = "d-flex justify-content-end pad-15">
                        <Button className="btn-user btn-primary-blue"
                            onClick={() => this.props.addParametersInDataGrid(this.props.selectedRecord)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                        </Button>
                    </div>
               
                   <DataGrid   primaryKeyField={"nreportparametercode"}
                                data={this.props.mappingGridData || []}
                                dataResult={process(this.props.mappingGridData || [], this.state.dataState)}
                                dataState={this.state.dataState}
                                dataStateChange={(event)=> this.setState({dataState: event.dataState})}                                                           
                                //extractedColumnList={this.props.mappingGridColumnList}
                                controlMap={this.props.controlMap}
                                userRoleControlRights={this.props.userRoleControlRights}
                                inputParam={this.props.inputParam}
                                userInfo={this.props.userInfo}
                                deleteRecordWORights={this.props.deleteRecordWORights} 
                                pageable={false}
                                scrollable={"scrollable"}                                            
                                isActionRequired={true}
                                isToolBarRequired={false}
                                selectedId={null}
                                hideColumnFilter={true}
                                hasControlWithOutRights={true}
                                showdeleteRecordWORights={true}
                                gridHeight={'300px'}
                                extractedColumnList={this.props.detailedFieldList}
                                onSwitchChange = {this.props.bindActionParameter}
                                groupable={false}
                               // switchParam={{methodUrl:''}}
                            />
                </Col>
            </Row>
            {/* <Row>
                <Col>

                    <b><FormattedMessage id='IDS_ACTIONPARAMETER' defaultMessage='Action Parameter' /></b>
                   
                    <DataGrid   primaryKeyField={"nreportparameteractioncode"}
                                data={this.props.actionGridData || []}
                                dataResult={this.props.actionGridData || []}
                                //dataState={this.state.dataState}
                                //dataStateChange={(event)=> this.setState({dataState: event.dataState})}                                                           
                                extractedColumnList={this.props.actionGridColumnList}
                                controlMap={this.props.controlMap}
                                userRoleControlRights={this.props.userRoleControlRights}
                                inputParam={this.props.inputParam}
                                userInfo={this.props.userInfo}
                                deleteRecordWORights={this.props.deleteActionParameter} 
                                pageable={false}
                                scrollable={"scrollable"}                                            
                                isActionRequired={true}
                                isToolBarRequired={false}
                                //selectedId={this.props.selectedId}
                                hideColumnFilter={true}
                                hasControlWithOutRights={true}
                                showdeleteRecordWORights={true}
                                gridHeight={'300px'}
                            />
                    </Col>
                </Row> */}
            </>
        );        
    }

  
}
export default injectIntl(ParameterMapping);
