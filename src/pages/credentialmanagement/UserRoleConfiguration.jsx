import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Button } from 'react-bootstrap';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
// import { css } from 'styled-components';
import ColumnMenu from '../../components/data-grid/ColumnMenu';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import { callService, crudMaster, updateStore, validateEsignCredential } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap, constructOptionList } from '../../components/CommonScript';
import { transactionStatus, formCode , userRoleConfigType} from '../../components/Enumeration';
import { ListWrapper } from '../../components/client-group.styles'
import { LocalizationProvider } from '@progress/kendo-react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
{/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import ReactTooltip from 'react-tooltip';

{/* component used by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import { Tooltip } from 'react-tooltip';





const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class UserRoleConfiguration extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.columnWidth = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            addScreen: false, data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            selectedUserRole: {}, columnName: '', rowIndex: 0
        }
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {

            loadEsign = false;
            openModal = false;
            selectedRecord['esignpassword'] = undefined;
            selectedRecord['esigncomments'] = undefined;
            selectedRecord['esignreason'] = undefined;
            const data = [...this.state.data];
            if (this.state.selectedUserRole[this.state.columnName] === transactionStatus.YES) {
                data[this.state.rowIndex][this.state.columnName] = transactionStatus.NO;

            }
            else {
                data[this.state.rowIndex][this.state.columnName] = transactionStatus.YES;

            }
			//ATE234 Janakumar ALPDJ21-55 Flow Validation Issues
            this.setState({ data , selectedRecord:{"suserroleconfigtype":this.state.selectedRecord.suserroleconfigtype}});
        }
        else {
            openModal = false;
            selectedRecord = {};
        }
		//ATE234 Janakumar ALPDJ21-55 Flow Validation Issues
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord:{"suserroleconfigtype":this.state.selectedRecord.suserroleconfigtype} }
        }
        this.props.updateStore(updateInfo);

    }

    render() {
        //  loadMessages(messages[this.props.Login.userInfo.slanguagetypecode], "lang");
        // this.columnWidth = [{ "width": "35%" },{ "width": "35%" },{ "width": "35%" },{ "width": "35%" }];
        // this.columnWidth = [{ "width": "20%" },{ "width": "20%" },{ "width": "20%" },{ "width": "20%" },{ "width": "20%" }];
        this.extractedColumnList = ["nuserrolecode", "suserrolename", "nneedapprovalflow", "nneedresultflow"];
        //, "nneedproductflow", "nwithdrawnmail"
        const pageSizes = this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting))
        return (<>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">
                        {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}

                        <AtTableWrap className="at-list-table">
                            <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                                <>
                                    <Grid
                                        // className={this.setPercentage()}
                                        // sortable
                                        className={"active-paging"}
                                        style={{ height: '600px' }}
                                        resizable
                                        reorderable
                                        //scrollable="none"
                                        scrollable={"scrollable"}
                                        pageable={{ buttonCount: 5, pageSizes: pageSizes, previousNext: false }}
                                        data={this.state.dataResult}
                                        {...this.state.dataState}
                                        onDataStateChange={this.dataStateChange}>
                                        <GridToolbar>
                                            <Row style={{display:"flex"}}>
                                                <Col md={2} style={{ textAlign: "left" }}>
                                                        {/* //Ate234 Janakumar BGSI-50 User Role Configuration -> filter-based record change. */}

                                                    <FormSelectSearch
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_USERROLECONFIGURATIONTYPE" })}
                                                        isSearchable={true}
                                                        name={"suserroleconfigtype"}
                                                        isDisabled={false}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                        isMandatory={false}
                                                        isClearable={false}
                                                        options={this.state.suserroleconfigtype && this.state.suserroleconfigtype || []}
                                                        value={this.state.selectedRecord["suserroleconfigtype"] || []}
                                                        onChange={(event) => this.onComboChange(event, "suserroleconfigtype", 1)}
                                                        closeMenuOnSelect={true}
                                                        isMulti={false}
                                                        defaultValue={this.state.selectedRecord["suserroleconfigtype"] && this.state.selectedRecord["suserroleconfigtype"] || []}

                                                    />
                                                </Col>
                                                <Col className="d-flex justify-content-end">
                                                    <Button className="btn btn-circle outline-grey" variant="link"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                        // data-for="tooltip-grid-wrap"
                                                        onClick={() => this.reloadData()}>
                                                        <FontAwesomeIcon icon={faSync} />
                                                    </Button>
                                                </Col>

                                            </Row>
                                        </GridToolbar>

                                        <GridColumn
                                            field="suserrolename"
                                            columnMenu={ColumnMenu}
                                            title={this.props.intl.formatMessage({ id: "IDS_USERROLENAME" })}
                                            cell={(row) => (
                                                <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"]['suserrolename']}
                                                // data-for="tooltip-grid-wrap"
                                                >
                                                    {row["dataItem"]['suserrolename']}
                                                </td>
                                            )}
                                        />
                                        {this.state.selectedRecord !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"] !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"].value === userRoleConfigType.LIMS ?  //modified by sujatha ATE_274 BGSI-185 from number 1 to Enumeration

                                            <GridColumn
                                                field={"nneedapprovalflow"}
                                                title={this.props.intl.formatMessage({ id: "IDS_NEEDAPPROVALFLOW" })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }}
                                                    //data-tooltip-id="my-tooltip" data-tooltip-content="jdjd" 
                                                    //  data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedapprovalflow"]}
                                                            onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedapprovalflow", row.dataIndex)}
                                                            checked={row["dataItem"]["nneedapprovalflow"] === transactionStatus.YES ? true : false}
                                                            name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td>)}
                                            />
                                            : ""}
                                        {this.state.selectedRecord !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"] !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"].value ===  userRoleConfigType.LIMS ?  //modified by sujatha ATE_274 BGSI-185 from number 1 to Enumeration
                                            <GridColumn
                                                field={"nneedresultflow"}
                                                title={this.props.intl.formatMessage({ id: "IDS_NEEDRESULTFLOW" })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }}
                                                    //data-tooltip-id="my-tooltip" data-tooltip-content="jdjd" 
                                                    //  data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedresultflow"]}
                                                            onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedresultflow", row.dataIndex)}
                                                            checked={row["dataItem"]["nneedresultflow"] === transactionStatus.YES ? true : false}
                                                            name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td>)}
                                            />

                                            : ""}

                                        {this.state.selectedRecord !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"] !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"].value === userRoleConfigType.BIOBANK ? //modified by sujatha ATE_274 BGSI-185 from number 2 to Enumeration
                                            <GridColumn
                                                field={"nneedtechnicianflow"}
                                                title={this.props.intl.formatMessage({ id: "IDS_TECHNICIAN" })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }}
                                                    //data-tooltip-id="my-tooltip" data-tooltip-content="jdjd" 
                                                    //  data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedtechnicianflow"]}
                                                            onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedtechnicianflow", row.dataIndex)}
                                                            checked={row["dataItem"]["nneedtechnicianflow"] === transactionStatus.YES ? true : false}
                                                            name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td>)}
                                            />
                                            : ""}

                                        {this.state.selectedRecord !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"] !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"].value === userRoleConfigType.BIOBANK ?   //modified by sujatha ATE_274 BGSI-185 from number 2 to Enumeration
                                            <GridColumn
                                                field={"nneedprojectinvestigatorflow"}
                                                title={this.props.intl.formatMessage({ id: "IDS_INVESTIGATORNAME" })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }}
                                                    //data-tooltip-id="my-tooltip" data-tooltip-content="jdjd" 
                                                    //  data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedprojectinvestigatorflow"]}
                                                            onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedprojectinvestigatorflow", row.dataIndex)}
                                                            checked={row["dataItem"]["nneedprojectinvestigatorflow"] === transactionStatus.YES ? true : false}
                                                            name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td>)}
                                            />
                                            : ""}

                                        {this.state.selectedRecord !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"] !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"].value === userRoleConfigType.BIOBANK ?    //modified by sujatha ATE_274 BGSI-185 from number 2 to Enumeration
                                            <GridColumn
                                                field={"nneedthirdpartyflow"}
                                                title={this.props.intl.formatMessage({ id: "IDS_THIRDPARTYROLE" })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }}
                                                    //data-tooltip-id="my-tooltip" data-tooltip-content="jdjd" 
                                                    //  data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedthirdpartyflow"]}
                                                            onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedthirdpartyflow", row.dataIndex)}
                                                            checked={row["dataItem"]["nneedthirdpartyflow"] === transactionStatus.YES ? true : false}
                                                            name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td>)}
                                            />
                                            : ""}
                                        
                                        {/* added by Sujatha BGSI-178 for added NGS column in UI */}
                                        {this.state.selectedRecord !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"] !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"].value === userRoleConfigType.BIOBANK ?    //modified by sujatha ATE_274 BGSI-185 from number 2 to Enumeration
                                            <GridColumn
                                                field={"nneedngsflow"}
                                                title={this.props.intl.formatMessage({ id: "IDS_NGS" })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }}
                                                    //data-tooltip-id="my-tooltip" data-tooltip-content="jdjd" 
                                                    //  data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedngsflow"]}
                                                            onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedngsflow", row.dataIndex)}
                                                            checked={row["dataItem"]["nneedngsflow"] === transactionStatus.YES ? true : false}
                                                            name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                            />
                                        : ""}


                                        {/* {  this.props.Login.masterData[0].nprojectcheck !=='0'? :""} */}
                                        {this.state.selectedRecord !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"] !== undefined &&
                                            this.state.selectedRecord["suserroleconfigtype"].value === userRoleConfigType.LIMS &&   //modified by sujatha ATE_274 BGSI-185 from number 1 to Enumeration
                                            this.props.Login.userRoleControlRights &&
                                            this.props.Login.userRoleControlRights[formCode.PROJECT] &&
                                            this.props.Login.userRoleControlRights[formCode.PROJECT].length > 0 ?

                                            <GridColumn
                                                field={"nneedprojectflow"}
                                                title={this.props.intl.formatMessage({ id: "IDS_NEEDPROJECTFLOW" })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }}
                                                    //data-tooltip-id="my-tooltip" data-tooltip-content="jdjd" 
                                                    //  data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedprojectflow"]}
                                                            onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedprojectflow", row.dataIndex)}
                                                            checked={row["dataItem"]["nneedprojectflow"] === transactionStatus.YES ? true : false}
                                                            name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td>)}
                                            />
                                            : ""}

                                        {/* <GridColumn
                                            field={"nneedproductflow"}
                                            title={this.props.intl.formatMessage({ id: "IDS_NEEDPRODUCTFLOW" })}
                                            headerClassName="text-center"
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }}>
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nneedproductflow"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nneedproductflow", row.dataIndex)}
                                                        checked={row["dataItem"]["nneedproductflow"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        />
                                        <GridColumn
                                            field={"nwithdrawnmail"}
                                            width="175px"
                                            title={this.props.intl.formatMessage({ id: "IDS_WITHDRAWNEMAIL" })}
                                            headerClassName="text-center"
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }}>
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nwithdrawnmail"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nwithdrawnmail", row.dataIndex)}
                                                        checked={row["dataItem"]["nwithdrawnmail"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        />
                                        <GridColumn
                                            field={"nfailmail"}
                                            width="175px"
                                            title={this.props.intl.formatMessage({ id: "IDS_FAILEMAIL" })}
                                            headerClassName="text-center"
                                            cell={(row) => (
                                                <td style={{ textAlign: "center" }}>
                                                    <CustomSwitch type="switch" id={row["dataItem"]["nfailmail"]}
                                                        onChange={(event) => this.onInputOnChangeRole(event, row["dataItem"], "nfailmail", row.dataIndex)}
                                                        checked={row["dataItem"]["nfailmail"] === transactionStatus.YES ? true : false}
                                                        name={row["dataItem"]["nuserrolecode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                </td>)}
                                        /> */}
                                    </Grid>
                                </>
                            </LocalizationProvider>
                        </AtTableWrap>
                        {/* <ReactTooltip/> */}
                    </ListWrapper>
                </Col>
            </Row>
            <SlideOutModal show={this.props.Login.openModal}
                closeModal={this.closeModal}
                operation={this.props.Login.operation}
                inputParam={this.props.Login.inputParam}
                screenName={this.props.Login.screenName}
                onSaveClick={this.onSaveClick}
                esign={this.props.Login.loadEsign}
                validateEsign={this.validateEsign}
                masterStatus={this.props.Login.masterStatus}
                updateStore={this.props.updateStore}
                selectedRecord={this.state.selectedRecord}
                addComponent={this.props.Login.loadEsign ?
                    <Esign operation={this.props.Login.operation}
                        formatMessage={this.props.intl.formatMessage}
                        onInputOnChange={this.onInputOnChange}
                        inputParam={this.props.Login.inputParam}
                        selectedRecord={this.state.selectedRecord || {}}
                    />
                    :
                    <>
                    </>
                }
            />
        </>
        );
    }

    // setPercentage = () => {
    //     let styles = css;
    //     let idx = 1;
    //     this.columnWidth.forEach(item => {
    //         styles += `.k-grid-header col:nth-of-type(${idx}){
    //                 width: ${item.width}
    //             }
    //             .k-grid-table col:nth-of-type(${idx}){
    //                 width: ${item.width}
    //             }`
    //         idx++;
    //     })
    // }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        //Ate234 Janakumar BGSI-50 User Role Configuration -> filter-based record change.

        if (comboData !== null) {
            selectedRecord[fieldName] = comboData;
        } else {
            selectedRecord[fieldName] = [];
        }
        this.setState({ selectedRecord });


    }
    componentDidUpdate(previousProps) {

         /* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
        //ReactTooltip.rebuild();

        //Ate234 Janakumar BGSI-50 User Role Configuration -> filter-based record change.
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData['lstUserRoleConfig'],
                    dataResult: process(this.props.Login.masterData && this.props.Login.masterData['lstUserRoleConfig'], this.state.dataState),
                });
            }
            // else {
            //     const masterdata=this.props.Login.masterData['lstUserRoleConfig']!==undefined?this.props.Login.masterData['lstUserRoleConfig']:this.props.Login.masterData;
            //     this.setState({
            //         data:masterdata,
            //         isOpen: false,
            //         selectedRecord: this.props.Login.selectedRecord,
            //         dataResult: process(this.props.Login.masterData['lstUserRoleConfig'], this.state.dataState),
            //     });
            // }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.masterData['lstUserRoleConfig'] !== undefined && this.props.Login.masterData['lstUserRoleConfig'] !== previousProps.Login.masterData['lstUserRoleConfig']) {
            this.setState({
                data: this.props.Login.masterData['lstUserRoleConfig'],
                dataResult: process(this.props.Login.masterData && this.props.Login.masterData['lstUserRoleConfig'], this.state.dataState),
            });

        }


        if (this.props.Login.masterData['lstuserroleconfigtype'] !== undefined && this.props.Login.masterData['lstuserroleconfigtype'] !== previousProps.Login.masterData['lstuserroleconfigtype']) {
            const constructType = constructOptionList(this.props.Login.masterData['lstuserroleconfigtype'] || [], "nuserroleconfigtypecode",
                "sdisplayname", undefined, undefined, false);

            const UserRoleConfigList = constructType.get("OptionList");

            const constructTypeDefault = constructOptionList([this.props.Login.masterData['defaultValueUserRoleConfig']] || [], "nuserroleconfigtypecode",
                "sdisplayname", undefined, undefined, false);

            const UserRoleConfigListDefault = constructTypeDefault.get("OptionList");
            let selectedRecord = {
                suserroleconfigtype: UserRoleConfigListDefault[0]
            };
            this.setState({ "suserroleconfigtype": UserRoleConfigList, selectedRecord });
        }
        //Ate234 Janakumar BGSI-50 User Role Configuration -> filter-based record change.

        // if (this.props.Login.masterData !== previousProps.Login.masterData) {
        //     this.setState({
        //         data: this.props.Login.masterData,
        //         addScreen: this.props.Login.showScreen,
        //         dataResult: process(this.props.Login.masterData, this.state.dataState),
        //     });
        // }
    }
    onInputOnChangeRole(event, rowItem, columnName, rowIndex) {

        const selectedRecord = rowItem || {};
        const selectedUserRole = rowItem || {};
        let isCheck = false;
        let editUserRoleConfiguration = this.state.controlMap.has("EditUserRoleConfiguration") && this.state.controlMap.get("EditUserRoleConfiguration").ncontrolcode;

        if (this.state.userRoleControlRights.indexOf(editUserRoleConfiguration) != -1) {
            if (columnName === "nneedresultflow") {
                if (event.target.checked === true) {
                    if (rowItem["nneedapprovalflow"] === transactionStatus.YES) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVALFLOWORRESULTFLOW" }));
                    }
                    else {
                        isCheck = true;
                    }
                }
                else {
                    // toast.warn("If you want deselect, Select another role");
                    isCheck = true;
                }

            }
            else if (columnName === "nneedapprovalflow") {
                if (event.target.checked === true) {
                    if (rowItem["nneedresultflow"] === transactionStatus.YES) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVALFLOWORRESULTFLOW" }));
                    }
                    else {
                        isCheck = true;
                    }
                }
                else {
                    isCheck = true;
                }
            }
            else if (columnName === "nneedtechnicianflow") {
                //Ate234 Janakumar BGSI-50 User Role Configuration -> filter-based record change.
                if (event.target.checked === true) {
                    if (rowItem["nneedtechnicianflow"] === transactionStatus.YES) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVALFLOWORRESULTFLOW" }));
                    }
                    // added by sujatha ATE_274 for validation when click both technician & thirdparty flow bgsi-178
                    if (rowItem["nneedthirdpartyflow"] === transactionStatus.YES) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTECHNICIANORTHIRDPARTYFLOW" }));
                    }
                    else {
                        isCheck = true;
                    }
                }
                else {
                    isCheck = true;
                }
            }
            else if (columnName === "nneedngsflow") {
                // added by sujatha ATE_274 BGSI-178 for allowing either ngs or third party flow and toggle switch
                if (event.target.checked === true) {
                    if (rowItem["nneedthirdpartyflow"] === transactionStatus.YES) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHIRDPARTYFLOWORNGSFLOW" }));
                    }
                    else {
                        isCheck = true;
                    }
                }
                else {
                    isCheck = true;
                }
            }
            else if (columnName === "nneedthirdpartyflow") {
                // added by sujatha ATE_274 BGSI-185 for allowing either third-party flow or ngs flow & for switching toggle
                if (event.target.checked === true) {
                    if (rowItem["nneedngsflow"] === transactionStatus.YES) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHIRDPARTYFLOWORNGSFLOW" }));
                    }
                    else if(rowItem["nneedprojectinvestigatorflow"] === transactionStatus.YES || rowItem["nneedtechnicianflow"] === transactionStatus.YES){
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_THIRDPARTYMUSTBEFORANYONEROLE" }));
                    }
                    else {
                        isCheck = true;
                    }
                }
                else {
                    isCheck = true;
                }
            }
            //added by sujatha ATE_274 for validation when clicking pi flow bgsi-185
            else if (columnName === "nneedprojectinvestigatorflow"){
                if (event.target.checked === true) {
                    if (rowItem["nneedthirdpartyflow"] === transactionStatus.YES) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPIORTHIRDPARTYFLOW" }));
                    }
                    else {
                        isCheck = true;
                    }
                }
                else {
                    isCheck = true;
                }
            }
            else if (columnName === "nneedprojectinvestigatorflow" || columnName === "nneedthirdpartyflow" || columnName === "nneedproductflow" || columnName === "nwithdrawnmail" || columnName === "nfailmail" || columnName === "nneedprojectflow") {
                isCheck = true;
            }

            if (isCheck === true) {
                selectedRecord[columnName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                selectedUserRole[columnName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                this.onSaveClick(selectedRecord, undefined, undefined);
                this.setState({ selectedUserRole, columnName, rowIndex });
            }
        }

    }
    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.name === "agree") {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });

    }

    reloadData = () => {

        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }



    onSaveClick = (selectedRecord, saveType, formRef) => {

        let operation = "";
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        //Ate234 Janakumar BGSI-50 User Role Configuration -> filter-based record change.
        selectedRecord["nuserroleconfigtypecode"] = this.state.selectedRecord['suserroleconfigtype'] !== undefined ? this.state.selectedRecord['suserroleconfigtype'].value : -1;
        // edit    
        inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = selectedRecord;
        this.extractedColumnList.map(item => {
            return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = selectedRecord[item] ? selectedRecord[item] : "";
        })
        operation = "update";

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, 114)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: operation//this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
        //this.props.crudMaster(inputParam);

    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }
}
export default connect(mapStateToProps, { callService, crudMaster, updateStore, validateEsignCredential })(injectIntl(UserRoleConfiguration));