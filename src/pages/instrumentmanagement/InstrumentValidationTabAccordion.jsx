import React from 'react';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl } from 'react-intl';
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText } from '../../components/App.styles';
import InstrumentValidationFile from './InstrumentValidationFile';
import {rearrangeDateFormatDateOnly
} from '../../components/CommonScript';


const InstrumentValidationTabAccordion = (props) => {
    let dataFieldName = "";
        dataFieldName = [{ "sinstrumentid": "IDS_INSTRUMENTID" },{"sinstrumentname":"IDS_INSTRUMENTNAME"},
        { "svalidationdate": "IDS_VALIDATIONDATE" },
        { "stransdisplaystatus": "IDS_VALIDATIONSTATUS" }, { "sremark": "IDS_REMARKS" }];
   
    const editInstrumentValidationId = props.controlMap.has("EditInstrumentValidation") && props.controlMap.get("EditInstrumentValidation").ncontrolcode;
    const deleteInstrumentValidationId = props.controlMap.has("DeleteInstrumentValidation") && props.controlMap.get("DeleteInstrumentValidation").ncontrolcode;

    const {selectedInstrumentValidation, userInfo } = props;
    return (
        <>
            <Row>
                <Col md={12} className="d-flex justify-content-end">
                  
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_EDIT" })}
                        //data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(editInstrumentValidationId) === -1}
                        onClick={()=>props.getDataForAddEditValidation("IDS_INSTRUMENTVALIDATION","update", props.userInfo, editInstrumentValidationId,props.selectedRecord,props.masterData,"ninstrumentvalidationcode")}>    
                         <FontAwesomeIcon icon={faPencilAlt} />
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DELETE" })}
                        //data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(deleteInstrumentValidationId) === -1}

                        onClick={() => props.ConfirmDelete({operation:'delete',screenName:'IDS_INSTRUMENTVALIDATION'},deleteInstrumentValidationId)}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                       
                    </Nav.Link>
                </Col>
            </Row>
            <Row>
              {dataFieldName.map((item,i) => {
                    return (
                        <Col md="6">
                            <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>

                                <ReadOnlyText>{Object.keys(item)[0]==='svalidationdate'?
                                rearrangeDateFormatDateOnly(props.userInfo,
                                    selectedInstrumentValidation[Object.keys(item)[0]]):
                                    selectedInstrumentValidation[Object.keys(item)[0]]
                                    }</ReadOnlyText>

                            </FormGroup>
                        </Col>
                    )
                })}  
                  
            
            </Row>
             <InstrumentValidationFile
                        selectedInstrumentValidation={selectedInstrumentValidation}
                        userInfo={props.userInfo}
                        userRoleControlRights={props.userRoleControlRights}
                        openModal={props.addFormula}
                        controlMap={props.controlMap}
                        addfilecllick={props.addfilecllick}
                        addInstrumentFile={props.addInstrumentFile}
                        FileData={props.FileData}
                        deleteTabFileRecord={props.deleteTabFileRecord}
                        viewInstrumentFile={props.viewInstrumentFile}

                    /> 
        </>
    );

};

export default injectIntl(InstrumentValidationTabAccordion);