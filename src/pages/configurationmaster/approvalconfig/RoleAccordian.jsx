import React from 'react';
import { Row,Nav, Accordion,Tab, Card, Col,FormGroup, FormLabel } from 'react-bootstrap';
import { ReadOnlyText } from '../../../components/login/login.styles';
import { FormattedMessage,injectIntl } from 'react-intl';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../../components/Enumeration';

class RoleAccordian extends React.Component{
    render(){
        return (
            <>
            <Tab.Content>
                <Tab.Pane aria-labelledby="Version-tab" className="p-0 active show">
                    <Row no-gutters={true}>
                        {/* <Container className="px-0"> */}
                            <Accordion activeKey={`role_${this.props.showAccordian?this.props.selectedRole.napprovalconfigrolecode:0}`}>                        
                                {this.props.roleData.map((role,roleIndex)=>
                                <Card key={roleIndex} className="p-0 border-0">
                                    <Accordion.Toggle  as={Card.Header} eventKey={`role_${role["napprovalconfigrolecode"]}`} 
                                    onClick={()=>this.props.showRoleDetails(role)}>
                                        <Card.Title>{ role.suserrolename }{'-'}{role.napprovalconfigrolecode}</Card.Title>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={`role_${role["napprovalconfigrolecode"]}`} >
                                        <Card.Body>
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={"IDS_APPROVALSTATUS"} message="Approval Status"/></FormLabel>
                                                        <ReadOnlyText>{ role.sapprovalstatus }</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                {role.schecklistname!=='NA'?
                                                <>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={"IDS_CHECKLIST"} message="Checklist"/></FormLabel>
                                                        <ReadOnlyText>{ role.schecklistname }</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={"IDS_CHECKLISTVERSION"} message="Checklist Version"/></FormLabel>
                                                        <ReadOnlyText>{ role.schecklistversionname }</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                </>
                                                :""}
                                                {this.props.roleConfig?this.props.roleConfig.map(item=>
                                                item.stransdisplaystatus&&
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={item.stransdisplaystatus}/></FormLabel>
                                                        <ReadOnlyText>{ role[`${item.stransdisplaystatus}`] }</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                ):""}
                                            </Row>
                                            <Row noGutters={true}>
                                                <Col md="12">
                                                    <Card className="at-tabs">
                                                        <Tab.Container defaultActiveKey={"FilterStatusKey"}>
                                                            <Card.Header className="d-flex tab-card-header">
                                                                <Nav as="ul" className="nav nav-tabs card-header-tabs flex-grow-1">
                                                                    <Nav.Item as="li">
                                                                        <Nav.Link eventKey="FilterStatusKey">{this.props.intl.formatMessage({id:"IDS_FILTERSTATUS"})}</Nav.Link>
                                                                    </Nav.Item>
                                                                    <Nav.Item as="li">
                                                                        <Nav.Link eventKey="ValidationStatusKey">{this.props.intl.formatMessage({id:"IDS_VALIDATIONSTATUS"})}</Nav.Link>
                                                                    </Nav.Item>
                                                                    <Nav.Item as="li">
                                                                        <Nav.Link eventKey="DecisionStatusKey">{this.props.intl.formatMessage({id:"IDS_DECISIONSTATUS"})}</Nav.Link>
                                                                    </Nav.Item>
                                                                    <Nav.Item as="li">
                                                                        <Nav.Link eventKey="ActionStatusKey">{this.props.intl.formatMessage({id:"IDS_ACTIONSTATUS"})}</Nav.Link>
                                                                    </Nav.Item>
                                                                </Nav>
                                                            </Card.Header>
                                                            <Tab.Content>
                                                                <Tab.Pane className="p-5 Filterfade fade " eventKey="FilterStatusKey">
                                                                    
                                                                    <Row noGutters={true}>
                                                                        <Col md="12">
                                                                            <Grid data={process(this.props.roleFilter.length>0 ? this.props.roleFilter :[],
                                                                                { skip: this.props.dataState.skip, take: this.props.dataState.take })} >                                       
                                                                                <GridColumn 
                                                                                    title={this.props.intl.formatMessage({ id:"IDS_FILTERSTATUS"})}
                                                                                    field={"sfilterstatus"}   
                                                                                    cell={(row) =>  ( 
                                                                                        <td> 
                                                                                            {row["dataItem"]["sfilterstatus"]} 
                                                                                        </td>)}
                                                                                />
                                                                                <GridColumn
                                                                                    field={"ndefaultstatus"}
                                                                                    
                                                                                    title={this.props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                                                                                    cell={(row) => (
                                                                                        <td>
                                                                                            <CustomSwitch type="switch" id={row["dataItem"]["ndefaultstatus"]}
                                                                                                onChange={(event) =>  this.props.setDefault(event, row["dataItem"],1,this.props.selectedRole.napprovalconfigrolecode,this.props.nsubTypeCode
                                                                                                ,this.props.Login.userInfo,this.props.masterData)}
                                                                                                checked={row["dataItem"]["ndefaultstatus"] === transactionStatus.YES ? true : false}
                                                                                                name={row["dataItem"]["ntransactionstatus"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                                                        </td>)}
                                                                                />
                                                                            </Grid> 
                                                                        </Col>
                                                                    </Row>
                                                                </Tab.Pane>
                                                                <Tab.Pane className="p-5 Filterfade  fade " eventKey="ValidationStatusKey">
                                                                    
                                                                    <Row noGutters={true}>
                                                                        <Col md="12">
                                                                            <Grid data={process(this.props.roleValidation.length>0 ? this.props.roleValidation :[],
                                                                                { skip: this.props.dataState.skip, take: this.props.dataState.take })} > 
                                                                                <GridColumn title={this.props.intl.formatMessage({ id:"IDS_VALIDATIONSTATUS"})}
                                                                                    field={"svalidationstatus"}   
                                                                                    cell={(row) =>  ( 
                                                                                        <td>
                                                                                            {row["dataItem"]["svalidationstatus"]} 
                                                                                            
                                                                                        </td>)}
                                                                                />
                                                                            </Grid>
                                                                        </Col>
                                                                    </Row>
                                                                </Tab.Pane>
                                                                <Tab.Pane className="p-5 Filterfade fade " eventKey="DecisionStatusKey">
                                                                    
                                                                    <Row noGutters={true}>
                                                                        <Col md="12">
                                                                            <Grid data={process(this.props.roleDecisions.length>0 ? this.props.roleDecisions :[],
                                                                                { skip: this.props.dataState.skip, take: this.props.dataState.take })} > 
                                                                                <GridColumn title={this.props.intl.formatMessage({ id:"IDS_DECISIONSTATUS"})}
                                                                                    field={"sdecisionstatus"}   
                                                                                    cell={(row) =>  ( 
                                                                                        <td>
                                                                                            {row["dataItem"]["sdecisionstatus"]} 
                                                                                        </td>)}
                                                                                />
                                                                                <GridColumn
                                                                                    field={"ndefaultstatus"}
                                                                                    title={this.props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                                                                                    cell={(row) => (
                                                                                        <td>
                                                                                            <CustomSwitch type="switch" id={row["dataItem"]["ndefaultstatus"]}
                                                                                                onChange={(event) => this.props.setDefault(event, row["dataItem"],2,this.props.selectedRole.napprovalconfigrolecode,this.props.nsubTypeCode
                                                                                                                                            ,this.props.Login.userInfo,this.props.masterData)}
                                                                                                checked={row["dataItem"]["ndefaultstatus"] === transactionStatus.YES ? true : false}
                                                                                                name={row["dataItem"]["ntransactionstatus"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                                                        </td>)}
                                                                                />
                                                                            </Grid>
                                                                        </Col>
                                                                    </Row>
                                                                </Tab.Pane>
                                                                <Tab.Pane className="p-5 Filterfade fade " eventKey="ActionStatusKey">
                                                                    
                                                                    <Row noGutters={true}>
                                                                        <Col md="12">
                                                                            <Grid data={process(this.props.roleActions.length>0 ? this.props.roleActions :[],
                                                                                        { skip: this.props.dataState.skip, take: this.props.dataState.take })} > 
                                                                                <GridColumn title={this.props.intl.formatMessage({ id:"IDS_ACTIONSTATUS"})}
                                                                                    field={"sactiondisplaystatus"}   
                                                                                    cell={(row) =>  ( 
                                                                                        <td>
                                                                                            {row["dataItem"]["sactiondisplaystatus"]}
                                                                                        </td>)}
                                                                                />
                                                                            </Grid>
                                                                        </Col>
                                                                    </Row>
                                                                </Tab.Pane>
                                                            </Tab.Content>
                                                        </Tab.Container>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                )}
                            </Accordion>
                        {/* </Container> */}
                    </Row>
                </Tab.Pane>
            </Tab.Content>
            </>
        );
    }
}
export default injectIntl(RoleAccordian);