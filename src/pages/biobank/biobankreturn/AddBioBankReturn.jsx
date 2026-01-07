import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { rearrangeDateFormat } from '../../../components/CommonScript';
import { FontIconWrap } from '../../../components/data-grid/data-grid.styles';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import Preloader from '../../../components/preloader/preloader.component';
import rsapi from '../../../rsapi';
import { UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class AddBioBankReturn extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
        };
        this.state = {
            loading: false,
            dataState: dataState,
            dataResult: [],
            total: 0,
            lstFormNumberDetails: props.lstFormNumberDetails,
            operation: props.operation,
            selectedChildRecord: {},
            selectedRecord: {
                ...props.selectedRecord,
                nprimaryKeyBioDirectTransfer: -1,
                addSelectAll: false
            },
            controlMap: props.controlMap,
            userRoleControlRights: props.userRoleControlRights,
            bioBankSiteDisable: props.bioBankSiteDisable,
            lstFormAcceptanceDetails: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.props.Login.selectedRecord) !== JSON.stringify(prevProps.Login.selectedRecord)) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord })
        }
        if (JSON.stringify(this.props.Login.masterData.lstFormNumberDetails) !== JSON.stringify(prevProps.Login.masterData.lstFormNumberDetails)) {
            this.setState({ lstFormNumberDetails: this.props.Login.masterData.lstFormNumberDetails });
        }
        if (JSON.stringify(this.props.Login.selectedChildRecord) !== JSON.stringify(prevProps.Login.selectedChildRecord)) {
            this.setState({ selectedRecord: this.props.Login.selectedChildRecord });
        }

        // 🆕 reset grid when parent clears list
        if (
            this.props.Login.selectedRecord?.lstGetSampleReceivingDetails?.length === 0 &&
            prevProps.Login.selectedRecord?.lstGetSampleReceivingDetails?.length > 0
        ) {
            this.setState({
                dataResult: [],
                total: 0,
                dataState: { skip: 0, take: 10, sort: [], filter: null }
            });
        }

        if (
            JSON.stringify(this.props.Login.selectedRecord.lstGetSampleReceivingDetails) !==
            JSON.stringify(prevProps.Login.selectedRecord.lstGetSampleReceivingDetails)
        ) {
            const processed = process(this.props.Login.selectedRecord.lstGetSampleReceivingDetails || [], {
                skip: 0,
                take: 10,
                sort: [],
                filter: null
            });

            this.setState({
                dataResult: processed.data,
                total: processed.total,
                dataState: { skip: 0, take: 10, sort: [], filter: null }
            });
        }

        if (
            this.props.Login?.selectedChildRecord?.lstGetSampleReceivingDetails?.length === 0 &&
            prevProps.Login?.selectedChildRecord?.lstGetSampleReceivingDetails?.length > 0
        ) {
            this.setState({
                dataResult: [],
                total: 0,
                dataState: { skip: 0, take: 10, sort: [], filter: null }
            });
        }

        if (
            JSON.stringify(this.props.Login?.selectedChildRecord?.lstGetSampleReceivingDetails) !==
            JSON.stringify(prevProps.Login?.selectedChildRecord?.lstGetSampleReceivingDetails)
        ) {
            const processed = process(this.props.Login?.selectedChildRecord?.lstGetSampleReceivingDetails || [], {
                skip: 0,
                take: 10,
                sort: [],
                filter: null
            });

            this.setState({
                dataResult: processed.data,
                total: processed.total,
                dataState: { skip: 0, take: 10, sort: [], filter: null }
            });
        }
    }

    render() {
        this.extractedFields =
            [
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "100px" },
                { "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "100px" },
                { "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "width": "100px" },
                { "idsName": "IDS_RECEIVEDVOLUMEµL", "dataField": "svolume", "width": "100px" }
            ];

        const gridBoxStyle = {
            border: '1px dotted #ccc',  // dotted border creates minute line effect
            backgroundColor: '#fff',    // white background
            padding: '1rem',            // padding like p-3
            borderRadius: '4px',        // optional rounded corners
            paddingTop: '3rem'
        };

        let lstFormAcceptanceDetails = this.state.selectedRecord?.lstFormAcceptanceDetails;

        return (
            <>
                <Preloader loading={this.state.loading} />
                <Row>
                    {this.props?.operation !== "update" &&
                        <Col md={6}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                                isSearchable={true}
                                name={"nbioformacceptancecode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={this.state.lstFormNumberDetails}
                                optionId='nbioformacceptancecode'
                                optionValue='sformnumber'
                                value={this.state.selectedRecord ? this.state.selectedRecord.nbioformacceptancecode : ""}
                                onChange={(event) => this.onComboChange(event, 'nbioformacceptancecode')}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                        </Col>
                    }
                    {this.props?.operation === "update" &&
                        <Col md={6}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                                isSearchable={true}
                                name={"nbiobankreturncode"}
                                isDisabled={true}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={this.state.lstFormNumberDetails}
                                optionId='nbiobankreturncode'
                                optionValue='sbankreturnformnumber'
                                value={this.state.selectedRecord ? this.state.selectedRecord.nbiobankreturncode : ""}
                                onChange={(event) => this.onComboChange(event, 'nbiobankreturncode')}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                        </Col>
                    }
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_ORIGINSITE" })}
                            isSearchable={true}
                            name={"noriginsitecode"}
                            isDisabled={true}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            optionId='noriginsitecode'
                            optionValue='soriginsitename'
                            value={this.state.selectedRecord ? this.state.selectedRecord.noriginsitecode : ""}
                            onChange={(event) => this.onComboChange(event, 'noriginsitecode')}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"todate"}
                            label={this.props.intl.formatMessage({ id: "IDS_RETURNDATE" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.state.selectedRecord.dreturndate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.dreturndate) : null}
                            dateFormat={this.props.Login.userInfo["ssitedate"]}
                            isClearable={false}
                            isMandatory={true}
                            isDisabled={this.props.isChildSlideOut ? this.props.isChildSlideOut : false}
                            onChange={date => this.handleDateChange("dreturndate", date)}
                            value={this.state.selectedRecord.dreturndate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.dreturndate) : null}
                        />
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            name={"sremarks"}
                            type="text"
                            onChange={(event) => this.onComboChange(event, 'sremarks')}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            value={this.state.selectedRecord ? this.state.selectedRecord.sremarks : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                            isDisabled={this.props.isChildSlideOut ? this.props.isChildSlideOut : false}
                        />
                    </Col>
                </Row>
                <Row>
                    {lstFormAcceptanceDetails && lstFormAcceptanceDetails.length > 0 && (
                        <Row className="mt-4">
                            <Col md={12}>
                                <div style={{ overflowX: 'auto' }}>
                                    <Table bordered hover size="sm" className="aliquot-table" style={{ tableLayout: "fixed" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "10%" }}>{this.props.intl.formatMessage({ id: "IDS_SLNO" })}</th>
                                                <th style={{ width: "20%" }}>{this.props.intl.formatMessage({ id: "IDS_REPOSITORYID" })}</th>
                                                {/* <th style={{ width: "20%" }}>{this.props.intl.formatMessage({ id: "IDS_LOCATIONCODE" })}</th> */}
                                                <th style={{ width: "20%" }}>{this.props.intl.formatMessage({ id: "IDS_BIOSAMPLETYPE" })}</th>
                                                <th style={{ width: "20%" }}>{this.props.intl.formatMessage({ id: "IDS_RECEIVEDVOLUMEµL" })}</th>
                                                <th style={{ width: "20%" }}>{this.props.intl.formatMessage({ id: "IDS_RETURNVOLUMEµL" })}</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lstFormAcceptanceDetails && lstFormAcceptanceDetails.length > 0
                                                && lstFormAcceptanceDetails.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "200px" }}>
                                                            {item.srepositoryid !== null && item.srepositoryid !== "" ? item.srepositoryid : '-'}
                                                        </td>
                                                        {/* <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "200px" }}>
                                                            {item.slocationcode !== null && item.slocationcode !== "" ? item.slocationcode : '-'}
                                                        </td> */}
                                                        <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "200px" }}>
                                                            {item.sproductname !== null && item.sproductname !== "" ? item.sproductname : '-'}
                                                        </td>
                                                        <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "200px" }}>
                                                            {item.svolume !== null && item.svolume !== "" ? item.svolume : '-'}
                                                        </td>
                                                        <td className="form-bottom" style={{ padding: "0px", verticalAlign: "middle" }}>
                                                            <FormInput
                                                                name={`volume_${index}`}
                                                                type="text"
                                                                showLabel={false}
                                                                onChange={(event) => this.onAliquotVolumeChange(index, event.target.value)}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_VOLUME" })}
                                                                value={item.sreturnvolume && item.sreturnvolume || ""}
                                                                required={true}
                                                                maxLength={8}
                                                            />
                                                        </td>
                                                        <td>
                                                            {
                                                                (
                                                                    <FontIconWrap
                                                                        className="d-font-icon action-icons-wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                        onClick={() => this.onDeleteAliquot(index)}
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
                </Row>
            </>
        );
    }

    onAliquotVolumeChange = (index, value) => {
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
        const updatedList = [...this.state.lstFormAcceptanceDetails];
        updatedList[index].sreturnvolume = sanitizedValue;
        let selectedRecord = this.state.selectedRecord;
        selectedRecord["lstFormAcceptanceDetails"] = updatedList;
        this.setState({ lstFormAcceptanceDetails: updatedList, selectedRecord });
        this.props.childDataChange(selectedRecord);
    };

    onDeleteAliquot = (index) => {
        const updatedList = [...this.state.lstFormAcceptanceDetails];
        updatedList.splice(index, 1);
        let selectedRecord = this.state.selectedRecord;
        selectedRecord["lstFormAcceptanceDetails"] = updatedList;
        const lstFormAcceptanceDetails = updatedList;
        this.setState({ lstFormAcceptanceDetails, selectedRecord });
        this.props.childDataChange(selectedRecord);
    };

    onComboChange = (event, field) => {
        let selectedRecord = this.state.selectedRecord
        if (field === 'nbioformacceptancecode') {
            rsapi().post("biobankreturn/getFormAcceptanceDetails", { 'userinfo': this.props.Login.userInfo, 'nbioformacceptancecode': event.value || -1 })
                .then(response => {
                    selectedRecord[field] = event;
                    selectedRecord["noriginsitecode"] = {
                        "label": event.item?.soriginsitename,
                        "value": event.item?.noriginsitecode
                    };
                    let lstFormAcceptanceDetails = response.data.lstFormAcceptanceDetails || [];
                    selectedRecord["lstFormAcceptanceDetails"] = lstFormAcceptanceDetails;
                    this.setState({ selectedRecord, lstFormAcceptanceDetails });
                    this.props.childDataChange(selectedRecord);
                })
                .catch(error => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                            data: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }

                        }
                        this.props.updateStore(UnAuthorizedAccess);
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else if (field === 'sremarks') {
            selectedRecord[field] = event.target.value;
            this.setState({ selectedRecord });
            this.props.childDataChange(selectedRecord);
        }
        else {
            selectedRecord[field] = event;
            this.setState({ selectedRecord });
            this.props.childDataChange(selectedRecord);
        }
    }

    handleDateChange = (field, value) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[field] = value;
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    filterData = () => {
        let selectedRecord = this.state.selectedRecord;
        if (selectedRecord.nbiobanksitecode && selectedRecord.nbiobanksitecode !== '' && selectedRecord.nbiobanksitecode !== null
            && selectedRecord.nbioprojectcode && selectedRecord.nbioprojectcode !== '' && selectedRecord.nbioprojectcode !== null
            && selectedRecord.nbioparentsamplecode && selectedRecord.nbioparentsamplecode !== '' && selectedRecord.nbioparentsamplecode !== null) {
            this.setState({ loading: true });
            rsapi().post("biodirecttransfer/getSampleReceivingDetails", {
                'userinfo': this.props.Login.userInfo,
                'nbioparentsamplecode': selectedRecord.nbioparentsamplecode?.value || -1,
                'nstoragetypecode': selectedRecord.nstoragetypecode?.value || -1,
                'nproductcode': selectedRecord.nproductcode?.value || -1,
                'nbiobanksitecode': selectedRecord.nbiobanksitecode?.value || -1,
                'nbioprojectcode': selectedRecord.nbioprojectcode?.value || -1
            }).then(response => {
                const lstGetSampleReceivingDetails = response.data?.lstGetSampleReceivingDetails || [];
                selectedRecord['lstGetSampleReceivingDetails'] = lstGetSampleReceivingDetails;
                selectedRecord['addedSampleReceivingDetails'] = [];
                selectedRecord['addSelectAll'] = false;
                let dataState = { skip: 0, take: 10 };

                const processed = process(response.data?.lstGetSampleReceivingDetails || [], dataState);
                const selectedChildRecord = { ...selectedRecord }
                this.setState({
                    selectedRecord,
                    selectedChildRecord,
                    loading: false,
                    dataResult: processed.data,   // store array only
                    total: processed.total,       // store total separately
                    dataState
                });
            })
                .catch(error => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                            data: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }

                        }
                        this.props.updateStore(UnAuthorizedAccess);
                        this.setState({ loading: false });
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                        this.setState({ loading: false });
                    }
                    else {
                        toast.warn(error.response.data);
                        this.setState({ loading: false });
                    }
                })
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTMANDATORYFIELDSTOFILTER" }));
            this.setState({ loading: false });
        }
    }
}

export default connect(mapStateToProps, {})(injectIntl(AddBioBankReturn));