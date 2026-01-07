import { faCheck, faCopy, faUserTimes,faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { ReadOnlyText } from '../../components/App.styles';
///import { getStatusIcon } from '../../components/StatusIcon';
import ActionPopOver from '../product/ActionPopover';
// import { Tooltip } from '@progress/kendo-react-tooltip';
//import GenerateCertificate from '../../assets/image/generate-certificate.svg';
import { ReactComponent as Reports } from '../../assets/image/report-Icon.svg'
// import ReactTooltip from 'react-tooltip';
import {ReactComponent as TestSorter} from '../../assets/image/Test Sort icon 4.svg'
import {ReactComponent as ParameterSorter} from '../../assets/image/Parameter Sort icon.svg'


const SpecificationInfo = (props) => {
    const { selectedSpecification, controlMap, selectedNode, userInfo, approvalRoleActionDetail, selectedRecord, filterData } = props;
    const addSpecParam = { testgroupspecification: selectedSpecification, selectedRecord, userInfo: userInfo, filterData, selectedNode };
    const specInfoFields = [{ "fieldName": "sspecname", "label": "IDS_SPECNAME" },
    { "fieldName": "sapprovalstatus", "label": "IDS_APPROVALSTATUS" },
    { "fieldName": "sversion", "label": "IDS_VERSIONNO" },
    { "fieldName": "scomponentrequired", "label":props.genericLabel && props.genericLabel["Component"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] +" "+ props.intl.formatMessage({ id: "IDS_REQUIRED" })},
  //  { "fieldName": "sexpirydate", "label": "IDS_EXPIRYDATE" },
 //   { "fieldName": "stimezoneid", "label": "IDS_TIMEZONE" },
    //{ "fieldName": "sclinicalrequired", "label": "IDS_CLINICALSPEC" }
];
    const copySpecId = controlMap.has("CopySpecification") && controlMap.get("CopySpecification").ncontrolcode;
    const completedSpecId = controlMap.has("CompleteSpecification") && controlMap.get("CompleteSpecification").ncontrolcode;
    const completeSpecParam = { testgroupspecification: selectedSpecification, treetemplatemanipulation: selectedNode };
    const reportSpecId = controlMap.has("ReportSpecification") && controlMap.get("ReportSpecification").ncontrolcode;
    const retireSpecId = controlMap.has("RetireSpecification") && controlMap.get("RetireSpecification").ncontrolcode;
    const approvalActionId = controlMap.has("SpecApprovalAction") && controlMap.get("SpecApprovalAction").ncontrolcode;
    const testSorterId = controlMap.has("TestSorter") && controlMap.get("TestSorter").ncontrolcode;
    const parameterSorterId = controlMap.has("ParameterSorter") && controlMap.get("ParameterSorter").ncontrolcode;

    return (
        <>
            <div className="d-flex justify-content-end mr-3">
                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true} > */}
                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                 <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={props.userRoleControlRights.indexOf(testSorterId) === -1}
                    onClick={() => props.testSorter("sort", addSpecParam, testSorterId,props.masterData)}
                   // data-for="tooltip-list-wrap"
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_TESTSORTER" })}>
                    {/* <FontAwesomeIcon icon={faSort} /> */}
                      <TestSorter className="custom_icons" width="20" height="20" />
                </Nav.Link>
                <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={props.userRoleControlRights.indexOf(parameterSorterId) === -1}
                    onClick={() => props.parameterSorter("sort", addSpecParam, parameterSorterId,props.masterData)}
                   // data-for="tooltip-list-wrap"
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_PARAMETERSORTER" })}>
                    {/* <FontAwesomeIcon icon={faSort} /> */}
                      <ParameterSorter className="custom_icons" width="20" height="20" />
                </Nav.Link>
                <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={props.userRoleControlRights.indexOf(copySpecId) === -1}
                    onClick={() => props.addSpecification("copy", addSpecParam, copySpecId,props.masterData)}
                   // data-for="tooltip-list-wrap"
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_COPY" })}>
                    <FontAwesomeIcon icon={faCopy} />
                </Nav.Link>
                <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={props.userRoleControlRights.indexOf(completedSpecId) === -1}
                    onClick={() => props.completeSpecification("complete", { ...completeSpecParam }, completedSpecId)}
                  //  data-for="tooltip-list-wrap"
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_COMPLETE" })}>
                    <FontAwesomeIcon icon={faCheck} />
                </Nav.Link>


                <Nav.Link className="btn btn-circle outline-grey mr-2"
                    hidden={props.userRoleControlRights.indexOf(reportSpecId) === -1}
                    //onClick={() => props.specificationReport("report", reportSpecId)}
                    onClick={() => props.specificationReport(reportSpecId)}
                   // data-for="tooltip-list-wrap"
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_SPECREPORT" })}>
                    {/* <Image src={GenerateCertificate} alt="generate-certificate" width="20" hieght="20"
                        className="ActionIconColor img-normalize"/> */}
                    <Reports className="custom_icons" width="20" height="20" />
                </Nav.Link>

                <Nav.Link className="btn btn-circle outline-grey mr-2"
                    // hidden={props.userRoleControlRights.indexOf(retireSpecId) === -1}
                    hidden
                  //  data-for="tooltip-list-wrap"
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_RETIRE" })}
                    onClick={() => props.retireSpec("retire", { ...completeSpecParam }, approvalRoleActionDetail, retireSpecId)}
                >
                    <FontAwesomeIcon icon={faUserTimes} />
                </Nav.Link>

                {/* </Tooltip> */}
                {approvalRoleActionDetail && approvalRoleActionDetail.length > 0 &&
                    props.userRoleControlRights.indexOf(approvalActionId) !== -1 &&
                    // <Dropdown className="mr-2">
                    //     <Dropdown.Toggle className="btn-circle btn-primary-blue flex">
                    //         <FontAwesomeIcon icon={faBolt} size="sm"></FontAwesomeIcon>
                    //     </Dropdown.Toggle>
                    //     <Dropdown.Menu>
                    // {approvalRoleActionDetail.map((action) =>
                    // <Dropdown.Item onClick={() => props.approveSpecification(action.ntransactionstatus, action.nesignneed)}>
                    //     <Nav.Link className='add-txt-btn blue-text ml-1' style={{ display: 'inline' }}>
                    //         {getStatusIcon(action.ntransactionstatus)}
                    //         <span className='ml-1 text-nowrap'><FormattedMessage id={action.sactiondisplaystatus}
                    //             defaultMessage={action.sactiondisplaystatus} /></span>
                    //     </Nav.Link>
                    // </Dropdown.Item>

                    <ActionPopOver
                        actionDetails={approvalRoleActionDetail}
                        roleActionDetails={approvalRoleActionDetail}
                        dynamicButton={(value) => props.approveSpecification(value.paramstatus, value.sign)}
                    >
                    </ActionPopOver>
                }

                {/* //)} */}
                {/* //</Dropdown.Menu>
                    </Dropdown>} */}
            </div>

            {selectedSpecification && Object.values(selectedSpecification).length ?
                <Row>
                    {props.auditInfoFields ?

                        props.auditInfoFields.map((item, index) => {
                            return (
                                <Col md={props.screenName==="IDS_PREVIOUSRESULTVIEW"?3:6} key={`specInfo_${index}`}>
                                    <FormGroup>
                                        <FormLabel>{props.intl.formatMessage({ id: item.label })}</FormLabel>
                                        <ReadOnlyText>{selectedSpecification[item.fieldName]}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                            )
                        }) :

                        specInfoFields.map((item, index) => {
                            return (
                                <>
                                {index > 1 &&
                                    <Col md={6} key={`specInfo_${index}`}>
                                    <FormGroup>
                                        <FormLabel>{props.intl.formatMessage({ id: item.label })}</FormLabel>
                                        <ReadOnlyText>{selectedSpecification[item.fieldName]}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                }                                
                                </>
                            )
                        })}
                </Row> : ""
            }
        </>
    );

};

export default injectIntl(SpecificationInfo);