import React from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { Draggable } from 'react-drag-and-drop';
import { Grid, GridColumn,GridNoRecords } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

import { injectIntl } from 'react-intl';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as Template1 } from '../../assets/image/view-0.svg';
import { ReactComponent as Template2 } from '../../assets/image/view-02.svg';
import { ReactComponent as Template3 } from '../../assets/image/view-01.svg';
import { ReactComponent as Template4 } from '../../assets/image/view-05.svg';
import { ReactComponent as Template5 } from '../../assets/image/view-06.svg';
import { ReactComponent as Template6 } from '../../assets/image/view-07.svg';
import { ReactComponent as Template7 } from '../../assets/image/view-08.svg';
import { ReactComponent as Template8 } from '../../assets/image/view-04.svg';
import TemplateHomeDashBoardConfig from '../dashboardtypes/TemplateHomeDashBoardConfig';

const AddDashBoardHomeConfig = (props) => {
    return (
        <>
            <Row>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                        isSearchable={true}
                        name={"nuserrolecode"}
                        isDisabled={false}
                        placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}        
                        isMandatory={true}
                        isClearable={false}
                        options={props.userRoleList}
                        value={props.selectedRecord["nuserrolecode"] ? props.selectedRecord["nuserrolecode"] : ""}
                        onChange={value => props.handleChange(value, "nuserrolecode")}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                </Col>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_PAGES" })}
                        isSearchable={true}
                        name={"ndashboardhomepagecode"}
                        isDisabled={false}
                        placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}        
                        isMandatory={true}
                        isClearable={false}
                        options={props.dashBoardHomePages}
                        value={props.selectedRecord["ndashboardhomepagecode"] ? props.selectedRecord["ndashboardhomepagecode"] : ""}
                        onChange={value => props.handleChange(value, "ndashboardhomepagecode")}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                </Col>
                <Col md={12}>
                    <Card className="border-0">
                        <div className="d-inline p-2">
                            {
                                // props.dashBoardHomeTemplate && props.dashBoardHomeTemplate.map((data) => (
                                // <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#" 
                                // onClick={() => props.templateClick(data.ntemplatecode)} >
                                <>
                                    <Template1 className="custom_icons" onClick={() => props.templateClick(1)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                    <Template2 className="custom_icons" onClick={() => props.templateClick(2)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                    <Template3 className="custom_icons" onClick={() => props.templateClick(3)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                    <Template4 className="custom_icons" onClick={() => props.templateClick(4)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                    <Template5 className="custom_icons" onClick={() => props.templateClick(5)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                    <Template6 className="custom_icons" onClick={() => props.templateClick(6)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                    <Template7 className="custom_icons" onClick={() => props.templateClick(7)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                    <Template8 className="custom_icons" onClick={() => props.templateClick(8)}  width="50" height="50" style={{ marginLeft: '0.50rem' }} />
                                </>
                                // </Nav.Link>
                                // ))
                            }
                        </div>
                    </Card>
                </Col>

                <Col md={12}>
                    <Grid
                        resizable
                        scrollable="scrollable"
                        style={{ height: '250px' }}
                        data={process(props.dashBoardType, { skip: 0, take: props.dashBoardType.length })}
                    >
                          <GridNoRecords>
                            {props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                        </GridNoRecords>
                        <GridColumn width="36px"
                            cell={(row) => (
                                <td>
                                    <Draggable type="dashboardtype" data={JSON.stringify(row["dataItem"])}
                                    >
                                        <FontAwesomeIcon icon={faGripVertical} className="dragicon"></FontAwesomeIcon>
                                    </Draggable>
                                </td>

                            )}
                        />
                        <GridColumn title={props.intl.formatMessage({ id: "IDS_DASHBOARDTYPENAME" })}
                            cell={(row) => (
                                <td>
                                    {row["dataItem"]["sdashboardtypename"]}
                                </td>
                            )}
                        />
                    </Grid>

                </Col>
            </Row>

            <>
                <TemplateHomeDashBoardConfig
                    selectedRecord={props.selectedRecord}
                    onDrop={props.onDrop}
                    ntemplatecode={props.selectedRecord["ndashboardhometemplatecode"] ? props.selectedRecord["ndashboardhometemplatecode"] : 0}
                >
                </TemplateHomeDashBoardConfig>
            </>
        </>
    )


}

export default injectIntl(AddDashBoardHomeConfig);