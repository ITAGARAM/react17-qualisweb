import React from 'react';
import { injectIntl } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AtAccordion } from '../../../components/custom-accordion/custom-accordion.styles';
import { Accordion, Card, Col, FormGroup, ListGroupItem, Nav, Row, useAccordionToggle } from 'react-bootstrap';
import AccordionContext from "react-bootstrap/AccordionContext";
import { Draggable, Droppable } from 'react-drag-and-drop';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormNumericInput from '../../../components/form-numeric-input/form-numeric-input.component';
import FormInput from '../../../components/form-input/form-input.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../../components/Enumeration';
//import { transactionStatus } from '../../../components/Enumeration';
class AddSeqNoFormatPopup extends React.Component {

    constructor(props) {
        super(props);
        this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.date = new Date();
        this.year = this.props.intl.formatMessage({ id: "IDS_YEAR" })
        this.month = this.props.intl.formatMessage({ id: "IDS_MONTH" })
        this.dates = this.props.intl.formatMessage({ id: "IDS_DATE" })
        this.character = this.props.intl.formatMessage({ id: "IDS_LIMSCHARACTER" })
        this.seqNo = this.props.intl.formatMessage({ id: "IDS_SEQNO" })
        this.site = this.props.intl.formatMessage({ id: "IDS_SITE" })
    }
    render() {
        let str = '{9999}'
        str = str.substring(1, str.length - 4)
        str = str.padStart(this.props.selectedRecord && (this.props.selectedRecord.seqnolength || 4), 9)
        let sseqno = '{' + str + '}'

        const formatComponents = [
            { "componentname": `${this.year} (${this.date.getFullYear()})`, "componentvalue": "{yyyy}" },
            { "componentname": `${this.year} (${this.date.getFullYear().toString().substring(2, 4)})`, "componentvalue": "{yy}" },
            { "componentname": `${this.month} (${(this.date.getMonth() + 1).toString().padStart(2, "0")})`, "componentvalue": "{MM}" },
            { "componentname": `${this.month} (${this.months[this.date.getMonth()]})`, "componentvalue": "{MMM}" },
            { "componentname": `${this.dates} (${this.date.getDate()})`, "componentvalue": "{DD}" },
            { "componentname": `${this.character} (${this.props.selectedRecord && (this.props.selectedRecord.splaintext || "")})`, "componentvalue": this.props.selectedRecord && this.props.selectedRecord.splaintext || "" },
            { "componentname": `${this.seqNo} (${sseqno})`, "componentvalue": this.props.selectedRecord && (this.props.selectedRecord.sseqno || "{9999}") },
            // ALPD-4291 - Commented by L.Subashini as the COA Report file name 
            // cannot be created using '/' symbol
            // { "componentname": "/", "componentvalue": "/" },
            { "componentname": "-", "componentvalue": "-" }


        ];
        if (parseInt(this.props.settings[23]) === transactionStatus.YES) {
            formatComponents.push({ "componentname": `${this.site} (${this.props.userInfo.ssitecode})`, "componentvalue": "{XXXXX}" });
        }
        const configFields = [
            { "idsName": "IDS_NEEDSUBSAMPLE", "dataField": "nneedsubsample" },
            // { "idsName": "IDS_NEEDSAMPLEDBY", "dataField": "nneedsampledby" },
            { "idsName": "IDS_NEEDJOBALLOCATION", "dataField": "nneedjoballocation" },
            { "idsName": "IDS_NEEDMYJOB", "dataField": "nneedmyjob" },
            { "idsName": "IDS_NEEDWORKLIST", "dataField": "nneedworklist" },
            { "idsName": "IDS_NEEDBATCH", "dataField": "nneedbatch" },
            { "idsName": "IDS_TESTGROUPSPEC", "dataField": "ntestgroupspecrequired" },  //ALPD-4973, Vishakh, Added Test group spec toggle button
            /*ALPD-4135-Vignesh R--The system will allow the authorized 
             user to enter results for the selected tests without initiate action.*/
            { "idsName": "IDS_NEEDTESTINITIATE", "dataField": "nneedtestinitiate" },
            //  { "idsName": "IDS_NEEDSCHEDULER", "dataField": "nneedscheduler" },
            // { "idsName": "IDS_NEEDTEMPLATEBASEDFLOW", "dataField": "nneedtemplatebasedflow" },
            { "idsName": "IDS_USENEWFORMAT", "dataField": "nisnewformat" },
            { "idsName": "IDS_NEEDSITEWISEARNO", "dataField": "nneedsitewisearno" },

        ]
        const CustomToggle = ({ children, eventKey }) => {
            const currentEventKey = React.useContext(AccordionContext);
            const isCurrentEventKey = currentEventKey === eventKey;
            const decoratedOnClick = useAccordionToggle(eventKey, "");
            return (
                <div
                    className="d-flex justify-content-between"
                    onClick={decoratedOnClick}>
                    {children}
                    {isCurrentEventKey ?
                        <FontAwesomeIcon icon={faChevronUp} />
                        : <FontAwesomeIcon icon={faChevronDown} //onClick={children.props.onExpandCall}
                        />}
                </div>
            );
        }
        return (
            <>
                {/* <Row> */}
                <Row>
                    <FormGroup>
                        {this.props.intl.formatMessage({ id: "IDS_TRANSACTIONFLOW" })}
                    </FormGroup>
                </Row>
                <Row>
                    {configFields.map((field, index) =>

                        index < 6 ?
                            field.dataField === "ntestgroupspecrequired" ? parseInt(this.props.settings[71]) === transactionStatus.NO ?    //ALPD-4973, Vishakh, Toggle button will be shown based on settings table 71 record
                                <Col md={2} key={index}>
                                    <CustomSwitch
                                        label={this.props.intl.formatMessage({ id: field.idsName })}
                                        type="switch"
                                        name={field.dataField}
                                        onChange={(event) => this.props.onInputOnChange(event)}
                                        isMandatory={false}
                                        required={true}
                                        disabled={false}
                                        //field.dataField==='nneedjoballocation'||
                                        // field.dataField === 'nneedmyjob' ?
                                        //     this.props.selectedRecord && this.props.selectedRecord["nneedworklist"] ?
                                        //         this.props.selectedRecord["nneedworklist"] === true ? true : false : false : false}
                                        // ALPD-5336 - Gowtham R - Registration Sub Type: Either Worklist or My job toggle should be enabled.
                                        checked={(this.props.selectedRecord && this.props.selectedRecord[field.dataField] && this.props.selectedRecord[field.dataField]==true) ? true : false}
                                    />
                                </Col> : "" :
                                <Col md={2} key={index}>
                                    <CustomSwitch
                                        label={this.props.intl.formatMessage({ id: field.idsName })}
                                        type="switch"
                                        name={field.dataField}
                                        onChange={(event) => this.props.onInputOnChange(event)}
                                        isMandatory={false}
                                        required={true}
                                        disabled={false}
                                            //field.dataField==='nneedjoballocation'||
                                            // field.dataField === 'nneedmyjob' ?
                                            //     this.props.selectedRecord && this.props.selectedRecord["nneedworklist"] ?
                                            //         this.props.selectedRecord["nneedworklist"] === true ? true : false : false : false}
                                        // ALPD-5336 - Gowtham R - Registration Sub Type: Either Worklist or My job toggle should be enabled.
                                        checked={(this.props.selectedRecord && this.props.selectedRecord[field.dataField] && this.props.selectedRecord[field.dataField]==true) ? true : false}
                                        // checked={this.props.selectedRecord && this.props.selectedRecord[field.dataField]}
                                        //checked={this.props.selectedRecord[field.dataField] === transactionStatus.YES?true:false}
                                        //checked={this.props.selectedRecord && this.props.selectedRecord[field.dataField] ?this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" })}
                                        
                                    />
                                </Col>
                            :

                            ""

                    )}
                </Row>
                <div class='dropdown-divider' />
                <Row>

                    <FormGroup>
                        {this.props.intl.formatMessage({ id: "IDS_SEQUENCEFORMAT" })}
                    </FormGroup>

                </Row>
                <Row>
                    {configFields.map((field, index) =>

                        index > 5 ?
                            <Col md={3} key={index}>
                                <CustomSwitch
                                    label={this.props.intl.formatMessage({ id: field.idsName })}
                                    type="switch"
                                    name={field.dataField}
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    isMandatory={false}
                                    required={true}
                                    disabled={
                                        //field.dataField==='nneedjoballocation'||
                                        field.dataField === 'nneedmyjob' ?
                                            this.props.selectedRecord && this.props.selectedRecord["nneedworklist"] ?
                                                this.props.selectedRecord["nneedworklist"] === true ? true : false : false : false}
                                    checked={this.props.selectedRecord && this.props.selectedRecord[field.dataField] }
                                    //checked={this.props.selectedRecord[field.dataField] === transactionStatus.yes?true:false}
                                    //checked={this.props.selectedRecord && this.props.selectedRecord[field.dataField] ?this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" })}
                                    
                                />
                            </Col>
                            :

                            ""

                    )}

                </Row>
                {/* </Row> */}
                {this.props.selectedRecord && this.props.selectedRecord.nisnewformat ?
                    <Row>
                        {/* <Col md={6}>
                            <FormNumericInput
                                name={"nresetduration"}
                                label={this.props.intl.formatMessage({ id: "IDS_RESETDURATION" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_RESETDURATION" })}
                                value={this.props.selectedRecord.nresetduration || ""}
                                className="form-control"
                                noStyle={true}
                                isMandatory={true}
                                required={true}
                                maxLength={100}
                                onChange={(event) => this.props.onNumericInputChange(event, 'nresetduration')}
                            />
                        </Col> */}
                        <Col md={4}>
                            <FormSelectSearch
                                name={"nperiodcode"}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_RESETSEQEVERY" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_RESETDURATION" })}
                                options={this.props.periodList || []}
                                value={this.props.selectedRecord && (this.props.selectedRecord.nperiodcode || '')}
                                isMandatory={true}
                                isSearchable={true}
                                isMulti={false}
                                onChange={(event) => this.props.onComboChange(event, 'nperiodcode')}
                            />
                        </Col>
                        <Col md={4}>
                            <FormInput
                                name={"splaintext"}
                                label={this.props.intl.formatMessage({ id: "IDS_TEXTVALUE" })}
                                type="text"
                                value={this.props.selectedRecord && (this.props.selectedRecord.splaintext || "")}
                                required={true}
                                maxLength={10}
                                onChange={(event) => this.props.onInputOnChange(event)}
                            />
                        </Col>
                        <Col md={4}>
                            <FormNumericInput
                                name={"seqnolength"}
                                className={"form-control"}
                                label={this.props.intl.formatMessage({ id: "IDS_SEQUENCENOLENGTH" })}
                                //value={this.props.selectedRecord && this.props.selectedRecord.seqnolength || 4}
                                value={this.props.selectedRecord && this.props.selectedRecord.seqnolength === "" ? this.props.selectedRecord.seqnolength : this.props.selectedRecord.seqnolength || 4}
                                isMandatory={true}
                                type="number"
                                noStyle={true}
                                required={true}
                                strict={true}
                                maxLength={1}
                                onChange={(event) => this.props.onNumericInputChange(event, 'seqnolength')}
                            />
                        </Col>
                    </Row>
                    : ""}
                <Row>
                    <Col md={4} className='mt-3'>
                        <PerfectScrollbar>
                            <AtAccordion>
                                <Accordion activeKey={this.props.selectedRecord && this.props.selectedRecord.nisnewformat ? "InputFields" : "ExistingFormats"} >
                                    <Card>
                                        {this.props.selectedRecord && this.props.selectedRecord.nisnewformat ?
                                            <>
                                                <Card.Header>
                                                    <CustomToggle eventKey={"InputFields"}>
                                                        <Card.Title>
                                                            {this.props.intl.formatMessage({ id: "IDS_FORMATFIELDS" })}
                                                        </Card.Title>
                                                    </CustomToggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={"InputFields"}>
                                                    <>
                                                        {
                                                            formatComponents.map((sideBarItem, index) => (
                                                                <Draggable type={'formatcomponents'} data={sideBarItem.componentvalue}>
                                                                    <ListGroupItem key={index} className="sideBarItem ml-0" style={{ backgroundColor: "#155592", justifyContent: "space-around" }}>
                                                                        {sideBarItem.componentname}
                                                                    </ListGroupItem>
                                                                </Draggable>
                                                            ))
                                                        }
                                                    </>
                                                </Accordion.Collapse>
                                            </>


                                            :

                                            this.props.selectedRecord && this.props.selectedRecord.nneedsitewisearno ? <>
                                                <Card.Header>
                                                    <CustomToggle eventKey={"ExistingFormats"}>
                                                        <Card.Title>
                                                            {this.props.intl.formatMessage({ id: "IDS_SITEWISEEXISTINGFORMAT" })}
                                                        </Card.Title>
                                                    </CustomToggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={"ExistingFormats"}>
                                                    <>
                                                        {
                                                            this.props.sitewiseexistingFormats && this.props.sitewiseexistingFormats.map((sideBarItem, index) => (
                                                                <Draggable type={'formatcomponents'} data={sideBarItem.ssampleformat}>
                                                                    <ListGroupItem key={index} className="sideBarItem ml-0" style={{ backgroundColor: "#155592", justifyContent: "space-around" }}>
                                                                        {sideBarItem.ssampleformat}
                                                                    </ListGroupItem>
                                                                </Draggable>
                                                            ))
                                                        }
                                                    </>
                                                </Accordion.Collapse>
                                            </> :



                                                <>
                                                    <Card.Header>
                                                        <CustomToggle eventKey={"ExistingFormats"}>
                                                            <Card.Title>
                                                                {this.props.intl.formatMessage({ id: "IDS_EXISTINGFORMAT" })}
                                                            </Card.Title>
                                                        </CustomToggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={"ExistingFormats"}>
                                                        <>
                                                            {
                                                                this.props.existingFormats && this.props.existingFormats.map((sideBarItem, index) => (
                                                                    <Draggable type={'formatcomponents'} data={sideBarItem.ssampleformat}>
                                                                        <ListGroupItem key={index} className="sideBarItem ml-0" style={{ backgroundColor: "#155592", justifyContent: "space-around" }}>
                                                                            {sideBarItem.ssampleformat}
                                                                        </ListGroupItem>
                                                                    </Draggable>
                                                                ))
                                                            }
                                                        </>
                                                    </Accordion.Collapse>
                                                </>
                                        }
                                    </Card>
                                </Accordion>
                            </AtAccordion>
                        </PerfectScrollbar>
                    </Col>
                    <Col md={8}>
                        <Row>
                            {this.props.selectedRecord && this.props.selectedRecord.nisnewformat ?
                                <Col md={6} className='d-flex flex-column'>
                                    <Nav.Link className="btn-user btn-cancel btn p-0" onClick={this.props.onClickBackspace}>
                                        <FontAwesomeIcon icon={faBackspace} className='pr-1' />
                                        {this.props.intl.formatMessage({ id: "IDS_BACKSPACE" })}
                                    </Nav.Link>
                                </Col>
                                : ""
                            }
                            <Col md={6} className=' d-flex justify-content-start'>
                                <Nav.Link className="btn-user btn-cancel btn p-0 mb-3" onClick={this.props.onClickClear}>
                                    <FontAwesomeIcon icon={faTimes} className='pr-1' />
                                    {this.props.intl.formatMessage({ id: "IDS_CLEARALL" })}
                                </Nav.Link>
                            </Col>
                            <Col md={12}>
                                <Droppable
                                    types={['formatcomponents']}
                                    onDrop={event => this.props.onDrop(event)}
                                    className={"p-1"}
                                >
                                    <FormTextarea
                                        name={"ssampleformat"}
                                        label={this.props.intl.formatMessage({ id: "IDS_INPUTFORMATWITHINFO" })}
                                        onChange={(event) => this.props.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_INPUTFORMAT" })}
                                        value={this.props.selectedRecord && this.props.selectedRecord["ssampleformat"]}
                                        rows={2}
                                        isMandatory={true}
                                        readOnly={true}
                                        required={true}
                                        showCharCount={true}
 										//ALPD-5254--added by  neeraj
                                        maxLength={30}
                                        charLength={this.props.selectedRecord && this.props.selectedRecord["ssampleformat"] ? this.props.selectedRecord["ssampleformat"].replaceAll("{", "").replaceAll("}", "").length : 0}
                                    />
                                </Droppable>
                            </Col>
                            <Col md={12}>
                                <FormTextarea
                                    name={"exampleformat"}
                                    label={this.props.intl.formatMessage({ id: "IDS_OUTPUTFORMAT" })}
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_OUTPUTFORMAT" })}
                                    value={this.props.selectedRecord && this.props.selectedRecord["exampleformat"]}
                                    rows={2}
                                    isMandatory={true}
                                    readOnly={true}
                                    required={true}
                                    showCharCount={true}
                                    //ALPD-5254--added by  neeraj
                                    maxLength={30}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    }
}
export default injectIntl(AddSeqNoFormatPopup)