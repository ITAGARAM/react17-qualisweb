import React from 'react';
import { faCalendarMinus, faCalendarPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl } from 'react-intl';
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText } from '../../components/App.styles';
import InstrumentCalibrationFile from './InstrumentCalibrationFile';
import {rearrangeDateFormatDateOnly} from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';


const InstrumentCalibrationTabAccordion = (props) => {
    let dataFieldName = "";

    if (props.instrumentCalibration["dopendate"]===null&&props.instrumentCalibration["dclosedate"]===null){
        dataFieldName = dataFieldName = [{ "sinstrumentid": "IDS_INSTRUMENTID" }, {"sinstrumentname":"IDS_INSTRUMENTNAME"},
        { "slastcalibrationdate": "IDS_LASTCALIBRATIONDATE" }, { "snextcalibrationperiod": "IDS_NEXTCALIBRATIONDATE" },	//added by sujatha ALPDJ21-21 
        { "stransdisplaystatus": "IDS_CALIBRATIONSTATUS" }];
        
    }
       else if (props.instrumentCalibration["dclosedate"]!==null){
                dataFieldName = [{ "sinstrumentid": "IDS_INSTRUMENTID" }, {"sinstrumentname":"IDS_INSTRUMENTNAME"},
                { "slastcalibrationdate": "IDS_LASTCALIBRATIONDATE" }, { "snextcalibrationperiod": "IDS_NEXTCALIBRATIONDATE" },	//added by sujatha ALPDJ21-21 
                { "stransdisplaystatus": "IDS_CALIBRATIONSTATUS" },
                { "sclosedate": "IDS_CLOSEDATE" },
                {"scloseusername":"IDS_CLOSEUSERNAME"},
                {"sclosereason":"IDS_CLOSEREASON"}
            ];
       }  
      
       else if (props.instrumentCalibration["dopendate"]!==null){
        dataFieldName= [{ "sinstrumentid": "IDS_INSTRUMENTID" },{"sinstrumentname":"IDS_INSTRUMENTNAME"}, 
        { "slastcalibrationdate": "IDS_LASTCALIBRATIONDATE" }, { "snextcalibrationperiod": "IDS_NEXTCALIBRATIONDATE" },	//added by sujatha ALPDJ21-21 
        { "stransdisplaystatus": "IDS_CALIBRATIONSTATUS" },
        { "sopendate": "IDS_OPENDATE" }, 
        {"sopenusername":"IDS_OPENUSERNAME"},
        { "sopenreason": "IDS_OPENREASON" }];
     }
     else if (props.instrumentCalibration["dopendate"]!==null&&props.instrumentCalibration["dclosedate"]!==null){
        dataFieldName= [{ "sinstrumentid": "IDS_INSTRUMENTID" },{"sinstrumentname":"IDS_INSTRUMENTNAME"}, 
        { "slastcalibrationdate": "IDS_LASTCALIBRATIONDATE" }, { "snextcalibrationperiod": "IDS_NEXTCALIBRATIONDATE" },	//added by sujatha ALPDJ21-21 
        { "stransdisplaystatus": "IDS_CALIBRATIONSTATUS" },
        { "sopendate": "IDS_OPENDATE" }, { "sopenreason": "IDS_OPENREASON" },
        { "sclosedate": "IDS_CLOSEDATE" },{"sclosereason":"IDS_CLOSEREASON"},
        {"sopenusername":"IDS_OPENUSERNAME"},
        {"scloseusername":"IDS_CLOSEUSERNAME"}];
     }

    const editInstrumentCalibrationId = props.controlMap.has("EditInstrumentCalibration") && props.controlMap.get("EditInstrumentCalibration").ncontrolcode;
    const deleteInstrumentCalibrationId = props.controlMap.has("DeleteInstrumentCalibration") && props.controlMap.get("DeleteInstrumentCalibration").ncontrolcode;
    const opendateId = props.controlMap.has("OpenDate") && props.controlMap.get("OpenDate").ncontrolcode;
    const closedateId = props.controlMap.has("CloseDate") && props.controlMap.get("CloseDate").ncontrolcode;


    const {selectedInstrumentCalibration, userInfo } = props;
    return (
        <>
            {props.selectedInstrument && props.selectedInstrument.nautocalibration === transactionStatus.NO &&  //Added by sonia on 27th Sept 2024 for Jira idL:ALPD-4939
                <Row>
                    <Col md={12} className="d-flex justify-content-end">
                  
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_EDIT" })}
                            //data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(editInstrumentCalibrationId) === -1}
                            onClick={()=>props.getDataForAddEditCalibration("IDS_INSTRUMENTCALIBRATION","update", props.userInfo, editInstrumentCalibrationId,props.selectedRecord,props.masterData,"ninstrumentcalibrationcode")}>    
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                            data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_OPENDATE" })}
                            //data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(opendateId) === -1}

                            onClick={() => props.OpenDate("IDS_INSTRUMENTCALIBRATION", props.userInfo, opendateId,props.selectedRecord,props.masterData)}
                        >
                            <FontAwesomeIcon icon={faCalendarPlus} />
                        
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                            data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_CLOSEDATE" })}
                            //data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(closedateId) === -1}
                        onClick={() => props.CloseDate("IDS_INSTRUMENTCALIBRATION", props.userInfo, closedateId,props.selectedRecord,props.masterData)}
                        >
                            <FontAwesomeIcon icon={faCalendarMinus} />
                        
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                            data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DELETE" })}
                            //data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(deleteInstrumentCalibrationId) === -1}
                            onClick={() => props.ConfirmDelete({operation:'delete',screenName:'IDS_INSTRUMENTCALIBRATION',nFlag:3},deleteInstrumentCalibrationId)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        
                        </Nav.Link>
                    </Col>
                </Row>
            }
            <Row>
              {dataFieldName.map((item,i) => {
                    return (
                        <Col md="6">
                            <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>
                                <ReadOnlyText>{Object.keys(item)[0]==="slastcalibrationdate"||Object.keys(item)[0]==="sduedate"||Object.keys(item)[0]==="sopendate"||Object.keys(item)[0]==="sclosedate"?
                                rearrangeDateFormatDateOnly(props.userInfo,
                                    selectedInstrumentCalibration[Object.keys(item)[0]]) :
                                    selectedInstrumentCalibration[Object.keys(item)[0]]
                                 
                                    }</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    )
                })}  
                  
            
            </Row>
             <InstrumentCalibrationFile
                        selectedInstrumentCalibration={selectedInstrumentCalibration}
                        userInfo={userInfo}
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

export default injectIntl(InstrumentCalibrationTabAccordion);