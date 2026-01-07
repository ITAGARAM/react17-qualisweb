import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, FormLabel, Card, Button, Table, Modal } from "react-bootstrap";
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import { ReadOnlyText } from '../../../components/App.styles';
import '../../../assets/styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontIconWrap } from '../../../components/data-grid/data-grid.styles';
import { toast } from 'react-toastify';

const AddBioSampleAliquot = (props) => {
    const {
        selectedBioParentSampleCollection,
        containerTypeList,
        sampleTypeList,
        diagnosticTypeList,
        storageTypeList,
        formatMessage,
        userInfo,
        onDataChange,
        selectedRecord: initialSelectedRecord,
        aliquotList: initialAliquotList
    } = props;

    // const [selectedRecord, setSelectedRecord] = useState({});
    // const [aliquotList, setAliquotList] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingComboChange, setPendingComboChange] = useState(null);



    const [selectedRecord, setSelectedRecord] = useState(initialSelectedRecord);
    const [aliquotList, setAliquotList] = useState(initialAliquotList);

    // Sync only when props change (carefully!)
    useEffect(() => {
        setSelectedRecord(initialSelectedRecord);
    }, [initialSelectedRecord]);

    useEffect(() => {
        setAliquotList(initialAliquotList);
    }, [initialAliquotList]);

    useEffect(() => {
        setSelectedRecord(prev => {
            const updated = { ...prev };

            if (!updated.ndiagnostictypecode && diagnosticTypeList?.length > 0) {
                updated.ndiagnostictypecode = diagnosticTypeList[0];
            }
            if (!updated.ncontainertypecode && containerTypeList?.length > 0) {
                updated.ncontainertypecode = containerTypeList[0];
            }
            if (!updated.nproductcode && sampleTypeList?.length > 0) {
                updated.nproductcode = sampleTypeList[0];
            }

            return updated;
        });
    }, [diagnosticTypeList, containerTypeList, sampleTypeList]);




    // Notify parent on any internal state change
    useEffect(() => {
        onDataChange(selectedRecord, aliquotList);
    }, [selectedRecord, aliquotList]);

    const onInputOnChange = (event, fieldName) => {
        const { name, value } = event.target;
        if (fieldName === "naliquotcount" || fieldName === "nsamplecount") {
            if (/^\d*$/.test(value)) {
                setSelectedRecord(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setSelectedRecord(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const onComboChange = (selectedOption, name) => {
        if (name === "nproductcode" && !isSaved && aliquotList.length > 0) {
            setPendingComboChange({ selectedOption, name });
            setShowConfirmModal(true);
            return;
        }
        setSelectedRecord(prev => ({ ...prev, [name]: selectedOption }));
    };

    const handleConfirm = () => {
        if (pendingComboChange) {
            setAliquotList([]);
            setSelectedRecord(prev => ({
                ...prev,
                [pendingComboChange.name]: pendingComboChange.selectedOption
            }));
            setPendingComboChange(null);
        }
        setShowConfirmModal(false);
    };

    const handleCancel = () => {
        setPendingComboChange(null);
        setShowConfirmModal(false);
    };

    const handleDateChange = (name, date) => {
        setSelectedRecord(prev => ({ ...prev, [name]: date }));
    };

    const onGenerateAliquots = () => {
        const newCount = parseInt(selectedRecord.nsamplecount || 0);
        const biosampleTypeCode = selectedRecord.nproductcode;
        const storageTypeCode = selectedRecord.nstoragetypecode;
        const naliquotcount = parseInt(selectedRecord.naliquotcount || 0);

        if (
            !naliquotcount || naliquotcount <= 0 ||
            !newCount || newCount <= 0 ||
            !biosampleTypeCode || !storageTypeCode
        ) {
            if (!biosampleTypeCode) {
                toast.info(formatMessage({ id: "IDS_SELECTBIOSAMPLETYPE" }));
                return;
            }
            if (!storageTypeCode) {
                toast.info(formatMessage({ id: "IDS_SELECTSTORAGETYPE" }));
                return;
            }
            if (!naliquotcount || naliquotcount <= 0) {
                toast.info(formatMessage({ id: "IDS_ALIQUOTCOUNTCANNOTBEZEROOREMPTY" }));
                return;
            }
            if (!newCount || newCount <= 0) {
                toast.info(formatMessage({ id: "IDS_NOOFSAMPLESTOGENERATECANNOTBEZEROOREMPTY" }));
                return;
            }

        }

        if ((aliquotList.length + newCount) > naliquotcount) {
            toast.info(formatMessage({ id: "IDS_SAMPLECOUNTISMORETHANALIQUOTCOUNT" }));
            return;
        }

        const biosampleType = sampleTypeList.find(item => item.value === biosampleTypeCode.value)?.label || '';
        const storageType = storageTypeList.find(item => item.value === storageTypeCode.value)?.label || '';
        const nstoragetypecode = storageTypeList.find(item => item.value === storageTypeCode.value)?.value || -1;

        const newAliquots = Array.from({ length: newCount }, () => ({
            biosampleType,
            storageType,
            volume: '',
            biosampleTypeCode,
            storageTypeCode,
            nstoragetypecode,
        }));

        setAliquotList(prevList => {
            if (prevList.length >= naliquotcount) {
                toast.info(formatMessage({ id: "IDS_SAMPLECOUNTISMORETHANALIQUOTCOUNT" }));
                return prevList;
            }
            return [...prevList, ...newAliquots];
        });

        setIsSaved(false);
    };

    const onAliquotVolumeChange = (index, value) => {
        let sanitizedValue = value.replace(/[^\d,]/g, '');
        if (sanitizedValue.startsWith(',')) {
            sanitizedValue = '0' + sanitizedValue;
        }
        const firstCommaIndex = sanitizedValue.indexOf(',');
        if (firstCommaIndex !== -1) {
            const beforeComma = sanitizedValue.slice(0, firstCommaIndex);
            const afterComma = sanitizedValue.slice(firstCommaIndex + 1).replace(/,/g, '');
            sanitizedValue = beforeComma.slice(0, 3) + ',' + afterComma.slice(0, 2);
        } else {
            sanitizedValue = sanitizedValue.slice(0, 3);
        }
        if (sanitizedValue.length > 6) {
            sanitizedValue = sanitizedValue.slice(0, 6);
        }
        const updatedList = [...aliquotList];
        updatedList[index].volume = sanitizedValue;
        setAliquotList(updatedList);
    };

    const onDeleteAliquot = (index) => {
        const updatedList = [...aliquotList];
        updatedList.splice(index, 1);
        setAliquotList(updatedList);
    };

    return (
        <>
            <Row className='mb-2' style={{ marginTop: "-20px", paddingBottom: "10px" }}>
                <Col md={12}>
                    {/* chaged by sathish 11-aug-2025 the title theme */}
                    <Card className="parent-info mb-2" style={{ boxShadow: "-1px 1px 8px #ccccccb0", borderColor: "rgb(0 0 0 / 0%)" }}>
                        {/* chaged by sathish 11-aug-2025 the title theme */}
                        <span className="user-name" style={{ marginLeft: "2%", marginTop: "5px" }}>{<h4 >{props.formatMessage({ id: "IDS_PARENTSAMPLEINFO" })}</h4>}</span>
                        <Card.Body style={{ marginBottom: "-3.5%", marginTop: "0.01%", paddingLeft: "20px", paddingTop: "0" }}>
                            <Row>
                                <Col md={3}><FormGroup><FormLabel>{formatMessage({ id: "IDS_PARENTSAMPLECODE" })}</FormLabel><ReadOnlyText>{selectedBioParentSampleCollection.sparentsamplecode}</ReadOnlyText></FormGroup></Col>
                                <Col md={3}><FormGroup><FormLabel>{formatMessage({ id: "IDS_COHORTNUMBER" })}</FormLabel><ReadOnlyText>{selectedBioParentSampleCollection.ncohortno}</ReadOnlyText></FormGroup></Col>
                                <Col md={3}><FormGroup><FormLabel>{formatMessage({ id: "IDS_SAMPLETYPE" })}</FormLabel><ReadOnlyText>{selectedBioParentSampleCollection.sproductcatname}</ReadOnlyText></FormGroup></Col>
                                <Col md={3}><FormGroup><FormLabel>{formatMessage({ id: "IDS_CASETYPE" })}</FormLabel><ReadOnlyText>{selectedBioParentSampleCollection.scasetype}</ReadOnlyText></FormGroup></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <DateTimePicker
                        name="ddateReceived"
                        label={formatMessage({ id: "IDS_RECEIVEDDATE" })}
                        selected={selectedRecord.ddateReceived || new Date()}
                        onChange={(date) => handleDateChange("ddateReceived", date)}
                        className="form-control"
                        isMandatory={true}
                        isClearable={false}
                        dateFormat={userInfo.ssitedate}
                        value={selectedRecord.ddateReceived}
                    />
                    <FormSelectSearch
                        formLabel={formatMessage({ id: "IDS_DISEASESTATUS" })}
                        name="ndiagnostictypecode"
                        options={diagnosticTypeList || []}
                        value={selectedRecord.ndiagnostictypecode || ""}
                        onChange={(selectedOption) => onComboChange(selectedOption, "ndiagnostictypecode")}
                        isMandatory={true}
                    />
                    <FormSelectSearch
                        formLabel={formatMessage({ id: "IDS_CONTAINERTYPE" })}
                        name="ncontainertypecode"
                        options={containerTypeList || []}
                        value={selectedRecord.ncontainertypecode || ""}
                        onChange={(selectedOption) => onComboChange(selectedOption, "ncontainertypecode")}
                        isMandatory={true}
                    />
                </Col>
                <Col md={4}>
                    <FormSelectSearch
                        formLabel={formatMessage({ id: "IDS_BIOSAMPLETYPE" })}
                        name="nproductcode"
                        options={sampleTypeList || []}
                        value={selectedRecord.nproductcode || ""}
                        onChange={(selectedOption) => onComboChange(selectedOption, "nproductcode")}
                        isMandatory={true}
                    />
                    <FormInput
                        label={formatMessage({ id: "IDS_NUMBEROFALIQUOTS" })}
                        name="naliquotcount"
                        type="text"
                        value={selectedRecord.naliquotcount || ""}
                        onChange={(e) => onInputOnChange(e, "naliquotcount")}
                        onFocus={handleFocus}
                        isMandatory={true}
                        maxLength={2}
                    />
                </Col>
                <Col md={4}>
                    <FormSelectSearch
                        formLabel={formatMessage({ id: "IDS_STORAGETYPE" })}
                        name="nstoragetypecode"
                        options={storageTypeList || []}
                        value={selectedRecord.nstoragetypecode || ""}
                        onChange={(selectedOption) => onComboChange(selectedOption, "nstoragetypecode")}
                        isMandatory={true}
                    />
                    <FormInput
                        label={formatMessage({ id: "IDS_NUMBEROFSAMPLES" })}
                        name="nsamplecount"
                        type="text"
                        value={selectedRecord.nsamplecount || ""}
                        onChange={(e) => onInputOnChange(e, "nsamplecount")}
                        onFocus={handleFocus}
                        isMandatory={true}
                        maxLength={2}
                    />
                    <Button variant="primary" className="mt-1" onClick={onGenerateAliquots}>
                        {formatMessage({ id: "IDS_GENERATE" })}
                    </Button>
                </Col>
            </Row>

            {aliquotList.length > 0 && (
                <Row className="mt-4">
                    <Col md={12}>
                        <div style={{ overflowX: 'auto' }}>
                            <Table bordered hover size="sm" className="aliquot-table" style={{ tableLayout: "fixed" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "5%" }}>{formatMessage({ id: "IDS_SLNO" })}</th>
                                        <th style={{ width: "25%" }}>{formatMessage({ id: "IDS_BIOSAMPLETYPE" })}</th>
                                        <th style={{ width: "25%" }}>{formatMessage({ id: "IDS_STORAGETYPE" })}</th>
                                        <th style={{ width: "25%" }}>{formatMessage({ id: "IDS_VOLUMEµL" })}</th>
                                        <th style={{ width: "10%" }}>{formatMessage({ id: "IDS_ACTION" })}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {aliquotList.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "200px" }}>
                                                {item.biosampleType}
                                            </td>
                                            <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "200px" }}>
                                                {item.storageType}
                                            </td>
                                            <td className="form-bottom" style={{ padding: "0px", verticalAlign: "middle" }}>
                                                <FormInput
                                                    name={`volume_${index}`}
                                                    type="text"
                                                    showLabel={false}
                                                    onChange={(event) => onAliquotVolumeChange(index, event.target.value)}
                                                    placeholder={formatMessage({ id: "IDS_VOLUME" })}
                                                    value={item.volume}
                                                    required={true}
                                                    maxLength={8}
                                                    readOnly={isSaved}
                                                />
                                            </td>
                                            <td>
                                                {!isSaved && (
                                                    <FontIconWrap
                                                        className="d-font-icon action-icons-wrap"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={formatMessage({ id: "IDS_DELETE" })}
                                                        onClick={() => onDeleteAliquot(index)}
                                                        style={{ cursor: "pointer", fontSize: "14px" }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </FontIconWrap>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            )}

            <Modal show={showConfirmModal} onHide={handleCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{formatMessage({ id: "IDS_CONFIRMATION" })}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formatMessage({ id: "IDS_CHANGESAMPLETYPEANDCLEARALIQUOTS" })}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-user btn-cancel" onClick={handleCancel}>
                        {formatMessage({ id: "IDS_CANCEL" })}
                    </Button>
                    <Button className="btn-user btn-primary-blue" onClick={handleConfirm}>
                        {formatMessage({ id: "IDS_OK" })}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddBioSampleAliquot;
