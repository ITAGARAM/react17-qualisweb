
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Card, FormGroup, FormLabel, Nav, Image } from 'react-bootstrap';
import { Grid, GridColumn, GridColumnMenuFilter, GridNoRecords } from '@progress/kendo-react-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { //faCalculator, 
    faArchive,
    faCalculator,
    faCloudDownloadAlt, faEgg, faEye, faListAlt, faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
//import { Tooltip } from '@progress/kendo-react-tooltip';
import { ReactComponent as EBCCalculation } from '../../assets/image/formula calculation.svg';
import ColumnMenu from '../../components/data-grid/ColumnMenu';
import { attachmentType, parameterType, transactionStatus } from '../../components/Enumeration';
import SimpleGrid from '../../components/data-grid/SimpleGrid';
import enforcestatus from '../../assets/image/enforcestatus.svg'
import { ReactComponent as Enforcestatus } from '../../assets/image/enforcestatus.svg';
import { AtTableWrap, FontIconWrap, FormControlStatic } from '../../components/data-grid/data-grid.styles';
// import ReactTooltip from 'react-tooltip';
import {  LocalizationProvider } from '@progress/kendo-react-intl';
import { connect } from 'react-redux';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class ResultGrid extends React.Component {
    columnProps(field) {
        if (!this.props.hideColumnFilter) {
            return {
                field: field,
                columnMenu: ColumnMenu,
                //headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
            };
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }

    handleClickDelete = (deleteParam) => {
        this.props.deleteRecord(deleteParam);
    }
    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;

        if (this.props.hasChild && event.value === true) {
            event.dataItem.expanded = !isExpanded;
            this.props.handleExpandChange(event, this.props.dataState)
        }
        else {
            event.dataItem.expanded = !isExpanded;
            this.setState({ isExpanded });
        }
    }
    detailBand = (props) => {
        return (
            <Row bsPrefix="margin_class">
                <Col md={12}>
                    {this.props.hasChild ?
                        <SimpleGrid childList={this.props.childList.get(parseInt(props.dataItem[this.props.childMappingField])) || []}
                            extractedColumnList={this.props.childColumnList} />
                        :
                        <Card>
                            <Card.Header><FormattedMessage id="IDS_MOREINFO" message="More Info" /></Card.Header>
                            <Card.Body>
                                <Row>
                                    {this.props.detailedFieldList.map((item, key) => {
                                        let validationtype = true;
                                        if (item.istypeValidation) {
                                            if (props.dataItem['nparametertypecode'] !== parameterType.NUMERIC) {
                                                validationtype = false;
                                            }
                                        }

                                        if (validationtype) {
                                            return (
                                                <Col md={item.isDecsriptionField ? 6 : 4} key={key}>
                                                    { //props.dataItem['nparametertypecode'] === parameterType.PREDEFINED && item.dataField==='spredefinedcomments'?  
                                                    // <FormGroup>
                                                    //     <FormLabel>
                                                    //         <FormattedMessage id={item.idsName} message={item.idsName} />
                                                    //         {item.needHistoryButton ?
                                                    //             <Nav.Link name={"enforcestatuscomments"}
                                                    //                         className="btn btn-circle outline-grey mr-2 ml-1"
                                                    //                         data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: item.buttonTitle })}
                                                    //                      //   data-for="tooltip_grid_wrap"
                                                    //                         onClick={() => item.onClickButton(props.dataItem, this.props.masterData, this.props.userInfo)}
                                                    //                         >
                                                    //             <FontAwesomeIcon icon={faEye}   />
                                                    //             </Nav.Link> 
                                                    //             // <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                    //             //         style={{ display: "inline-block" }} >
                                                    //             //     <FontIconWrap className="d-font-icon p-1" title={this.props.intl.formatMessage({ id: item.buttonTitle })}>
                                                    //             //         <FontAwesomeIcon
                                                    //             //             icon={faEye}
                                                    //             //             onClick={() => item.onClickButton(props.dataItem, this.props.masterData, this.props.userInfo)}
                                                    //             //         >
                                                    //             //         </FontAwesomeIcon>
                                                    //             //     </FontIconWrap>
                                                    //             // </Nav.Link>
                                                    //             : ""}
                                                    //     </FormLabel>
                                                    //     <FormControlStatic>
                                                    //         {props.dataItem[item.dataField] === undefined || props.dataItem[item.dataField] === null || props.dataItem[item.dataField].length === 0 ? '-' :
                                                    //             item.isIdsField ? <FormattedMessage id={props.dataItem[item.dataField]} message={props.dataItem[item.dataField]} /> : props.dataItem[item.dataField]}
                                                    //     </FormControlStatic>
                                                    //     <FontIconWrap className="d-font-icon" 
                                                    //       data-place="left" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDITPREFINEDCOMMENTS" })}
                                                    //       hidden={this.props.userRoleControlRights &&
                                                    //          this.props.userRoleControlRights.indexOf(this.props.controlMap.has("EditPredefinedComments")
                                                    //          && this.props.controlMap.get("EditPredefinedComments").ncontrolcode) === -1}
                                                    //       onClick={() => this.props.editpredefinedcomments(props.dataItem)
                                                    //        }
                                                    //      >
                                                    //    <FontAwesomeIcon icon={faPencilAlt} />
                                                    //     </FontIconWrap>  

                                                    // </FormGroup>:
                                                    //    item.dataField==='spredefinedcomments'? ""  :
                                                       <FormGroup>
                                                       <FormLabel>
                                                           <FormattedMessage id={item.idsName} message={item.idsName} />
                                                           {item.needHistoryButton ?
                                                               <Nav.Link name={"enforcestatuscomments"}
                                                                           className="btn btn-circle outline-grey mr-2 ml-1"
                                                                           data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: item.buttonTitle })}
                                                                        //   data-for="tooltip_grid_wrap"
                                                                           onClick={() => item.onClickButton(props.dataItem, this.props.masterData, this.props.userInfo 
                                                                            ,item.idsName,item.dataField)}
                                                                           >
                                                               <FontAwesomeIcon icon={faEye}   />
                                                               </Nav.Link> 
                                                               // <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                               //         style={{ display: "inline-block" }} >
                                                               //     <FontIconWrap className="d-font-icon p-1" title={this.props.intl.formatMessage({ id: item.buttonTitle })}>
                                                               //         <FontAwesomeIcon
                                                               //             icon={faEye}
                                                               //             onClick={() => item.onClickButton(props.dataItem, this.props.masterData, this.props.userInfo)}
                                                               //         >
                                                               //         </FontAwesomeIcon>
                                                               //     </FontIconWrap>
                                                               // </Nav.Link>
                                                               : ""}
                                                       </FormLabel>
                                                       <FormControlStatic>
                                                           {props.dataItem[item.dataField] === undefined || props.dataItem[item.dataField] === null || props.dataItem[item.dataField].length === 0 ? '-' :
                                                               item.isIdsField ? <FormattedMessage id={props.dataItem[item.dataField]} message={props.dataItem[item.dataField]} /> : props.dataItem[item.dataField]}
                                                       </FormControlStatic>  
                                                   </FormGroup>}
                                                </Col>
                                            )
                                        }
                                    })}
                                </Row>
                            </Card.Body>
                        </Card>}
                </Col> </Row>
        )
    }
    render() {
   
        //const methodUrl = this.props.methodUrl ? this.props.methodUrl : (this.props.inputParam && this.props.inputParam.methodUrl);

        const editId = this.props.controlMap.has("AddParameterComments")
            && this.props.controlMap.get("AddParameterComments").ncontrolcode;

        const enforceStatusID = this.props.controlMap.has("EnforceStatus")
            && this.props.controlMap.get("EnforceStatus").ncontrolcode;

        const checklistID = this.props.controlMap.has("EditChecklist")
            ? this.props.controlMap.get("EditChecklist").ncontrolcode : -1;

        const selectedId = this.props.selectedId;

        const pageSizes = this.props.pageSizes ? this.props.pageSizes : this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting))

        return (
            <>
                <AtTableWrap className="at-list-table" actionColWidth={this.props.actionColWidth ? this.props.actionColWidth : "150px"} >
                <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_grid_wrap" /> */}
                    {/* <Tooltip openDelay={100} position="bottom" tooltipClassName="ad-tooltip" anchorElement="element" parentTitle={true}> */}
                    <Grid
                        style={{ height: this.props.gridHeight }}
                        sortable
                        resizable
                        reorderable={false}
                        scrollable={this.props.scrollable}
                        pageable={this.props.pageable ? { buttonCount: 4, pageSizes: pageSizes, previousNext: false } : ""}
                        groupable={this.props.groupable ? true : false}
                        detail={this.detailBand}
                        expandField={this.props.expandField ? this.props.expandField : false}
                        onExpandChange={this.expandChange}
                        data={this.props.dataResult}
                        {...this.props.dataState}
                        selectedField="selected"
                        onRowClick={this.props.handleRowClick}
                        onDataStateChange={this.props.dataStateChange}>
                        <GridNoRecords>
                         {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                        </GridNoRecords>
                        {this.props.extractedColumnList.map((item, index) =>

                            <GridColumn key={index}
                                // data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: item.idsName })}
                                title={this.props.intl.formatMessage({ id: item.idsName })}
                                {...this.columnProps(item.dataField)}
                                width={item.width}
                                cell={(row) => (
                                    <>
                                        {item.fieldType === "attachment" && row["dataItem"]['nparametertypecode'] === parameterType.ATTACHMENT &&
                                            row["dataItem"]['nattachmenttypecode'] === attachmentType.FTP ?
                                            row.rowType === "groupHeader" ? null :
                                                <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]} className={selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}>
                                                    {/* <ReactTooltip /> */}
                                                    <FontAwesomeIcon icon={faCloudDownloadAlt} title={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })}
                                                        onClick={() => this.props.viewFile({ ...this.props.attachmentParam, inputData: { selectedRecord: row["dataItem"], userinfo: this.props.userInfo } }, row)}
                                                    />{" "}
                                                    {row["dataItem"][item.dataField]}
                                                </td>

                                            :
                                            item.fieldType === "attachment" && row["dataItem"]['nattachmenttypecode'] === attachmentType.LINK ?
                                                row.rowType === "groupHeader" ? null :
                                                    <td>
                                                        <a href={row["dataItem"][item.dataField]} style={{ cursor: "pointer" }} onClick={() => this.props.viewFile({ ...this.props.attachmentParam, inputData: { selectedRecord: row["dataItem"], userinfo: this.props.userInfo } }, row)}>
                                                            {row["dataItem"][item.dataField]}
                                                        </a>
                                                    </td>
                                                :
                                                item.fieldType === "checklistview" ?
                                                    row.rowType === "groupHeader" ? null :
                                                        row["dataItem"][item.checklistKey] > 0 ?
                                                            <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}
                                                             //data-for="tooltip_grid_wrap" 
                                                             className={selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}>   
                                                               
                                                               <FontIconWrap className="d-font-icon"  // data-for="tooltip-grid-wrap" 
                                                                   // data-for="tooltip-grid-wrap" 
                                                                    // onClick={() => this.props.viewFile({ ...this.props.attachmentParam, inputData: { selectedRecord: row["dataItem"], userinfo: this.props.userInfo } }, row)}
                                                                    needSaveButton={true}
                                                                    onClick={() => this.props.checkListRecord({
                                                                        ...this.props.checklistParam, selectedRecord: row["dataItem"], ncontrolcode: checklistID,
                                                                        needSaveButton: !(this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(checklistID) === -1)
                                                                    }, row)} >
                                                                <FontAwesomeIcon
                                                                    icon={faListAlt}
                                                                  
                                                                /></FontIconWrap>{" "}
                                                                {row["dataItem"][item.dataField]}
                                                            </td>
                                                            :
                                                            <>
                                                            <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]} 
                                                          //  data-for="tooltip_grid_wrap" 
                                                            className={selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}>
                                                                {row["dataItem"][item.dataField]}
                                                            </td>
                                                            </>
                                                    :
                                                    item.fieldType === "gradeColumn" ?
                                                        row.rowType === "groupHeader" ? null :
                                                            <td
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}
                                                               // data-for="tooltip_grid_wrap"
                                                                className={`${selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}`}
                                                                style={{ color: [row["dataItem"]['scolorhexcode']] }}
                                                            >
                                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_grid_wrap" /> */}
                                                                {row["dataItem"][item.dataField]}
                                                            </td>
                                                        :
                                                        <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]} 
                                                        //data-for="tooltip_grid_wrap" 
                                                        className={selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}>
                                                            {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                                : row["dataItem"][item.dataField]}
                                                        </td>
                                        }
                                    </>

                                )}
                            />
 
                        )}

                        {this.props.isActionRequired ?
                            <GridColumn
                                locked
                                headerClassName="text-center"
                                title={this.props.intl.formatMessage({ id: 'IDS_ACTION' })}
                                sort={false}
                                cell={(row) => (
                                    row.rowType === "groupHeader" ? null :
                                        <td className={`k-grid-content-sticky k-command-cell selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''`} style={{ left: '0', right: '0', borderRightWidth: '1px', textAlign: 'center' }}>

                                            <>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_tgrid_wrap" /> */}
                                                <Nav.Link className='text-left'>
                                                   
                                                <FontIconWrap className="d-font-icon action-icons-wrap"
                                                // data-for="tooltip_grid_wrap" 
                                                data-place="left" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PARAMETERCOMMENTS" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(editId) === -1}
                                                                onClick={() => this.props.fetchRecord({ ...this.props.editParam, primaryKeyValue: row["dataItem"][this.props.editParam.primaryKeyField], selectedRecord: row["dataItem"], controlcode: editId })}
                                                            >
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                            
                                                            </FontIconWrap>


                                                    {/* <FontIconWrap className="d-font-icon" data-for="tooltip_grid_wrap" data-place="left" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PARAMETERCOMMENTS" })}>
                                                        <FontAwesomeIcon icon={faPencilAlt}
                                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(editId) === -1}
                                                            onClick={() => this.props.fetchRecord({ ...this.props.editParam, primaryKeyValue: row["dataItem"][this.props.editParam.primaryKeyField], selectedRecord: row["dataItem"], controlcode: editId })}
                                                        />
                                                    </FontIconWrap> */}
                                                   {/* ALPD-4049 */}
                                                    <FontIconWrap className="d-font-icon action-icons-wrap"
                                                    // data-for="tooltip_grid_wrap" 
                                                    data-place="left" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ENFORCESTATUS" })}
                                                    
                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(enforceStatusID) === -1}
                                                    onClick={() => this.props.fetchRecord({ ...this.props.editParam, primaryKeyValue: row["dataItem"][this.props.editParam.primaryKeyField], editRow: row["dataItem"] })}
                                                    >
                                                        {/* <Image
                                                            src={enforcestatus} alt="filer-icon" width="20" height="20"
                                                            className="ActionIconColor img-normalize"
                                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(enforceStatusID) === -1}
                                                            onClick={() => this.props.fetchRecord({ ...this.props.editParam, primaryKeyValue: row["dataItem"][this.props.editParam.primaryKeyField], editRow: row["dataItem"] })}
                                                        /> */}
                                                         <Enforcestatus className="custom_icons" width="16" height="16" />
                                                    </FontIconWrap>
                                                    <FontIconWrap className="d-font-icon action-icons-wrap"
                                                          data-place="left" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ENFORCERESULT" })}
                                                          hidden={this.props.userRoleControlRights &&
                                                              this.props.userRoleControlRights.indexOf(this.props.controlMap.has("EnforceResult")
                                                              && this.props.controlMap.get("EnforceResult").ncontrolcode) === -1}
                                                          onClick={() => this.props.enforceResult({...row["dataItem"],ncontrolcode:this.props.controlMap.get("EnforceResult").ncontrolcode
                                                        &&this.props.controlMap.get("EnforceResult").ncontrolcode})
                                                           }
                                                         >
                                                       <FontAwesomeIcon icon={faArchive} />
                                                    </FontIconWrap> 
                                                    {row["dataItem"] && row["dataItem"].nispredefinedformula===transactionStatus.YES &&
                                                        <FontIconWrap className="d-font-icon action-icons-wrap"
                                                            data-place="left" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EBCFORMULACALCULATION" })}
                                                            hidden={this.props.userRoleControlRights &&
                                                                this.props.userRoleControlRights.indexOf(this.props.controlMap.has("EBCFormulaCalculation")
                                                                    && this.props.controlMap.get("EBCFormulaCalculation").ncontrolcode) === -1}
                                                            onClick={() => this.props.formulaCalculation({
                                                                ...row["dataItem"], ncontrolcode: this.props.controlMap.get("EBCFormulaCalculation").ncontrolcode
                                                                    && this.props.controlMap.get("EBCFormulaCalculation").ncontrolcode
                                                            })
                                                            }
                                                        >
                                                            <EBCCalculation className="custom_icons" width="16" height="16" />
                                                        </FontIconWrap>
                                                    }

                                                    {/* uncomment below lines for mean calculation */}
                                                    {/* {row["dataItem"].nparametertypecode === 1 ?
                                                        <FontIconWrap className="d-font-icon" title={this.props.intl.formatMessage({ id: "IDS_CALCULATEMEAN" })}>
                                                            <FontAwesomeIcon icon={faCalculator}
                                                                title={this.props.intl.formatMessage({ id: "IDS_CALCULATEMEAN" })}
                                                                //hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(editId) === -1}
                                                                onClick={() => this.props.getMeanTestParameter({...this.props.meanParam, selectedRecord: row["dataItem"] })} 
                                                            />
                                                        </FontIconWrap> :""} */}
                                                </Nav.Link>

                                            </>
                                        </td>
                                )}
                            />

                            : ""}

                    </Grid>
                    {/* </Tooltip> */}
                    </LocalizationProvider >
                </AtTableWrap>
            </>
        )
    }
}
export default connect(mapStateToProps, undefined)(injectIntl(ResultGrid));