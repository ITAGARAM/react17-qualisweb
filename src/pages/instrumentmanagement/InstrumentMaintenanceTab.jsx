import React from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
// import ReactTooltip from 'react-tooltip';
import InstrumentMaintenanceTabAccordion from './InstrumentMaintenanceTabAccordion';

const InstrumentMaintenanceTab = (props) => {
    const addInstrumentMaintenanceId = props.controlMap.has("AddInstrumentMaintenance") && props.controlMap.get("AddInstrumentMaintenance").ncontrolcode;
    function instrumentMaintenanceAccordion(InstrumentMaintenance) {
        const accordionMap = new Map();
               

        InstrumentMaintenance.map((instrumentMaintenance) =>
        
            accordionMap.set(instrumentMaintenance.ninstrumentmaintenancecode,

                <InstrumentMaintenanceTabAccordion
                    instrumentMaintenance={instrumentMaintenance}
                    userRoleControlRights={props.userRoleControlRights}
                    controlMap={props.controlMap}
                    userInfo={props.userInfo}
                    masterData={props.masterData}
                    selectedInstrumentMaintenance={props.masterData.selectedInstrumentMaintenance}
                    getDataForAddEditMaintenance={props.getDataForAddEditMaintenance}
                    deleteRecord={props.deleteRecord}
                    ConfirmDelete={props.ConfirmDelete}
                    OpenDate={props.OpenDate}
                    CloseDate={props.CloseDate}
                    addfilecllick={props.addfilecllick}
                    addInstrumentFile={props.addInstrumentFile}
                    FileData={props.FileData}
                    deleteTabFileRecord={props.deleteTabFileRecord}
                    getDataForEdit={props.getDataForEdit}
                    screenName={props.screenName}
                    viewInstrumentFile={props.viewInstrumentFile}

                />)
        );
        return accordionMap;
    }
    return (
        <>
             <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                    <Nav.Link name="addinstrumentmaintenance" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addInstrumentMaintenanceId) === -1}
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.formatMessage({ id: "IDS_ADDINSTRUMENTMAINTENANCE" })}
            onClick={()=>props.getDataForAddEditMaintenance(
                "IDS_INSTRUMENTMAINTENANCE","create", props.userInfo, addInstrumentMaintenanceId,props.selectedRecord,props.masterData)}>
                    <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_ADDINSTRUMENTMAINTENANCE" defaultMessage="Instrument Maintenance" />
                    </Nav.Link>
                </div>
            </div>
            {props.InstrumentMaintenance && props.InstrumentMaintenance.length > 0 &&
                <CustomAccordion
                    key="instrumentmaintenanceaccordion"
                    accordionTitle={"sheadername"}
                    accordionComponent={instrumentMaintenanceAccordion(props.InstrumentMaintenance)}
                    inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 3,screenName:"IDS_INSTRUMENTMAINTENANCE" }}
                    accordionClick={props.getTabDetails}
                    accordionPrimaryKey={"ninstrumentmaintenancecode"}
                    accordionObjectName={"instrumentMaintenance"}
                   selectedKey={props.masterData.selectedInstrumentMaintenance ? props.masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode : 0}

                />
            }
        </>
    );
};

export default InstrumentMaintenanceTab;