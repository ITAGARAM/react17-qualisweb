import { faPencilAlt, faThumbsUp, faTrashAlt,faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, FormGroup, FormLabel, Nav, Row,Navbar } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MarkerType } from 'react-flow-renderer';
import { MediaLabel, ReadOnlyText } from '../../../components/App.styles';
import { transactionStatus } from '../../../components/Enumeration';
import FlowRenderer from '../../../components/flow-renderer/flow-renderer.component';
import { ReactComponent as EditReleaseRefNo } from '../../../assets/image/edit-releaserefno.svg';

class RegistrationSubTypeAccordion extends React.Component {
    render() {
        const seqFields = [
            // { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus" },
            { "idsName": "IDS_SEQNOFORMAT", "dataField": "ssampleformat",isJSONField:true },
            { "idsName": "IDS_RESETSEQEVERY", "dataField": "speriodname" },
            { "idsName": "IDS_LASTRESETDATE", "dataField": "sseqresetdate",isJSONField:false },

        ]
        const seqFieldsRelease=[
            { "idsName": "IDS_SEQNOFORMAT", "dataField": "sreleaseformat",isJSONField:true },
            { "idsName": "IDS_RESETSEQEVERY", "dataField": "sreleaseperiodname" },
            { "idsName": "IDS_LASTRESETDATE", "dataField": "sreleaseseqresetdate",isJSONField:false },

        ]
        const configFieldsRelease=[{ "idsName": "IDS_NEEDSITEWISEARNO", "dataField": "nneedsitewisearnorelease" }     
    ]
        const configFields = [
            { "idsName": "IDS_NEEDSUBSAMPLE", "dataField": "nneedsubsample" },
            { "idsName": "IDS_NEEDJOBALLOCATION", "dataField": "nneedjoballocation" },
            { "idsName": "IDS_NEEDMYJOB", "dataField": "nneedmyjob" },    
            { "idsName": "IDS_NEEDWORKLIST", "dataField": "nneedworklist" }, 
            { "idsName": "IDS_NEEDBATCH", "dataField": "nneedbatch" },    
            { "idsName": "IDS_NEEDSITEWISEARNO", "dataField": "nneedsitewisearno" },       
            { "idsName": "IDS_TESTGROUPSPEC", "dataField": "ntestgroupspecrequired" },  //ALPD-4973, Vishakh, Added test group spec field to show in get
      
            { "idsName": "IDS_NEEDTESTINITIATE", "dataField": "nneedtestinitiate" },
          //  { "idsName": "IDS_NEEDTEMPLATEBASEDFLOW", "dataField": "nneedtemplatebasedflow" },
          //  { "idsName": "IDS_NEEDSAMPLEDBY", "dataField": "nneedsampledby" },
          //  { "idsName": "IDS_NEEDSCHEDULER", "dataField": "nneedscheduler" },

        ]
        const yes = this.props.intl.formatMessage({ id: "IDS_YES" })
        const No = this.props.intl.formatMessage({ id: "IDS_NO" })
        const selectedVersion = this.props.version;

        return (
            <>
                <div className="d-flex product-category pb-5">
                    <h2 className="product-title-sub flex-grow-1">
                        {/* <MediaLabel className={`btn btn-outlined ${SelectedTest.ntransactionstatus === 1 ? "outline-success" : "outline-secondary"} btn-sm ml-3`}>
                            {SelectedTest.ntransactionstatus === 1 && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
                            {SelectedTest.stransactionstatus}
                        </MediaLabel> */}
                        <MediaLabel className={`btn-outlined ${selectedVersion.ntransactionstatus === transactionStatus.APPROVED ? "outline-success" :
                            selectedVersion.ntransactionstatus === transactionStatus.RETIRED ? "outline-danger" : "outline-secondary"} btn-sm mr-3`}>
                            {selectedVersion.stransdisplaystatus}
                        </MediaLabel>
                    </h2>
                    <div className="d-inline">
                        <Col md={12}>
                            <Nav.Link name="view" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                      data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEWTRANSACTIONFLOW" })}
                                    //  data-for="tooltip_list_wrap"
                                     // hidden={this.props.userRoleControlRights.indexOf(this.props.viewVersionId) === -1}
                                      //onClick={() => this.props.viewFlow(this.props.intl.formatMessage({id:"IDS_REGISTRATIONFLOW"}), "view",selectedVersion)}
                                      onClick={() => this.props.viewFlow(selectedVersion)}
                            >
                                    <FontAwesomeIcon icon={faEye} />
                            </Nav.Link>                            
                            <Nav.Link name="edit"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDITRELEASE" })}
                             //   data-for="tooltip_list_wrap"
                                hidden={this.props.userRoleControlRights.indexOf(this.props.editReleaseReferenceNo) === -1}
                                className="btn btn-circle outline-grey mr-2"
                                onClick={(e) => this.props.getVersionByReleaseNo(this.props.editReleaseReferenceNo)}

                            ><EditReleaseRefNo className="custom_icons" width="20" height="30" /></Nav.Link>
                                                            

                            <Nav.Link name="edit"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                             //   data-for="tooltip_list_wrap"
                                hidden={this.props.userRoleControlRights.indexOf(this.props.editVersionId) === -1}
                                className="btn btn-circle outline-grey mr-2"
                                onClick={(e) => this.props.getVersionById(this.props.editVersionId)}
                            >
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </Nav.Link>
                            <Nav.Link name="delete" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                               // data-for="tooltip_list_wrap"
                                hidden={this.props.userRoleControlRights.indexOf(this.props.deleteVersionId) === -1}
                                onClick={() => this.props.confirmDelete(this.props.deleteVersionId,'Version',this.props.actionParam)}>
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </Nav.Link>
                            <Nav.Link name="approve"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                               // data-for="tooltip_list_wrap"
                                hidden={this.props.userRoleControlRights.indexOf(this.props.approveVersionId) === -1}
                                className="btn btn-circle outline-grey mr-2"
                                onClick={(e) => this.props.approvrVersion('approve',this.props.approveVersionId,'Version',this.props.actionParam,this.props.selectedRecord
                                )}
                            >
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </Nav.Link>
                        </Col>
                    </div>
                </div>
                <Row>
                    {seqFields.map(field =>
                        <Col md="4">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={field.idsName} message={field.idsName} /></FormLabel>
                                <ReadOnlyText>{field.isJSONField ? this.props.version.jsondata[field.dataField] || '-' : this.props.version[field.dataField] || '-'}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    )}
                </Row>
                <Row>
                    {configFields.map(field =>
                    field.dataField === "ntestgroupspecrequired" ? this.props.settings && parseInt(this.props.settings[71]) === transactionStatus.NO ?     //ALPD-4973, Vishakh, Added test group spec field to show in get
                    <Col md="4">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={field.idsName} message={field.idsName} /></FormLabel>
                                <ReadOnlyText>{this.props.version.jsondata[field.dataField] ? yes : No}</ReadOnlyText>
                            </FormGroup>
                        </Col> : ""
                         :
                        <Col md="4">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={field.idsName} message={field.idsName} /></FormLabel>
                                <ReadOnlyText>{this.props.version.jsondata[field.dataField] ? yes : No}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    )}
                </Row>
                
                <hr/>
                <h4>
                <div className="d-flex product-category pl-0">
               
                  <FormattedMessage id={"IDS_RELEASEREF"} /> 
              </div>
              </h4>
                <Row>
                    {seqFieldsRelease.map(field =>
                        <Col md="4">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={field.idsName} message={field.idsName} /></FormLabel>
                                <ReadOnlyText>{field.isJSONField ? this.props.version.jsondata[field.dataField] || '-' : this.props.version[field.dataField] || '-'}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    )}
                </Row>
                <Row>
                    {configFieldsRelease.map(field =>
                        <Col md="4">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={field.idsName} message={field.idsName} /></FormLabel>
                                <ReadOnlyText>{this.props.version.jsondata[field.dataField] ? yes : No}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    )}
                </Row>
                {/* <Row>
                    <Col>
                        <FlowRenderer initialNodes={nodes} initialEdges={edges}/>
                    </Col>
                </Row> */}
            </>
        )
    }
}
export default injectIntl(RegistrationSubTypeAccordion)