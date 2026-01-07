import React from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
// import ReactTooltip from 'react-tooltip';
import InstrumentCalibrationTabAccordion from './InstrumentCalibrationTabAccordion';
import { transactionStatus } from '../../components/Enumeration';

const InstrumentCalibrationTab = (props) => {
    const addInstrumentCalibrationId = props.controlMap.has("AddInstrumentCalibration") && props.controlMap.get("AddInstrumentCalibration").ncontrolcode;
    function instrumentCalibrationAccordion(InstrumentCalibration) {
        const accordionMap = new Map();
               

        InstrumentCalibration.map((instrumentCalibration) =>
        
            accordionMap.set(instrumentCalibration.ninstrumentcalibrationcode,

                <InstrumentCalibrationTabAccordion
                    instrumentCalibration={instrumentCalibration}
                    userRoleControlRights={props.userRoleControlRights}
                    controlMap={props.controlMap}
                    userInfo={props.userInfo}
                    masterData={props.masterData}
                    selectedInstrumentCalibration={props.masterData.selectedInstrumentCalibration}
                    getDataForAddEditCalibration={props.getDataForAddEditCalibration}
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
                    selectedInstrument ={props.selectedInstrument}  //Added by sonia on 27th Sept 2024 for Jira idL:ALPD-4939

                />)
        );
        return accordionMap;
    }
    return (
        <>  
            {props.selectedInstrument && props.selectedInstrument.nautocalibration=== transactionStatus.NO &&   //Added by sonia on 27th Sept 2024 for Jira idL:ALPD-4939
                    <div className="actions-stripe">
                    <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                        <Nav.Link name="addinstrumentcalibration" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addInstrumentCalibrationId) === -1}
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.formatMessage({ id: "IDS_ADDINSTRUMENTCALIBRATION" })}
                        onClick={()=>props.getDataForAddEditCalibration(
                        "IDS_INSTRUMENTCALIBRATION","create", props.userInfo, addInstrumentCalibrationId,props.selectedRecord,props.masterData)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_ADDINSTRUMENTCALIBRATION" defaultMessage="Instrument Calibration" />
                        </Nav.Link>
                    </div>
                    </div>
            }
            {props.InstrumentCalibration && props.InstrumentCalibration.length > 0 &&
                <CustomAccordion
                    key="instrumentcalibrationaccordion"
                    accordionTitle={"sheadername"}
                    accordionComponent={instrumentCalibrationAccordion(props.InstrumentCalibration)}
                    inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 2,screenName:"IDS_INSTRUMENTCALIBRATION" }}
                    accordionClick={props.getTabDetails}
                    accordionPrimaryKey={"ninstrumentcalibrationcode"}
                    accordionObjectName={"instrumentCalibration"}
                   selectedKey={props.masterData.selectedInstrumentCalibration ? props.masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode : 0}

                />
            }
        </>
    );
};

export default InstrumentCalibrationTab;