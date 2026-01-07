import React from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
// import ReactTooltip from 'react-tooltip';
import InstrumentValidationTabAccordion from './InstrumentValidationTabAccordion';

const InstrumentValidationTab = (props) => {
    const addInstrumentValidationId = props.controlMap.has("AddInstrumentValidation") && props.controlMap.get("AddInstrumentValidation").ncontrolcode;
    function instrumentValidationAccordion(InstrumentValidation) {
        const accordionMap = new Map();
               

        InstrumentValidation.map((instrumentValidation) =>
        
            accordionMap.set(instrumentValidation.ninstrumentvalidationcode,

                <InstrumentValidationTabAccordion
                    instrumentValidation={instrumentValidation}
                    userRoleControlRights={props.userRoleControlRights}
                    controlMap={props.controlMap}
                    userInfo={props.userInfo}
                    masterData={props.masterData}
                    selectedInstrumentValidation={props.masterData.selectedInstrumentValidation}
                    getDataForAddEditValidation={props.getDataForAddEditValidation}
                    deleteRecord={props.deleteRecord}
                    ConfirmDelete={props.ConfirmDelete}
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
                    <Nav.Link name="addinstrumentvalidation" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addInstrumentValidationId) === -1}
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.formatMessage({ id: "IDS_ADDINSTRUMENTVALIDATION" })}
            onClick={()=>props.getDataForAddEditValidation(
                "IDS_INSTRUMENTVALIDATION","create", props.userInfo, addInstrumentValidationId,props.selectedRecord,props.masterData)}>
                    
                    <FontAwesomeIcon icon={faPlus} /> { }
                    
                        <FormattedMessage id="IDS_ADDINSTRUMENTVALIDATION" defaultMessage="Instrument Validation" />
                    </Nav.Link>
                </div>
            </div>
            {props.InstrumentValidation && props.InstrumentValidation.length > 0 &&
                <CustomAccordion
                    key="instrumentvalidationaccordion"
                    accordionTitle={"sheadername"}
                    accordionComponent={instrumentValidationAccordion(props.InstrumentValidation)}
                    inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 1 ,screenName:"IDS_INSTRUMENTVALIDATION"}}
                    accordionClick={props.getTabDetails}
                    accordionPrimaryKey={"ninstrumentvalidationcode"}
                    accordionObjectName={"instrumentValidation"}
                   selectedKey={props.masterData.selectedInstrumentValidation ? props.masterData.selectedInstrumentValidation.ninstrumentvalidationcode : 0}

                />
            }
        </>
    );
};

export default InstrumentValidationTab;