import React from 'react';
import { Row, Col, FormGroup, FormLabel, Card } from "react-bootstrap";
import { ReadOnlyText } from '../../../components/App.styles';
import '../../../assets/styles/login.css';

const ViewBiobankECatalogueExternalRequest = (props) => {
    const selectedRecord = props.selectedRecord || {};

    // Utility to handle null/undefined/empty
    const getValue = (key) => {
        const value = selectedRecord[key];
        return value !== null && value !== undefined && value !== '' ? value : '-';
    };

    return (
        <Row className='mb-2' style={{ marginTop: "-20px", paddingBottom: "10px" }}>
            <Col md={12}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_REQUESTFORMTYPE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sreqformtypename")}</ReadOnlyText>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_NGSTHIRDPARTYINSTITUTION" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sthirdpartyname")}</ReadOnlyText>
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row>
                            {/* Column 1 */}
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_BIOBANKECATALOGUEEXTERNALREQUESTFORM" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sformnumber")}</ReadOnlyText>
                                </FormGroup>
                               
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_REQUESTEDDATE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("srequesteddate")}</ReadOnlyText>
                                </FormGroup>

                            </Col>

                            {/* Column 2 */}
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_BIOPROJECTTITLE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sprojecttitles")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_LASTTRANSACTIONDATE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("stransactiondate")}</ReadOnlyText>
                                </FormGroup>

                            </Col>

                            {/* Column 3 */}
                            <Col md={4}>
                             <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_REQUESTEDSITE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sreceivingsitename")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_TRANSACTIONSTATUS" })}</FormLabel>
                                    <ReadOnlyText>{getValue("stransactionstatus")}</ReadOnlyText>
                                </FormGroup>

                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_REMARKS" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sremarks")}</ReadOnlyText>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_APPROVALREMARKS" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sapprovalremarks")}</ReadOnlyText>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ViewBiobankECatalogueExternalRequest;
