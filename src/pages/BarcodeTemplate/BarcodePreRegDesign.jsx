
import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import device from 'current-device';
import Dynamicinput from '../../components/droparea/Dynamicinputs';
import { connect } from 'react-redux';
import {
    updateStore, crudMaster, getTableColumns,
    getForeignTableData, getDynamicFilter, getDynamicFilterExecuteData,
} from '../../actions/index'
import { condition } from '../../components/Enumeration';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { validateCreateView } from '../../components/CommonScript';
import { getChildComponentForeignKey, getcomponentdata, getValidComponent, replaceChildFromChildren } from '../../components/droparea/helpers';
import { ReactComponents } from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { toast } from 'react-toastify';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class BarcodePreRegDesign extends React.Component {
    constructor(props) {
        super(props);
        this.confirmMessage = new ConfirmMessage();

        this.state = {
            nflag: 1,
            design: this.props.Login.design,
            selectedRecord: this.props.Login.selectedRecord || {},
            selectedFieldRecord: {},
            selectedComponentpath: "",
            components: [],
            filterColumns: [],
            validComponents: [],
            showConfirmAlert: false,
            showsynonym: false,
            toBeDeleted: {},
            numericConditions: [
                { label: this.props.intl.formatMessage({ id: "IDS_EQUALS", defaultMessage: "equal to(=)" }), value: condition.EQUALS },
                { label: this.props.intl.formatMessage({ id: "IDS_NOTEQUALS", defaultMessage: "not equal to(!=)" }), value: condition.NOTEQUALS },
                { label: this.props.intl.formatMessage({ id: "IDS_IN", defaultMessage: "In" }), value: condition.CONTAINS },
                { label: this.props.intl.formatMessage({ id: "IDS_NOTIN", defaultMessage: "Not In" }), value: condition.NOTCONTAINS }
            ],
            stringConditions: [
                { label: this.props.intl.formatMessage({ id: "IDS_EQUALS", defaultMessage: "equal to(=)" }), value: condition.EQUALS },
                { label: this.props.intl.formatMessage({ id: "IDS_NOTEQUALS", defaultMessage: "not equal to(!=)" }), value: condition.NOTEQUALS },
                { label: this.props.intl.formatMessage({ id: "IDS_STARTSWITH", defaultMessage: "Starts With" }), value: condition.STARTSWITH },
                { label: this.props.intl.formatMessage({ id: "IDS_ENDSWITH", defaultMessage: "Ends With" }), value: condition.ENDSWITH },
                { label: this.props.intl.formatMessage({ id: "IDS_CONTAINS", defaultMessage: "Contains" }), value: condition.INCLUDES }
            ],
            dateConditions: [
                { label: this.props.intl.formatMessage({ id: "IDS_LESSTHAN", defaultMessage: "Less Than (<)" }), value: condition.LESSTHAN },
                { label: this.props.intl.formatMessage({ id: "IDS_LESSTHANOREQUALS", defaultMessage: "Less Than Or Equals(<=)" }), value: condition.LESSTHANOREQUALS },
                { label: this.props.intl.formatMessage({ id: "IDS_GREATERTHAN", defaultMessage: "Greater Than(>)" }), value: condition.GREATERTHAN },
                { label: this.props.intl.formatMessage({ id: "IDS_GREATERTHANOREQUALS", defaultMessage: "Greater Than Or Equals(>=)" }), value: condition.GREATERTHANEQUALS }
            ]


        }
    }

    validateDynamicDesign = () => {
        let valid = this.validateTemplate(this.state.design);
        if (!valid) {
            return null;
        }
        else {
            const data = []
            this.state.design.map(row => {
                row.children.map(column => {
                    column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    data.push(componentrow);
                                }
                            })
                        } else {
                            if (component.inputtype === "combo") {
                                data.push(component);
                            }
                        }
                    })
                })
            })

            if (this.props.selectedRecord && this.props.selectedRecord.ncontrolcode && this.props.selectedRecord.ncontrolcode.item) {
                const data1 = this.getMappingCheck(this.props.selectedRecord.ncontrolcode.item, this.props.Login.columnInfo, data[data.length - 1]);

                if (data1) {
                    let inputData = [];
                    inputData["userinfo"] = this.props.Login.userInfo;
                    if (this.props.Login.operation === "update") {
                        inputData["registrationtemplate"] = {
                            jsonString: JSON.stringify(this.state.design),
                            jsondata: this.state.design,
                            valuemember: data[data.length - 1].valuemember
                        }
                    }
                    else {
                        //add               
                        inputData["registrationtemplate"] =
                        {
                            jsonString: JSON.stringify(this.state.design),
                            jsondata: this.state.design,
                            valuemember: data[data.length - 1].valuemember
                        };
                    }

                    this.props.saveScreenFilter(inputData, "openPortal");
                } else {
                    toast.warn("last level is does not relationship with selected screen")
                }

            } else {
                toast.warn("Select Control")
            }
        }
    }

    render() {
        return (
            <>
                <Modal
                    centered
                    scrollable
                    bsPrefix="model model_zindex"
                    show={this.props.Login.openPortal}
                    onHide={this.props.closeModal}
                    dialogClassName={`${this.state.nflag && this.state.nflag === 2 ? 'alert-popup' : ''} modal-fullscreen`}
                    backdrop="static"
                    keyboard={false}
                    enforceFocus={false}
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header className="d-flex align-items-center">
                        <Modal.Title id="add" className="header-primary flex-grow-1">
                            {`${this.props.Login.operation === "update"
                                ? this.props.intl.formatMessage({ id: "IDS_EDIT" })
                                : this.props.Login.operation === "viewdesign"
                                    ? this.props.intl.formatMessage({ id: "IDS_VIEW" })
                                    : this.props.intl.formatMessage({ id: "IDS_ADD" })} ${this.props.intl.formatMessage({ id: "IDS_BARCODEFILTERDESIGN" })}`
                            }
                        </Modal.Title>
                        <>
                            <Button className="btn-user btn-cancel" variant="" onClick={this.props.closeModal}>
                                <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                            </Button>
                            {this.props.Login.operation !== "viewdesign" ?
                                <Button className=" btn-user btn-primary-blue"
                                    //onClick={() => this.setState({ openAlertModal: true, templateName: "" })}
                                    onClick={this.validateDynamicDesign}
                                >
                                    <FontAwesomeIcon icon={faSave} /> { }
                                    <FormattedMessage id={"IDS_SAVE"} defaultMessage={"Save"} />
                                </Button> : ""}
                        </>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-inner-content">
                            <Row>
                                <Col md={12} className='p-0'>
                                    <DndProvider backend={device.os !== 'android' ? HTML5Backend : TouchBackend} options={{ enableMouseEvents: true }} >
                                        <Dynamicinput
                                            layout={this.state.design}
                                            reactInputFields={this.props.Login.ReactInputFields || {}}
                                            setLayout={this.setLayout}
                                            reactComponents={this.props.Login.ReactComponents || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onNumericInputChange={this.onNumericInputChange}
                                            onComboChange={this.onComboChange}
                                            selectedFieldRecord={this.state.selectedFieldRecord}
                                            onclickcomponent={(event, data, path) => this.onclickcomponent(event, data, path)}
                                            ReactTables={this.props.Login.ReactTables}
                                            tableColumn={this.state.tableColumn}
                                            filterColumns={this.state.filterColumns}
                                            numericConditions={this.state.numericConditions}
                                            stringConditions={this.state.stringConditions}
                                            filterData={this.props.Login.filterData}
                                            inputFields={this.state.validComponents || []}
                                            addChildMapping={this.addChildMapping}
                                            valueMembers={this.getValueMembers(this.state.selectedFieldRecord)}
                                            validateDelete={this.validateDelete}
                                            showFilter={this.state.showFilter}
                                            showPropFilter={this.showPropFilter}
                                            hidePropFilter={this.hidePropFilter}
                                            addCondition={this.addCondition}
                                            deleteCondition={this.deleteCondition}
                                            addDateConstraints={this.addDateConstraints}
                                            deleteDateCondition={this.deleteDateCondition}
                                            showsynonym={this.state.showsynonym}
                                            languages={this.props.Login.languageList || []}
                                            addSynonym={() => this.setState({ showsynonym: !(this.state.showsynonym) })}
                                            userinfo={this.props.Login.userInfo}
                                            staticfiltertables={this.props.Login.staticfiltertables}
                                            staticfiltercolumn={this.state.staticfiltercolumn || []}
                                            handlePageChange={this.handlePageChange}
                                            userInfo={this.props.Login.userInfo}
                                            BarcodeConfig={true}
                                            selectedRecord={this.props.selectedRecord}
                                        />
                                    </DndProvider>
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                </Modal>

            </>
        );
    }
    componentDidUpdate(previousProps) {
        let updateState = false;
        let { openAlertModal, design, selectedRecord, selectedFieldRecord,
            selectedComponentpath, components, validComponents, tableColumn, filterColumns,
            showConfirmAlert, parentRadioValue, showFilter } = this.state

        if (this.props.Login.openPortal === false && previousProps.Login.openPortal) {
            updateState = true;
            openAlertModal = false;
        }
        if (this.props.Login.design !== previousProps.Login.design) {
            updateState = true;
            design = this.props.Login.design;
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            updateState = true;
        }
        if (this.props.Login.selectedFieldRecord !== previousProps.Login.selectedFieldRecord) {
            selectedFieldRecord = this.props.Login.selectedFieldRecord;
            updateState = true;
        }
        if (this.props.Login.showFilter !== previousProps.Login.showFilter) {
            showFilter = this.props.Login.showFilter
            updateState = true;
        }
        if (this.props.Login.selectedFieldRecord !== previousProps.Login.selectedFieldRecord) {
            if (this.props.Login.selectedComponentpath && this.props.Login.selectedComponentpath !== previousProps.Login.selectedFieldRecord) {
                selectedComponentpath = this.props.Login.selectedComponentpath
            }

            selectedFieldRecord = this.props.Login.selectedFieldRecord
            components = this.props.Login.components
            validComponents = this.props.Login.validComponents
            tableColumn = this.props.Login.tableColumn
            filterColumns = this.props.Login.filterColumns
            updateState = true;

        }
        if (this.props.Login.parentRadioValue !== previousProps.Login.parentRadioValue) {
            parentRadioValue = this.props.Login.parentRadioValue
            updateState = true;
        }
        if (updateState) {
            this.setState({
                openAlertModal, design, selectedRecord, selectedFieldRecord,
                tableColumn, selectedComponentpath, components, validComponents,
                showConfirmAlert, filterColumns, parentRadioValue, showFilter
            })
        }
    }


    showPropFilter = () => {
        const selectedFieldRecord = this.state.selectedFieldRecord
        if (selectedFieldRecord.inputtype === 'backendsearchfilter') {
            if (selectedFieldRecord.label !== ''
                && selectedFieldRecord.table && selectedFieldRecord.filterfields) {
                const inputparam = {
                    component: selectedFieldRecord
                    , userinfo: this.props.Login.userInfo,
                    type: 'design',
                    selectedComponentpath: this.state.selectedComponentpath
                }
                this.props.getDynamicFilter(inputparam)
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTMANDATORYFIELDS" }))
            }

        } else if (selectedFieldRecord.inputtype === 'frontendsearchfilter') {
            if (selectedFieldRecord.label !== ''
                && selectedFieldRecord.table && selectedFieldRecord.filterfields) {
                const inputparam = {
                    component: selectedFieldRecord
                    , userinfo: this.props.Login.userInfo,
                    type: 'design',
                    selectedComponentpath: this.state.selectedComponentpath
                }
                this.props.getDynamicFilter(inputparam)
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTMANDATORYFIELDS" }))
            }
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    showFilter: !this.state.showFilter
                }
            }
            this.props.updateStore(updateInfo);
            //  this.setState({ showFilter: !this.state.showFilter })
        }

    }
    hidePropFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                showFilter: false
            }
        }
        this.props.updateStore(updateInfo);
        //  this.setState({ showFilter: !this.state.showFilter })
    }
    setLayout = (design, splitDropZonePath, remove, removeChild) => {
        let selectedFieldRecord = {}
        if (remove === undefined) {
            selectedFieldRecord = getcomponentdata(design, splitDropZonePath.split("-"))
        }
        else if (removeChild) {
            let childRecord = {}
            this.state.toBeDeleted.deleteComponent.child.map(myChild => {
                childRecord = getcomponentdata(design, myChild.childPath.split("-"))
                childRecord['childValue'] = undefined;
                childRecord['parentPath'] = undefined;
                childRecord['valuecolumn'] = undefined;

                design = replaceChildFromChildren(design, myChild.childPath.split("-"), childRecord)
                return null;
            })
        }
        design = this.updatePath(design)
        const components = this.getComponents(design).components;
        let validComponents = getValidComponent(selectedFieldRecord, components, this.props.Login.columnInfo)
        this.setState({ showConfirmAlert: false, toBeDeleted: {}, design, selectedFieldRecord: selectedFieldRecord, components, validComponents, selectedComponentpath: splitDropZonePath.split("-").length > 1 ? splitDropZonePath : '0-0-' + splitDropZonePath })
    }
    updatePath = (design) => {
        design.map((row, rowIndex) =>
            row.children.map((column, columnIndex) =>
                column.children.map((componnetrow, compRowIndex) => {
                    if (componnetrow.hasOwnProperty('children')) {
                        componnetrow.children.map((component, compIndex) => {
                            if (component.inputtype !== 'radio') {
                                if (component.child) {
                                    let newChild = [];
                                    component.child.map(childComp => {
                                        const obj = this.getIndexByLabel(design, childComp.label);
                                        newChild.push({ ...childComp, childPath: obj.path });
                                        const newObj = { ...obj.object, parentPath: `${rowIndex}-${columnIndex}-${compRowIndex}-${compIndex}` };
                                        design = replaceChildFromChildren(design, obj.path.split("-"), newObj);
                                    })
                                    component = { ...component, child: newChild }
                                    design = replaceChildFromChildren(design, [rowIndex, columnIndex, compRowIndex, compIndex], component);
                                }
                            } else {
                                if (component.child) {
                                    let newChild = [];
                                    component.child.map(childComp => {
                                        const obj = this.getIndexByLabel(design, childComp.label);
                                        newChild.push({ ...childComp, childPath: obj.path });
                                        const newObj = { ...obj.object, radioparentPath: `${rowIndex}-${columnIndex}-${compRowIndex}-${compIndex}` };
                                        design = replaceChildFromChildren(design, obj.path.split("-"), newObj);
                                    })
                                    component = { ...component, child: newChild }
                                    design = replaceChildFromChildren(design, [rowIndex, columnIndex, compRowIndex, compIndex], component);
                                }
                            }

                        })
                    } else {
                        if (componnetrow.inputtype !== 'radio') {
                            if (componnetrow.child) {
                                let newChild = [];
                                componnetrow.child.map(childComp => {
                                    const obj = this.getIndexByLabel(design, childComp.label);
                                    newChild.push({ ...childComp, childPath: obj.path });
                                    const newObj = { ...obj.object, parentPath: `${rowIndex}-${columnIndex}-${compRowIndex}-0` };
                                    design = replaceChildFromChildren(design, obj.path.split("-"), newObj);
                                })
                                componnetrow = { ...componnetrow, child: newChild }
                                design = replaceChildFromChildren(design, [rowIndex, columnIndex, compRowIndex, 0], componnetrow);
                            }
                        } else {
                            if (componnetrow.child) {
                                let newChild = [];
                                componnetrow.child.map(childComp => {
                                    const obj = this.getIndexByLabel(design, childComp.label);
                                    newChild.push({ ...childComp, childPath: obj.path });
                                    const newObj = { ...obj.object, radioparentPath: `${rowIndex}-${columnIndex}-${compRowIndex}-0` };
                                    design = replaceChildFromChildren(design, obj.path.split("-"), newObj);
                                })
                                componnetrow = { ...componnetrow, child: newChild }
                                design = replaceChildFromChildren(design, [rowIndex, columnIndex, compRowIndex, 0], componnetrow);
                            }
                        }
                    }
                })
            )
        )
        return design;
    }
    getIndexByLabel(design, label) {
        let obj = {};
        design.map((row, rowIndex) =>
            row.children.map((column, columnIndex) =>
                column.children.map((componnetrow, compRowIndex) => {
                    if (componnetrow.hasOwnProperty('children')) {
                        componnetrow.children.map((component, compIndex) => {
                            if (component.label === label) {
                                obj = {
                                    object: component,
                                    path: `${rowIndex}-${columnIndex}-${compRowIndex}-${compIndex}`
                                }
                                // break;
                            }

                            return null;
                        })
                    } else {
                        if (componnetrow.label === label) {
                            obj = {
                                object: componnetrow,
                                path: `${rowIndex}-${columnIndex}-${compRowIndex}-0`
                            }
                            // return obj;
                            // break;
                        }
                    }
                    return null;
                })
            )
        )
        return obj;
    }
    validateDelete = (design, splitDropZonePath) => {
        const path = splitDropZonePath.split("-")
        let showAlert = false;
        let toBeDeleted = {};
        let component = getcomponentdata(this.state.design, path)
        if (component.child && component.child.length > 0) {

            let childRecord = {}
            if (component.inputtype === 'radio') {
                component.child.map(myChild => {
                    childRecord = getcomponentdata(design, myChild.childPath.split("-"))
                    delete childRecord["radioparentLabel"]
                    delete childRecord["selectedrecordbasedhide"]
                    delete childRecord["recordbasedhide"]
                    delete childRecord["radioparent"]
                    delete childRecord["radioparentPath"]
                    delete childRecord["recordbasedshowhide"]
                    delete childRecord["recordbasedreadonly"]


                    design = replaceChildFromChildren(design, myChild.childPath.split("-"), childRecord)
                    return null;
                })
            } else {
                component.child.map(myChild => {
                    childRecord = getcomponentdata(design, myChild.childPath.split("-"))
                    childRecord['childValue'] = undefined;
                    childRecord['parentPath'] = undefined;
                    childRecord['valuecolumn'] = undefined;
                    if (myChild.componentcode !== ReactComponents.COMBO) {
                        childRecord['column'] = undefined;
                    }
                    design = replaceChildFromChildren(design, myChild.childPath.split("-"), childRecord)
                    return null;
                })
            }

            showAlert = true;
            toBeDeleted = { design, splitDropZonePath, deleteComponent: component }
        }
        if (component.childValue) {
            let parentData = getcomponentdata(this.state.design, component.parentPath.split("-"));
            let newChildData = parentData.child.filter(child => child.label !== component.label)
            parentData = { ...parentData, child: newChildData };
            design = replaceChildFromChildren(design, component.parentPath.split("-"), parentData)
            toBeDeleted = { design, splitDropZonePath, deleteComponent: component }

        }

        if (component.radioparent) {
            let parentData = getcomponentdata(this.state.design, component.radioparentPath.split("-"));
            let newChildData = parentData.child.filter(child => child.label !== component.label)
            parentData = { ...parentData, child: newChildData };
            design = replaceChildFromChildren(design, component.radioparentPath.split("-"), parentData)
            toBeDeleted = { design, splitDropZonePath, deleteComponent: component }

        }
        if (showAlert) {
            this.showAlert(true, toBeDeleted);
        }
        else {
            this.setLayout(design, splitDropZonePath, true)
        }
    }
    confirmAlert = () => {
        this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_WARNING" }),
            this.props.intl.formatMessage({ id: "IDS_WARNING" }),
            this.props.intl.formatMessage({ id: "IDS_PARENTCOMPONENTCANNOTBEDELETED" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.setLayout(this.state.toBeDeleted.design, this.state.toBeDeleted.splitDropZonePath, true, true),
            undefined,
            () => this.showAlert(false));
    }
    showAlert = (bool, toBeDeleted) => {

        this.setState({ showConfirmAlert: bool, toBeDeleted })
    }
    onclickcomponent = (event, data, path) => {
        const selectedFieldRecord = { ...data }
        const obj = this.getComponents(this.state.design);
        //console.log("obj:", obj);
        const components = obj.components;

        let dateComponents = obj.dateComponents;
        if (data.inputtype === "date") {
            const filterDataComponents = dateComponents.filter(item => item.label !== data.label);
            dateComponents = filterDataComponents;
        }

        let componentData = { components, selectedComponentpath: path }
        let parentRadioValue = []

        if ((selectedFieldRecord.componentcode === ReactComponents.COMBO ||
            selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER ||
            selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER) &&
            selectedFieldRecord.source !== undefined &&
            (this.props.Login.columnInfo === undefined ||
                this.props.Login.columnInfo[selectedFieldRecord.nquerybuildertablecode] === undefined)) {
            this.props.getTableColumns(this.state.design, selectedFieldRecord,
                selectedFieldRecord.nquerybuildertablecode, this.props.Login.userInfo,
                "", this.props.Login.columnInfo, componentData, undefined, false)
        } else {
            const validComponents = getValidComponent(selectedFieldRecord, components, this.props.Login.columnInfo)
            let tableColumn = selectedFieldRecord.nquerybuildertablecode ? this.props.Login.columnInfo[selectedFieldRecord.nquerybuildertablecode].tableColumn : [];
            let filterColumns = selectedFieldRecord.nquerybuildertablecode ? this.props.Login.columnInfo[selectedFieldRecord.nquerybuildertablecode].filterColumns : [];
            if (selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER ||
                selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER) {
                if (selectedFieldRecord.radioparentPath) {
                    let oldParentData = getcomponentdata(this.state.design, selectedFieldRecord.radioparentPath.split("-"))
                    if (oldParentData.hasOwnProperty('child')) {
                        oldParentData.child.map(item => {
                            if (item.label === selectedFieldRecord.label) {
                                parentRadioValue = oldParentData.radioOptions.tags.map(item => {
                                    return { value: item.id, label: item.text, item }
                                })
                            }
                        })
                    }
                }
            } else {
                if (selectedFieldRecord.radioparentPath) {
                    if (selectedFieldRecord.radioparentPath) {
                        let oldParentData = getcomponentdata(this.state.design, selectedFieldRecord.radioparentPath.split("-"))
                        if (oldParentData.hasOwnProperty('child')) {
                            oldParentData.child.map(item => {
                                if (item.label === selectedFieldRecord.label) {
                                    parentRadioValue = oldParentData.radioOptions.tags.map(item => {
                                        return { value: item.id, label: item.text, item }
                                    })
                                }
                            })
                        }
                    }
                }
            }
            if (selectedFieldRecord.componentcode !== ReactComponents.COMBO &&
                selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER) {
                if (this.props.Login.columnInfo && selectedFieldRecord.childValue
                    && this.props.Login.columnInfo[selectedFieldRecord.childValue.nquerybuildertablecode]) {
                    tableColumn = this.props.Login.columnInfo[selectedFieldRecord.childValue.nquerybuildertablecode].tableColumn;
                    filterColumns = this.props.Login.columnInfo[selectedFieldRecord.childValue.nquerybuildertablecode].filterColumns;
                    this.setState({
                        selectedComponentpath: path,
                        selectedFieldRecord: selectedFieldRecord,
                        components,
                        tableColumn,
                        filterColumns,
                        validComponents,
                        parentRadioValue,
                        showFilter: false


                    })
                } else {
                    if (selectedFieldRecord.childValue) {
                        this.props.getTableColumns(this.state.design, selectedFieldRecord,
                            selectedFieldRecord.childValue.nquerybuildertablecode, this.props.Login.userInfo,
                            "", this.props.Login.columnInfo, componentData, undefined, false);
                    } else {
                        this.setState({
                            selectedComponentpath: path,
                            selectedFieldRecord: selectedFieldRecord,
                            components,
                            tableColumn,
                            filterColumns,
                            dateComponents,
                            validComponents,
                            parentRadioValue,
                            showFilter: false
                        })
                    }
                }
            } else {
                this.setState({
                    selectedComponentpath: path,
                    selectedFieldRecord: selectedFieldRecord,
                    components,
                    tableColumn,
                    filterColumns,
                    dateComponents,
                    validComponents,
                    parentRadioValue,
                    showFilter: false
                })
            }

        }

    }
    getComponents = (design) => {
        let components = [];
        let dateComponents = [{ label: "Current Date", value: "utccurrentdate" }];
        design.map((row, rowIndex) => {
            row.children.map((column, columnIndex) => {
                column.children.map((componnet, compindex) => {
                    if (componnet.hasOwnProperty("children")) {
                        componnet.children.map((componnetrow, compRowIndex) => {
                            componnetrow.inputtype === 'date' && componnetrow.label && dateComponents.push({ label: componnetrow.label, value: componnetrow.label })
                            componnetrow.label && components.push({
                                label: componnetrow.label,
                                value: componnetrow.label,
                                nformcode: componnetrow.nformcode,
                                // item: componnetrow,
                                inputtype: componnetrow.inputtype,
                                source: componnetrow.source,
                                nquerybuildertablecode: componnetrow.nquerybuildertablecode,
                                child: componnetrow.child,
                                valuemember: componnetrow.valuemember,
                                path: `${rowIndex}-${columnIndex}-${compindex}-${compRowIndex}`
                            })
                        })
                    } else {
                        componnet.inputtype === 'date' && componnet.label && dateComponents.push({ label: componnet.label, value: componnet.label })
                        componnet.label && components.push({
                            label: componnet.label,
                            value: componnet.label,
                            nformcode: componnet.nformcode,
                            // item: componnet,
                            inputtype: componnet.inputtype,
                            source: componnet.source,
                            nquerybuildertablecode: componnet.nquerybuildertablecode,
                            child: componnet.child,
                            valuemember: componnet.valuemember,
                            path: `${rowIndex}-${columnIndex}-${compindex}-0`
                        })
                    }
                })
                return null;
            })
            return null;
        })
        return { components, dateComponents };
    }
    getValueMembers = (selectedFieldRecord) => {
        if (selectedFieldRecord.childValue) {
            let valueColumn = [];
            this.props.Login.columnInfo &&
                this.props.Login.columnInfo[selectedFieldRecord.nquerybuildertablecode] &&
                this.props.Login.columnInfo[selectedFieldRecord.nquerybuildertablecode].numericColumns.map(x => {
                    if (x.foriegntablename === selectedFieldRecord.childValue.source)
                        valueColumn.push(
                            {
                                label: x.displayname[this.props.Login.userInfo.slanguagetypecode],
                                value: x.tablecolumnname,
                                item: { foriegntablePK: x.foriegntablePK }
                            }
                        )
                    return null;
                })
            if (valueColumn.length) {

                return valueColumn;

            } else {
                this.props.Login.columnInfo &&
                    this.props.Login.columnInfo[selectedFieldRecord.childValue.nquerybuildertablecode] &&
                    this.props.Login.columnInfo[selectedFieldRecord.childValue.nquerybuildertablecode].numericColumns.map(x => {
                        if (x.foriegntablename === selectedFieldRecord.source)
                            valueColumn.push(
                                {
                                    label: x.displayname[this.props.Login.userInfo.slanguagetypecode],
                                    value: x.tablecolumnname,
                                    item: { foriegntablePK: x.foriegntablePK }
                                }
                            )
                        return null;
                    })
                return valueColumn;
            }
        } else {
            return null;
        }
    }
    onInputOnChange = (event, name) => {
        const selectedFieldRecord = this.state.selectedFieldRecord || {};
        const selectedRecord = this.state.selectedRecord || {};
        let chillabelUpdate = false;
        let newLabel = ""
        let oldLabel = ""
        if (event.target.type === 'checkbox') {
            if (name === "recordbasedreadonly" || name === "recordbasedshowhide") {
                let design = this.state.design
                const splititemarray = this.state.selectedComponentpath.split("-")
                if (selectedFieldRecord["recordbasedshowhide"] || selectedFieldRecord["recordbasedreadonly"]) {
                    // let design = this.state.design
                    if (selectedFieldRecord.radioparentPath) {
                        let oldParentData = getcomponentdata(this.state.design, selectedFieldRecord.radioparentPath.split("-"));
                        if (oldParentData.child) {
                            let newChildData1 = oldParentData.child.filter(child => child.label !== selectedFieldRecord.label);
                            oldParentData = { ...oldParentData, child: newChildData1 };
                            design = replaceChildFromChildren(this.state.design, selectedFieldRecord.radioparentPath.split("-"), oldParentData)
                        }
                        delete selectedFieldRecord["radioparentLabel"]
                        delete selectedFieldRecord["selectedrecordbasedhide"]
                        delete selectedFieldRecord["recordbasedhide"]
                        delete selectedFieldRecord["radioparent"]
                    }
                    selectedFieldRecord[name === "recordbasedreadonly" ? "recordbasedshowhide" : "recordbasedreadonly"] = false;
                }
                selectedFieldRecord[event.target.name] = event.target.checked;
                const newdata = { ...selectedFieldRecord }
                design = replaceChildFromChildren(design, splititemarray, newdata)
                this.setState({ design, selectedFieldRecord })
            } else if (event.target.name === "loadselecteddate" || event.target.name === "loadcurrentdate") {

                if (event.target.name === "loadselecteddate" && selectedFieldRecord['loadcurrentdate']) {
                    selectedFieldRecord['loadcurrentdate'] = false
                } else if (event.target.name === "loadcurrentdate" && selectedFieldRecord['loadselecteddate']) {
                    selectedFieldRecord['loadselecteddate'] = false
                }
                selectedFieldRecord[event.target.name] = event.target.checked;
                this.saveComponentProperties(selectedFieldRecord)
            } else if (event.target.name === "unique") {
                selectedFieldRecord[event.target.name] = event.target.checked;
                this.saveComponentProperties(selectedFieldRecord)
            }
            else if (event.target.name === 'isAddMaster' || event.target.name === 'isView' || event.target.name === 'isEditMaster') {
                selectedFieldRecord[event.target.name] = event.target.checked;
                this.saveComponentProperties(selectedFieldRecord)
            }
            else if (event.target.name === 'autoFocus') {

                if (event.target.checked === true) {
                    const val = this.checkAutoFocus();
                    if (val === '') {
                        selectedFieldRecord[event.target.name] = event.target.checked;
                        this.saveComponentProperties(selectedFieldRecord)
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYFOCUSAPPLIEDON" }) + ' ' + val)
                    }
                } else {
                    selectedFieldRecord[event.target.name] = event.target.checked;
                    this.saveComponentProperties(selectedFieldRecord)
                }
            } else if (event.target.name === 'isalphabetcaptial') {
                selectedFieldRecord['isalphabetcaptial'] = event.target.checked ? true : false
                selectedFieldRecord['isalphabetsmall'] = false
                selectedFieldRecord['isalphabetspl'] = false
                selectedFieldRecord['isalphanumeric'] = false
                selectedFieldRecord['isnumeric'] = false
                selectedFieldRecord['isnumericspl'] = false
                selectedFieldRecord['ncustomization'] = false;
                this.saveComponentProperties(selectedFieldRecord)
            } else if (event.target.name === 'isnumeric') {
                selectedFieldRecord['isnumeric'] = event.target.checked ? true : false
                selectedFieldRecord['isalphabetspl'] = false
                selectedFieldRecord['isalphanumeric'] = false
                selectedFieldRecord['isalphabetcaptial'] = false
                selectedFieldRecord['isalphabetsmall'] = false
                selectedFieldRecord['isnumericspl'] = false
                selectedFieldRecord['ncustomization'] = false;
                this.saveComponentProperties(selectedFieldRecord)
            } else if (event.target.name === 'isalphanumeric') {
                selectedFieldRecord['isalphanumeric'] = event.target.checked ? true : false
                selectedFieldRecord['isalphabetsmall'] = false
                selectedFieldRecord['isalphabetspl'] = false
                selectedFieldRecord['isalphabetcaptial'] = false
                selectedFieldRecord['isnumeric'] = false
                selectedFieldRecord['isnumericspl'] = false
                delete (selectedFieldRecord['ncasesensitive']);
                delete (selectedFieldRecord['ncaptialletters']);
                delete (selectedFieldRecord['nsmallletters']);
                delete (selectedFieldRecord['nmaxletters']);
                delete (selectedFieldRecord['nmaxnumeric']);
                selectedFieldRecord['ncustomization'] = false;
                this.saveComponentProperties(selectedFieldRecord)
            }
            else if (event.target.name === 'isnumericspl') {
                selectedFieldRecord['isnumericspl'] = event.target.checked ? true : false
                selectedFieldRecord['isalphabetsmall'] = false
                selectedFieldRecord['isalphabetspl'] = false
                selectedFieldRecord['isalphanumeric'] = false
                selectedFieldRecord['isnumeric'] = false
                selectedFieldRecord['isalphabetcaptial'] = false
                selectedFieldRecord['ncustomization'] = false;
                delete (selectedFieldRecord['nmaxnumeric']);
                delete (selectedFieldRecord['nsplchar']);
                delete (selectedFieldRecord['naviodsplchar']);
                delete (selectedFieldRecord['nsplchar']);
                delete (selectedFieldRecord['nsplcharnotallow']);
                delete (selectedFieldRecord['ncasesensitive']);
                this.saveComponentProperties(selectedFieldRecord)
            }
            else if (event.target.name === 'isalphabetsmall') {
                selectedFieldRecord['isalphabetsmall'] = event.target.checked ? true : false
                selectedFieldRecord['isalphanumeric'] = false
                selectedFieldRecord['isalphabetspl'] = false
                selectedFieldRecord['isalphabetcaptial'] = false
                selectedFieldRecord['isnumeric'] = false
                selectedFieldRecord['isnumericspl'] = false
                selectedFieldRecord['ncustomization'] = false;
                this.saveComponentProperties(selectedFieldRecord)
            }
            else if (event.target.name === 'isalphabetspl') {
                selectedFieldRecord['isalphabetspl'] = event.target.checked ? true : false
                selectedFieldRecord['isalphabetsmall'] = false
                selectedFieldRecord['isalphanumeric'] = false
                selectedFieldRecord['isalphabetcaptial'] = false
                selectedFieldRecord['isnumeric'] = false
                selectedFieldRecord['isnumericspl'] = false
                delete (selectedFieldRecord['ncasesensitive']);
                delete (selectedFieldRecord['ncaptialletters']);
                delete (selectedFieldRecord['nsmallletters']);
                delete (selectedFieldRecord['nmaxletters']);
                delete (selectedFieldRecord['nmaxnumeric']);
                delete (selectedFieldRecord['naviodsplchar']);
                delete (selectedFieldRecord['nsplchar']);
                delete (selectedFieldRecord['nsplcharnotallow']);
                selectedFieldRecord['ncustomization'] = false;
                this.saveComponentProperties(selectedFieldRecord)
            } else if (event.target.name === 'ncustomization' && event.target.checked === false) {
                selectedFieldRecord['ncustomization'] = event.target.checked ? true : false
                delete (selectedFieldRecord['nmaxletters']);
                delete (selectedFieldRecord['nmaxnumeric']);
                delete (selectedFieldRecord['nsplchar']);
                this.saveComponentProperties(selectedFieldRecord)
            }
            else if (event.target.name === 'naviodsplchar' && event.target.checked === false) {
                selectedFieldRecord['naviodsplchar'] = event.target.checked ? true : false
                delete (selectedFieldRecord['nsplcharnotallow']);
                this.saveComponentProperties(selectedFieldRecord)
            } else if (event.target.name === 'ncasesensitive') {
                selectedFieldRecord['ncasesensitive'] = event.target.checked ? true : false
                delete (selectedFieldRecord['nsmallletters']);
                delete (selectedFieldRecord['ncaptialletters']);
                delete (selectedFieldRecord['nmaxcapticalletters']);
                delete (selectedFieldRecord['nmaxsmallletters']);
                this.saveComponentProperties(selectedFieldRecord)
            } else if (event.target.name === 'ncaptialletters') {
                selectedFieldRecord['ncaptialletters'] = event.target.checked ? true : false
                delete (selectedFieldRecord['nsmallletters']);
                delete (selectedFieldRecord['ncasesensitive']);
                this.saveComponentProperties(selectedFieldRecord)
            } else if (event.target.name === 'nsmallletters') {
                selectedFieldRecord['nsmallletters'] = event.target.checked ? true : false
                delete (selectedFieldRecord['ncasesensitive']);
                delete (selectedFieldRecord['ncaptialletters']);
                this.saveComponentProperties(selectedFieldRecord)
            }
            else {
                if (event.target.name === 'timeonly') {
                    selectedFieldRecord['dateonly'] = false;
                }
                if (event.target.name === 'dateonly') {
                    selectedFieldRecord['timeonly'] = false;
                }
                if (event.target.name === 'mandatory') {
                    if (event.target.checked === false) {
                        if (selectedFieldRecord['unique']) {
                            selectedFieldRecord['unique'] = false;
                        }
                    }
                }
                selectedFieldRecord[event.target.name] = event.target.checked;
                this.saveComponentProperties(selectedFieldRecord)
            }
        }
        else if (event.target.name === 'templatename') {
            if (event.target.value !== "") {
                event.target.value = validateCreateView(event.target.value);
                selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
            this.setState({ selectedRecord });
        }
        else {
            if (name === 'synonym') {

                selectedFieldRecord['displayname'] = {
                    ...selectedFieldRecord['displayname'],
                    [event.target.name]: event.target.value

                }
            }
            if (event.target.name === 'label') {
                const langArray = this.props.Login.languageList;
                const langDataObject = {};
                langArray.map(item =>
                    langDataObject[item.value] = event.target.value);

                selectedFieldRecord['displayname'] = {
                    ...selectedFieldRecord['displayname'],
                    ...langDataObject

                }
                chillabelUpdate = true;
                newLabel = event.target.value
                oldLabel = selectedFieldRecord[event.target.name]
                selectedFieldRecord[event.target.name] = event.target.value;
            }
            else {
                selectedFieldRecord[event.target.name] = event.target.value;
            }
            this.saveComponentProperties(selectedFieldRecord, chillabelUpdate, oldLabel, newLabel)
        }
    }

    onComboChange = (comboData, comboName) => {
        let { selectedFieldRecord } = this.state;
        if (selectedFieldRecord.label) {
            if (comboName === 'table') {
                selectedFieldRecord[comboName] = comboData;
                selectedFieldRecord['source'] = comboData.item.stablename;
                selectedFieldRecord['nformcode'] = comboData.item.nformcode

                if (comboData.item.stablename === 'dynamicmaster') {
                    selectedFieldRecord['conditionstring'] = ' and nformcode = ' + comboData.item.nformcode
                }
                selectedFieldRecord['nquerybuildertablecode'] = comboData.value;
                const splititemarray = this.state.selectedComponentpath.split("-")
                const newdata = { ...selectedFieldRecord }
                const design = replaceChildFromChildren(this.state.design, splititemarray, newdata)

                this.props.getTableColumns(design, selectedFieldRecord, comboData.value,
                    this.props.Login.userInfo, splititemarray, this.props.Login.columnInfo)


            } else if (comboName === 'column') {
                selectedFieldRecord[comboName] = comboData;
                selectedFieldRecord['displaymember'] = comboData.value;
                if (comboData.item.ismultilingual) {
                    selectedFieldRecord['isMultiLingual'] = true;
                }
                if (comboData.item.stablename === 'dynamicmaster') {
                    selectedFieldRecord['name'] = comboData.value
                }
                const splititemarray = this.state.selectedComponentpath.split("-")
                const newdata = { ...selectedFieldRecord }
                const design = replaceChildFromChildren(this.state.design, splititemarray, newdata)
                this.setState({ design, selectedFieldRecord })
            } else if (comboName === 'childValue') {
                if (comboData) {
                    const splititemarray = this.state.selectedComponentpath.split("-")
                    let design = this.state.design
                    if (selectedFieldRecord.parentPath) {
                        let oldParentData = getcomponentdata(this.state.design, selectedFieldRecord.parentPath.split("-"));
                        if (oldParentData.child) {
                            let newChildData1 = oldParentData.child.filter(child => child.label !== selectedFieldRecord.label);
                            oldParentData = { ...oldParentData, child: newChildData1 };
                            design = replaceChildFromChildren(this.state.design, selectedFieldRecord.parentPath.split("-"), oldParentData)
                        }

                    }
                    let parentData = getcomponentdata(design, comboData.path.split("-"));
                    selectedFieldRecord['childValue'] = comboData
                    selectedFieldRecord['parentPath'] = comboData.path
                    if (selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER || selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER) {
                        selectedFieldRecord['parentLabel'] = comboData.label
                    }

                    const newdata = { ...selectedFieldRecord }
                    design = replaceChildFromChildren(design, splititemarray, newdata)
                    let newChildData = parentData.child || [];
                    let validateChild = newChildData.filter(x => x.label === selectedFieldRecord.label)
                    if (validateChild.length === 0) {
                        let valueMemberOptions = this.getValueMembers(selectedFieldRecord);
                        if (valueMemberOptions.length === 1) {

                            const foriegntablePK = getChildComponentForeignKey(selectedFieldRecord, comboData, this.props.Login.columnInfo);
                            newChildData.push({ label: selectedFieldRecord.label, foriegntablePK: foriegntablePK, tablecolumnname: valueMemberOptions[0].value, childPath: this.state.selectedComponentpath, isDynamicMapping: selectedFieldRecord.valuemember === "ndynamicmastercode" ? true : false })
                        } else {
                            newChildData.push({ label: selectedFieldRecord.label, childPath: this.state.selectedComponentpath })
                        }

                    }
                    parentData = { ...parentData, child: newChildData };
                    design = replaceChildFromChildren(design, comboData.path.split("-"), parentData)
                    if (selectedFieldRecord.componentcode === ReactComponents.COMBO) {
                        this.setState({ design, selectedFieldRecord });
                    } else if (selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER || selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER) {
                        let parentRadioValue = this.state.parentRadioValue || []
                        parentRadioValue = parentData.radioOptions.tags.map(item => {
                            return { value: item.id, label: item.text, item }
                        })
                        this.setState({ design, selectedFieldRecord, parentRadioValue });
                    }
                    else {
                        this.props.getTableColumns(design, selectedFieldRecord,
                            selectedFieldRecord.childValue.nquerybuildertablecode, this.props.Login.userInfo,
                            splititemarray, this.props.Login.columnInfo,
                            { components: this.state.components, selectedComponentpath: this.state.selectedComponentpath },
                            true)
                    }

                } else {

                    const splititemarray = this.state.selectedComponentpath.split("-")

                    let parentData = getcomponentdata(this.state.design, selectedFieldRecord.parentPath.split("-"));
                    let newChildData = parentData.child.filter(child => child.label !== selectedFieldRecord.label)
                    parentData = { ...parentData, child: newChildData };
                    let design = replaceChildFromChildren(this.state.design, selectedFieldRecord.parentPath.split("-"), parentData)
                    selectedFieldRecord['childValue'] = comboData
                    if (selectedFieldRecord.componentcode !== ReactComponents.COMBO)
                        selectedFieldRecord['column'] = comboData
                    const newdata = { ...selectedFieldRecord }
                    design = replaceChildFromChildren(design, splititemarray, newdata)
                    if (selectedFieldRecord.componentcode === ReactComponents.COMBO) {
                        this.setState({ design, selectedFieldRecord });
                    } else {
                        this.setState({ design, selectedFieldRecord, tableColumn: [] })
                    }
                }

            } else if (comboName === 'valuecolumn') {
                selectedFieldRecord['valuecolumn'] = comboData;
                let parentData = getcomponentdata(this.state.design, selectedFieldRecord.parentPath.split("-"));
                let newChildData = []
                parentData.child.map(child => {
                    if (child.label === selectedFieldRecord.label) {
                        newChildData.push({
                            ...child, tablecolumnname: comboData.value, foriegntablePK: comboData.item.foriegntablePK, isDynamicMapping: selectedFieldRecord.valuemember === "ndynamicmastercode" ? true : false
                        })
                    } else {
                        newChildData.push(child)
                    }
                    return null;
                })
                parentData = { ...parentData, child: newChildData };
                let design = replaceChildFromChildren(this.state.design, selectedFieldRecord.parentPath.split("-"), parentData)
                const newdata = { ...selectedFieldRecord }
                design = replaceChildFromChildren(design, this.state.selectedComponentpath.split("-"), newdata)
                this.setState({ design, selectedFieldRecord });
            }
            else if (comboName === "staticfiltertable") {
                if (comboData) {
                    selectedFieldRecord[comboName] = comboData;
                    const splititemarray = this.state.selectedComponentpath.split("-")
                    const newdata = { ...selectedFieldRecord }
                    const design = replaceChildFromChildren(this.state.design, splititemarray, newdata)
                    const list = JSON.parse(comboData.item.jsondata.value).jcolumnname
                    const staticfiltercolumn = list.map(x => {

                        // x['displayname']= x['displayname'][this.props.Login.userInfo.slanguagetypecode]
                        return { label: x['displayname'][this.props.Login.userInfo.slanguagetypecode], value: x['displayname'][this.props.Login.userInfo.slanguagetypecode], item: x };
                    })

                    this.setState({ design, selectedFieldRecord, staticfiltercolumn });
                } else {
                    selectedFieldRecord[comboName] = comboData;
                    delete selectedFieldRecord['staticfiltercolumn']
                    const splititemarray = this.state.selectedComponentpath.split("-")
                    const newdata = { ...selectedFieldRecord }
                    const design = replaceChildFromChildren(this.state.design, splititemarray, newdata)
                    this.setState({ design, selectedFieldRecord, staticfiltercolumn: [] });
                }
            }
            else {
                selectedFieldRecord[comboName] = comboData;
                const splititemarray = this.state.selectedComponentpath.split("-")
                const newdata = { ...selectedFieldRecord }
                const design = replaceChildFromChildren(this.state.design, splititemarray, newdata)
                this.setState({ design, selectedFieldRecord });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERLABEL" }))
        }

    }

    addCondition = () => {
        let { selectedFieldRecord } = this.state;
        let filterColumnName;
        let filterValue;
        let conditionString;
        let conditionArrayString;
        let selectedStaticfiltertable = {}
        if (selectedFieldRecord["filtercolumn"] && selectedFieldRecord['condition']
            && (selectedFieldRecord['staticfiltercolumn'] || selectedFieldRecord['staticfiltercolumn'])) {
            selectedStaticfiltertable = JSON.parse(selectedFieldRecord["staticfiltertable"].item.jsondata.value)
            switch (selectedFieldRecord["filtercolumn"].type) {
                case 'static': {
                    filterColumnName = " and " + selectedFieldRecord.filtercolumn.item.columnname;
                    filterValue = { label: selectedFieldRecord.staticfiltercolumn.label, value: selectedFieldRecord.staticfiltercolumn.item.columnname }

                    break;
                }
                case 'dynamic': {
                    filterColumnName = " and jsondata->>'" + selectedFieldRecord.filtercolumn.item.columnname + "'";
                    filterValue = { label: selectedFieldRecord.staticfiltercolumn.label, value: selectedFieldRecord.selectedFieldRecord.staticfiltercolumn.item.columnname }
                    break;
                }
                case 'numeric': {
                    filterColumnName = " and " + selectedFieldRecord.filtercolumn.item.tablecolumnname;
                    filterValue = { label: selectedFieldRecord.staticfiltercolumn.label, value: selectedFieldRecord.staticfiltercolumn.item.columnname }

                    break;
                }
                default:
                    break;
            }

            switch (selectedFieldRecord["condition"].value) {
                case condition.EQUALS:
                    conditionString = filterColumnName + " = P$" + selectedStaticfiltertable.jtablename.tablename + "." + filterValue.value + "$P"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " = " + filterValue.label
                    break;
                case condition.NOTEQUALS:
                    conditionString = filterColumnName + " P$" + selectedStaticfiltertable.jtablename.tablename + "." + filterValue.value + "$P"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " = " + filterValue.label
                    break;
                case condition.STARTSWITH:
                    conditionString = filterColumnName + " like 'P$" + selectedStaticfiltertable.jtablename.tablename + "." + filterValue.value + "$P" + "%'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " Starts With " + filterValue.label
                    break;
                case condition.ENDSWITH:
                    conditionString = filterColumnName + " like '%P$" + selectedStaticfiltertable.jtablename.tablename + "." + filterValue.value + "$P'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + "Ends With " + filterValue.label
                    break;
                case condition.INCLUDES:
                    conditionString = filterColumnName + " like '%P$" + selectedStaticfiltertable.jtablename.tablename + "." + filterValue.value + "$P%'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " Contains " + filterValue.label
                    break;
                // case condition.CONTAINS:
                //     conditionString = filterColumnName + " in (" + filterValue.map(x => x.value).join(',') + " )"
                //     conditionArrayString = selectedFieldRecord.filtercolumn.label + " in (" + filterValue.map(x => x.label).join(',') + " )"
                //     break;
                // case condition.NOTCONTAINS:
                //     conditionString = filterColumnName + " not in (" + filterValue.map(x => x.value).join(',') + " )"
                //     conditionArrayString = selectedFieldRecord.filtercolumn.label + " not in (" + filterValue.map(x => x.label).join(',') + " )"
                //     break;
                default:
                    break;
            }
            let conditionArrayUI = selectedFieldRecord.conditionArrayUI || [];
            let conditionArraySQL = selectedFieldRecord.conditionArraySQL || [];
            conditionArrayUI.push(conditionArrayString);
            conditionArraySQL.push(conditionString);
            selectedFieldRecord = {
                ...selectedFieldRecord,
                filtercolumn: "",
                condition: "",
                staticfiltervalue: undefined,
                filtervalue: "",
                staticfiltertable: "",
                nsystemconfiguration: false,
                conditionArrayUI,
                conditionArraySQL,
                staticfiltercolumn: ""
            }

            selectedFieldRecord['conditionstring'] = conditionArraySQL.join(" ");

        }
        else if (selectedFieldRecord["filtercolumn"] && selectedFieldRecord['condition']
            && (selectedFieldRecord['staticfiltervalue'] || selectedFieldRecord['filtervalue'])) {

            switch (selectedFieldRecord["filtercolumn"].type) {
                case 'static': {
                    filterColumnName = " and " + selectedFieldRecord.filtercolumn.item.columnname;
                    filterValue = { label: selectedFieldRecord.staticfiltervalue, value: selectedFieldRecord.staticfiltervalue }
                    break;
                }
                case 'dynamic': {
                    filterColumnName = " and jsondata->>'" + selectedFieldRecord.filtercolumn.item.columnname + "'";
                    filterValue = { label: selectedFieldRecord.staticfiltervalue, value: selectedFieldRecord.staticfiltervalue }
                    break;
                }
                case 'numeric': {
                    filterColumnName = " and " + selectedFieldRecord.filtercolumn.item.tablecolumnname;
                    filterValue = selectedFieldRecord.filtervalue
                    break;
                }
                default:
                    break;
            }
            switch (selectedFieldRecord["condition"].value) {
                case condition.EQUALS:
                    conditionString = filterColumnName + " = '" + filterValue.value + "'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " = " + filterValue.label
                    break;
                case condition.NOTEQUALS:
                    conditionString = filterColumnName + " != '" + filterValue.value + "'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " = " + filterValue.label
                    break;
                case condition.STARTSWITH:
                    conditionString = filterColumnName + " like '" + filterValue.value + "%'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " Starts With " + filterValue.label
                    break;
                case condition.ENDSWITH:
                    conditionString = filterColumnName + " like '%" + filterValue.value + "'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + "Ends With " + filterValue.label
                    break;
                case condition.INCLUDES:
                    conditionString = filterColumnName + " like '%" + filterValue.value + "%'"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " Contains " + filterValue.label
                    break;
                case condition.CONTAINS:
                    conditionString = filterColumnName + " in (" + filterValue.map(x => x.value).join(',') + " )"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " in (" + filterValue.map(x => x.label).join(',') + " )"
                    break;
                case condition.NOTCONTAINS:
                    conditionString = filterColumnName + " not in (" + filterValue.map(x => x.value).join(',') + " )"
                    conditionArrayString = selectedFieldRecord.filtercolumn.label + " not in (" + filterValue.map(x => x.label).join(',') + " )"
                    break;
                default:
                    break;
            }
            let conditionArrayUI = selectedFieldRecord.conditionArrayUI || [];
            let conditionArraySQL = selectedFieldRecord.conditionArraySQL || [];
            conditionArrayUI.push(conditionArrayString);
            conditionArraySQL.push(conditionString);
            selectedFieldRecord = {
                ...selectedFieldRecord,
                filtercolumn: "",
                condition: "",
                staticfiltervalue: undefined,
                filtervalue: "",
                conditionArrayUI,
                conditionArraySQL,
                nsystemconfiguration: false,
                staticfiltercolumn: ""
            }

            selectedFieldRecord['conditionstring'] = conditionArraySQL.join(" ");
        }
        else {
            return toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALUES" }))
        }
        const splititemarray = this.state.selectedComponentpath.split("-")
        const newdata = { ...selectedFieldRecord }
        const design = replaceChildFromChildren(this.state.design, splititemarray, newdata)
        this.setState({ design, selectedFieldRecord, staticfiltercolumn: "" });
    }
    deleteCondition = (index) => {
        let { selectedFieldRecord } = this.state;
        let conditionArrayUI = selectedFieldRecord.conditionArrayUI;
        let conditionArraySQL = selectedFieldRecord.conditionArraySQL;
        conditionArrayUI.splice(index, 1);
        conditionArraySQL.splice(index, 1);
        selectedFieldRecord['conditionArrayUI'] = conditionArrayUI;
        selectedFieldRecord['conditionArraySQL'] = conditionArraySQL;
        selectedFieldRecord['conditionstring'] = conditionArraySQL.join(" ");
        const splititemarray = this.state.selectedComponentpath.split("-")
        const newdata = { ...selectedFieldRecord }
        const design = replaceChildFromChildren(this.state.design, splititemarray, newdata)
        this.setState({ design, selectedFieldRecord });
    }


    saveComponentProperties = (selectedFieldRecord, childLabelUpdate, oldLabelName, newLabelName) => {
        const splititemarray = this.state.selectedComponentpath.split("-")
        // const selectedFieldRecord = this.state.selectedFieldRecord;
        const newdata = { ...selectedFieldRecord }
        let design1 = this.state.design
        if (childLabelUpdate) {
            design1 = this.updateLabelName(this.state.design, oldLabelName, newLabelName)
        }
        const design = replaceChildFromChildren(design1, splititemarray, newdata)
        this.setState({ design, selectedFieldRecord })
    }

    updateLabelName = (design, oldLabelName, newLabelName) => {
        design.map((row, rowIndex) =>
            row.children.map((column, columnIndex) =>
                column.children.map((componnetrow, compRowIndex) => {
                    if (componnetrow.hasOwnProperty('children')) {
                        componnetrow.children.map((component, compIndex) => {
                            if (component.child) {
                                let newChild = [];
                                component.child.map(childComp => {
                                    if (childComp.label === oldLabelName) {
                                        newChild.push({ ...childComp, label: newLabelName });
                                    } else {
                                        newChild.push({ ...childComp });
                                    }

                                })
                                component = { ...component, child: newChild }
                                design = replaceChildFromChildren(design, [rowIndex, columnIndex, compRowIndex, compIndex], component);
                            }


                        })
                    } else {
                        if (componnetrow.child) {
                            let newChild = [];
                            componnetrow.child.map(childComp => {
                                if (childComp.label === oldLabelName) {
                                    newChild.push({ ...childComp, label: newLabelName });
                                } else {
                                    newChild.push({ ...childComp });
                                }
                            })
                            componnetrow = { ...componnetrow, child: newChild }
                            design = replaceChildFromChildren(design, [rowIndex, columnIndex, compRowIndex, 0], componnetrow);
                        }

                    }
                })
            )
        )
        return design;

    }

    validateTemplate = (template) => {

        let invalidComponent = [];
        let duplicateComponents = [];
        let insufficientMultilingualData = [];
        let incompletePropertiesComponent = [];
        let notcompleteProperties = [];
        let labels = [];
        let length = 0;
        template.map((row, rowIndex) => {
            row.children.map((column, columnIndex) => {
                column.children.map((componnet, compindex) => {
                    if (componnet.hasOwnProperty("children")) {
                        componnet.children.map((componnetrow, compRowIndex) => {
                            length = length + 1;
                            if (!componnetrow.hasOwnProperty('label') || componnetrow.label.trim() === '') {
                                invalidComponent.push(componnetrow)
                            }
                            if (labels.includes(componnetrow.label)) {
                                duplicateComponents.push(componnetrow)
                            } else {
                                if (componnetrow.label !== undefined)
                                    labels.push(componnetrow.label);
                            }
                            if (componnetrow.componentcode === ReactComponents.COMBO) {
                                if ((!componnetrow.hasOwnProperty('source')) &&
                                    (!componnetrow.hasOwnProperty('displaymember'))) {
                                    incompletePropertiesComponent.push(componnetrow)
                                }
                            }

                            if (!componnetrow.hasOwnProperty('displayname') || Object.keys(componnetrow.displayname).length < this.props.Login.languageList.length) {
                                insufficientMultilingualData.push(componnetrow);
                            }

                        })
                    } else {
                        length = length + 1;
                        if (!componnet.hasOwnProperty('label') || componnet.label.trim() === '') {
                            invalidComponent.push(componnet)
                        }
                        if (labels.includes(componnet.label)) {
                            duplicateComponents.push(componnet)
                        } else {
                            if (componnet.label !== undefined)
                                labels.push(componnet.label);
                        }
                        if (componnet.componentcode === ReactComponents.COMBO) {
                            if ((!componnet.hasOwnProperty('source')) &&
                                (!componnet.hasOwnProperty('displaymember'))) {
                                incompletePropertiesComponent.push(componnet)
                            }
                        }
                        if (!componnet.hasOwnProperty('displayname') || Object.keys(componnet.displayname).length < this.props.Login.languageList.length) {
                            insufficientMultilingualData.push(componnet);
                        }
                    }
                })
                return null;
            })
            return null;
        })
        if (length === 0) {
            toast.warn(this.props.intl.formatMessage({ id: 'IDS_CREATETEMPLATE' }) );
        }
        if (duplicateComponents.length > 0) {
            const dataArray = [];
            duplicateComponents.map(item => dataArray.push(item.label));
            toast.warn(this.props.intl.formatMessage({ id: 'IDS_DUPLICATECOMPONENTSFOUND' }) + dataArray.join(","));
            return false;
        }
        if (invalidComponent.length > 0) {
            const dataArray = [];
            invalidComponent.map(item => dataArray.push(item.label));
            toast.warn(this.props.intl.formatMessage({ id: 'IDS_MISSINGCOMPONENTLABEL' }));
            return false;
        }
        if (insufficientMultilingualData.length > 0) {
            const dataArray = [];
            insufficientMultilingualData.map(item => dataArray.push(item.label));
            toast.warn(this.props.intl.formatMessage({ id: 'IDS_INSUFFICIENTMULTILINGUALDATA' }) + dataArray.join(","));
            return false;
        }
        if (incompletePropertiesComponent.length > 0) {
            const dataArray = [];
            incompletePropertiesComponent.map(item => dataArray.push(item.label));
            toast.warn(this.props.intl.formatMessage({ id: 'IDS_INVALIDCOMPONENT' }) + dataArray.join(","));
            return false;
        }
        if (notcompleteProperties.length > 0) {
            const dataArray = [];
            notcompleteProperties.map(item => dataArray.push(item.label));
            toast.warn(this.props.intl.formatMessage({ id: 'IDS_MISSMATCHEDVALUES' }) + dataArray.join(","));
            return false;
        }
        return true;
    }


    getMappingCheck = (selectedRecord, columnInfo, component) => {

        const formPrimaryKey = selectedRecord.stableprimarykeyname;
        const formJnumericColumn = selectedRecord.jnumericcolumns;

        const check = [];

        if (columnInfo[component.nquerybuildertablecode].numericColumns.length) {
            columnInfo[component.nquerybuildertablecode].numericColumns.map(mycol => {
                if (mycol.foriegntablePK === 'ndynamicmastercode') {
                    const index = columnInfo[component.nquerybuildertablecode].staicColumns.findIndex(x => x.columnname === mycol.parentforeignPK && component.nformcode === mycol.foreigntableformcode)
                    if (index !== -1) {
                        check.push(true)

                    }
                }
                else if (mycol.foriegntablePK === formPrimaryKey) {
                    check.push(true)
                }
            })
        }


        if (formJnumericColumn.length) {
            formJnumericColumn.map(mycol => {
                if (mycol.foriegntablePK === 'ndynamicmastercode') {
                    const index = columnInfo[component.nquerybuildertablecode].staicColumns.findIndex(x => x.columnname === mycol.parentforeignPK && component.nformcode === mycol.foreigntableformcode)
                    if (index !== -1) {
                        check.push(true)
                    }
                }
                else if (mycol.foriegntablePK === component.valuemember) {
                    check.push(true)
                }
            })


        }

        if(component.valuemember===formPrimaryKey){
            check.push(true)
        }

    

        return check.includes(true);
    }

}
export default connect(mapStateToProps, {
    updateStore, crudMaster,
    getTableColumns, getForeignTableData, getDynamicFilter, getDynamicFilterExecuteData
})(injectIntl(BarcodePreRegDesign))