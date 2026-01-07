import React from 'react';
import { faCalendarMinus, faCalendarPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl } from 'react-intl';
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText } from '../../components/App.styles';
import InstrumentMaintenanceFile from './InstrumentMaintenanceFile';
import {rearrangeDateFormatDateOnly} from '../../components/CommonScript';



const InstrumentMaintenanceTabAccordion = (props) => {
    let dataFieldName = "";
    if (props.instrumentMaintenance["dopendate"]===null&&props.instrumentMaintenance["dclosedate"]===null){
        dataFieldName = dataFieldName = [{ "sinstrumentid": "IDS_INSTRUMENTID" },{"sinstrumentname":"IDS_INSTRUMENTNAME"}, 
        { "slastmaintenancedate": "IDS_LASTMAINTENANCEDATE" }, { "snextmaintenanceperiod": "IDS_NEXTMAINENANCEDATE" },	//added by sujatha ALPDJ21-21 
        { "stransdisplaystatus": "IDS_MAINTENANCESTATUS" }];
        
    }
       else if (props.instrumentMaintenance["dclosedate"]!==null){
                dataFieldName = [{ "sinstrumentid": "IDS_INSTRUMENTID" },{"sinstrumentname":"IDS_INSTRUMENTNAME"}, 
                { "slastmaintenancedate": "IDS_LASTMAINTENANCEDATE" }, { "snextmaintenanceperiod": "IDS_NEXTMAINENANCEDATE" },	//added by sujatha ALPDJ21-21 
                { "stransdisplaystatus": "IDS_MAINTENANCESTATUS" },
                { "sclosedate": "IDS_CLOSEDATE" }, 
                {"scloseusername":"IDS_CLOSEUSERNAME"},
                {"sclosereason":"IDS_CLOSEREASON"}];
       }  
      
       else if (props.instrumentMaintenance["dopendate"]!==null){
        dataFieldName= [{ "sinstrumentid": "IDS_INSTRUMENTID" },{"sinstrumentname":"IDS_INSTRUMENTNAME"}, 
        { "slastmaintenancedate": "IDS_LASTMAINTENANCEDATE" }, { "snextmaintenanceperiod": "IDS_NEXTMAINENANCEDATE" },	//added by sujatha ALPDJ21-21 
        { "stransdisplaystatus": "IDS_MAINTENANCESTATUS" },
        { "sopendate": "IDS_OPENDATE" },
        {"sopenusername":"IDS_OPENUSERNAME"},
        { "sopenreason": "IDS_OPENREASON" }];
     }
     else if (props.instrumentMaintenance["dopendate"]!==null&&props.instrumentMaintenance["dclosedate"]!==null){
        dataFieldName= [{ "sinstrumentid": "IDS_INSTRUMENTID" },{"sinstrumentname":"IDS_INSTRUMENTNAME"},
        { "slastmaintenancedate": "IDS_LASTMAINTENANCEDATE" }, { "snextmaintenanceperiod": "IDS_NEXTMAINENANCEDATE" },	//added by sujatha ALPDJ21-21 
        { "stransdisplaystatus": "IDS_MAINTENANCESTATUS" },
        { "sopendate": "IDS_OPENDATE" }, { "sopenreason": "IDS_OPENREASON" },
        { "sclosedate": "IDS_CLOSEDATE" },{"sclosereason":"IDS_CLOSEREASON"},
        {"sopenusername":"IDS_OPENUSERNAME"},
        {"scloseusername":"IDS_CLOSEUSERNAME"}];
     }

    const editInstrumentMaintenanceId = props.controlMap.has("EditInstrumentMaintenance") && props.controlMap.get("EditInstrumentMaintenance").ncontrolcode;
    const deleteInstrumentMaintenanceId = props.controlMap.has("DeleteInstrumentMaintenance") && props.controlMap.get("DeleteInstrumentMaintenance").ncontrolcode;
    const opendateId = props.controlMap.has("OpenDate") && props.controlMap.get("OpenDate").ncontrolcode;
    const closedateId = props.controlMap.has("CloseDate") && props.controlMap.get("CloseDate").ncontrolcode;


    const {selectedInstrumentMaintenance, userInfo } = props;
    return (
        <>
            <Row>
            <Col md={12} className="d-flex justify-content-end">
                  
                  <Nav.Link className="btn btn-circle outline-grey mr-2"
                      data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_EDIT" })}
                      //data-for="tooltip_list_wrap"
                      hidden={props.userRoleControlRights.indexOf(editInstrumentMaintenanceId) === -1}
                      onClick={()=>props.getDataForAddEditMaintenance("IDS_INSTRUMENTMAINTENANCE","update", props.userInfo, editInstrumentMaintenanceId,props.selectedRecord,props.masterData,"ninstrumentmaintenancecode")}>    
                       <FontAwesomeIcon icon={faPencilAlt} />
                  </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_OPENDATE" })}
                        //data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(opendateId) === -1}

                        onClick={() => props.OpenDate("IDS_INSTRUMENTMAINTENANCE", props.userInfo, opendateId,props.selectedRecord,props.masterData)}
                    >
                        <FontAwesomeIcon icon={faCalendarPlus} />
                       
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_CLOSEDATE" })}
                        //data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(closedateId) === -1}

                     onClick={() => props.CloseDate("IDS_INSTRUMENTMAINTENANCE", props.userInfo, closedateId,props.selectedRecord,props.masterData)}
                     >
                        <FontAwesomeIcon icon={faCalendarMinus} />
                       
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DELETE" })}
                        //data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(deleteInstrumentMaintenanceId) === -1}

                        onClick={() => props.ConfirmDelete({operation:'delete',screenName:'IDS_INSTRUMENTMAINTENANCE'},deleteInstrumentMaintenanceId)}
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
                                <ReadOnlyText>{Object.keys(item)[0]==="slastmaintenancedate"||Object.keys(item)[0]==="sduedate"||Object.keys(item)[0]==="sopendate"||Object.keys(item)[0]==="sclosedate"?
                                rearrangeDateFormatDateOnly(props.userInfo,
                                    selectedInstrumentMaintenance[Object.keys(item)[0]]):
                                    selectedInstrumentMaintenance[Object.keys(item)[0]]
                                    }</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    )
                })}  
                  
            
            </Row>
            <InstrumentMaintenanceFile
                        selectedInstrumentMaintenance={selectedInstrumentMaintenance}
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

export default injectIntl(InstrumentMaintenanceTabAccordion);