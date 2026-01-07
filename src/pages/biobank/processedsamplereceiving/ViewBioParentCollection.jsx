import React from 'react';
import { Row, Col, FormGroup, FormLabel, Card } from "react-bootstrap";
import { ReadOnlyText } from '../../../components/App.styles';
import '../../../assets/styles/login.css';
import { transactionStatus } from '../../../components/Enumeration';

const ViewBioParentCollection = (props) => {
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
                            {/* Column 1 */}
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_PARENTSAMPLECODE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sparentsamplecode")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_CASETYPE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("scasetype")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_COLLECTIONSITE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("scollectionsitename")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_NUMBEROFSAMPLES" })}</FormLabel>
                                    <ReadOnlyText>{getValue("nnoofsamples")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_SUGGESTEDSTORAGE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sinstrumentid")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_SENDERNAME" })}</FormLabel>
                                    <ReadOnlyText>{getValue("ssendername")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_SAMPLECOLLECTIONDATE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("ssamplecollectiondate")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_TRANSACTIONDATE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("stransactiondate")}</ReadOnlyText>
                                </FormGroup>
                            </Col>

                            {/* Column 2 */}
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_COHORTNUMBER" })}</FormLabel>
                                    <ReadOnlyText>{getValue("ncohortno")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_BIOPROJECTTITLE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sprojecttitle")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_COLLECTEDHOSPITAL" })}</FormLabel>
                                    <ReadOnlyText>{getValue("shospitalname")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_TEMPERATUREDEG" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sstorageconditionname")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_STORAGE_TEMPERATURE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sstoragetemperature")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_RECIPIENTSNAME" })}</FormLabel>
                                    <ReadOnlyText>{getValue("srecipientusername")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_TEMPORARYSTORAGEDATE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("stemporarystoragedate")}</ReadOnlyText>
                                </FormGroup>
                            </Col>

                            {/* Column 3 */}
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_SAMPLETYPE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sproductcatname")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_BIOPROJECTCODE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sprojectcode")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_RECEIVINGSITE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sreceivingsitename")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_COLLECTORNAME" })}</FormLabel>
                                    <ReadOnlyText>{getValue("scollectorname")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_TEMPORARYSTORAGENAME" })}</FormLabel>
                                    <ReadOnlyText>{getValue("stemporarystoragename")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_TRANSACTIONSTATUS" })}</FormLabel>
                                    <ReadOnlyText>{getValue("stransactionstatus")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{props.formatMessage({ id: "IDS_ARRIVINGATBIOBANKDATE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("sbiobankarrivaldate")}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup> {/* Added by Gowtham on nov 14 2025 for jira.id:BGSI-216 */}
                                    <FormLabel>{props.formatMessage({ id: "IDS_THIRDPARTYSHARABLE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("nisthirdpartysharable") === transactionStatus.YES ? props.formatMessage({ id: "IDS_YES" }) : props.formatMessage({ id: "IDS_NO" })}</ReadOnlyText>
                                </FormGroup>
                                <FormGroup> {/* Added by Gowtham on nov 14 2025 for jira.id:BGSI-216 */}
                                    <FormLabel>{props.formatMessage({ id: "IDS_SAMPLEACCESABLE" })}</FormLabel>
                                    <ReadOnlyText>{getValue("nissampleaccesable") === transactionStatus.YES ? props.formatMessage({ id: "IDS_YES" }) : props.formatMessage({ id: "IDS_NO" })}</ReadOnlyText>
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
