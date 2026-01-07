import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, FormGroup, FormLabel } from 'react-bootstrap';
import CustomTab from '../../../components/custom-tabs/custom-tabs.component';
//import { ReadOnlyText } from '../../../components/login/login.styles';
import { ReadOnlyText } from '../../../components/App.styles';

const UserRoleAccordion = (props) => {
    return (
        <>
            <Row>
                <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_APPROVALSTATUS"} message="Approval Status" /></FormLabel>
                        <ReadOnlyText>{props.role.sapprovalstatus}</ReadOnlyText>
                    </FormGroup>
                </Col>
                {props.role.schecklistname !== 'NA' ?
                    <>
                        <Col md="6">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={"IDS_CHECKLIST"} message="Checklist" /></FormLabel>
                                <ReadOnlyText>{props.role.schecklistname}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={"IDS_CHECKLISTVERSION"} message="Checklist Version" /></FormLabel>
                                <ReadOnlyText>{props.role.schecklistversionname}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    </>
                    : ""}
                {props.approvalSubTypeValue && props.approvalSubTypeValue !== undefined && props.approvalSubTypeValue.value === 1 ?
                    <>
                        <Col md="6">
                            <FormGroup>
                                <FormLabel><FormattedMessage id={"IDS_CORRECTION"} message="Correction" /></FormLabel>
                                <ReadOnlyText>{props.role.scorrectionneed}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    </>
                    : ""}
                {props.roleConfig ? props.roleConfig.map(item =>
                    item.stransdisplaystatus &&
                    <Col md="6">
                        <FormGroup>
                            <FormLabel><FormattedMessage id={item.stransdisplaystatus} /></FormLabel>
                            <ReadOnlyText>{props.role[`${item.ntranscode}`]}</ReadOnlyText>
                        </FormGroup>
                    </Col>
                ) : ""}
            </Row>
            <Row>
                <Col md={12} >
                    <CustomTab tabDetail={props.tabDetail} onTabChange={props.onTabOnChange} />
                </Col>
            </Row>
        </>
    );
}
export default injectIntl(UserRoleAccordion);
