import React from "react";
import { Card, Col, FormGroup, FormLabel, Row } from "react-bootstrap";
import '../../../assets/styles/login.css';
import { ReadOnlyText } from '../../../components/App.styles';

const ViewBioParentCollection = (props) => {
    const selectedRecord = props.selectedRecord || {};

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

                        </Row>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_THIRDPARTYECATALOGUEREQUESTFORM" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sformnumber")}</ReadOnlyText>
                                </FormGroup>

                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_REQUESTEDDATE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("srequesteddate")}</ReadOnlyText>
                                </FormGroup>

                            </Col>

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

export default ViewBioParentCollection;
