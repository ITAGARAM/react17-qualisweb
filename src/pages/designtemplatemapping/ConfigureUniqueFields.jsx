
import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'rc-tabs/assets/index.css';
import { Col, Form, InputGroup, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { SampleType, designProperties } from '../../components/Enumeration';
import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';
import Tabs, { TabPane } from 'rc-tabs';
class ConfigureUniqueFields extends React.Component {
    constructor(props) {
        super(props);

        const screens = [{ eventKey: 'sample', name: "IDS_SAMPLE" }];
        if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedsubsample === true) {
            screens.push({ eventKey: 'subsample', name: "IDS_SUBSAMPLE" });
        }

        this.state = {
            screens,
            selectedScreen: { eventKey: 'sample', name: "IDS_SAMPLE" }
        }
    }

    onTabChange = (tab) => {
        this.setState({
            selectedScreen: this.state.screens.find(screen => screen.eventKey === tab)
        })
    }

    render() {
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        const dataList = this.props.selectedTemplateType === SampleType.Masters 
        || this.props.selectedTemplateType === SampleType.GOODSIN 
        || this.props.selectedTemplateType === SampleType.PROTOCOL 
        || this.state.selectedScreen.eventKey === 'sample' ? this.props.dataList : this.props.dataListsubsample

        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025

        const dataListCount = this.props.selectedTemplateType === SampleType.Masters
         || this.props.selectedTemplateType === SampleType.GOODSIN  
         || this.props.selectedTemplateType === SampleType.PROTOCOL 
         || this.state.selectedScreen.eventKey === 'sample' ? this.props.dataListCount : this.props.dataListCountsubsample
       // const designData = this.props.selectedTemplateType === SampleType.Masters || this.props.selectedTemplateType === SampleType.GOODSIN ? this.props.designData.templatefields : this.state.selectedScreen.eventKey === 'sample' ? this.props.designData.sampletemplatefields : this.props.designData.subsampletemplatefields

       //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025

        const designData = this.props.selectedTemplateType === SampleType.Masters ?  this.props.designData.mastertemplatefields 
        : this.props.selectedTemplateType === SampleType.GOODSIN  
        || this.props.selectedTemplateType === SampleType.PROTOCOL ? this.props.designData.templatefields 
        : this.state.selectedScreen.eventKey === 'sample' ? this.props.designData.sampletemplatefields 
        : this.props.designData.subsampletemplatefields


        return (
            <>
                {this.props.selectedTemplateType === SampleType.Masters 
                || this.props.selectedTemplateType === SampleType.GOODSIN  
                || this.props.selectedTemplateType === SampleType.PROTOCOL
                 || (this.props.approvedRegSubTypeVersion && (this.props.approvedRegSubTypeVersion.jsondata.nneedsubsample === undefined 
                    || this.props.approvedRegSubTypeVersion.jsondata.nneedsubsample === false)) ?
                    <>
                        <div className='d-flex justify-content-end'>
                            <Nav.Link onClick={() => this.props.addCombinatonUnique(designData
                            )} className="add-txt-btn">
                                <FontAwesomeIcon icon={faPlus} />{ }
                                <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                            </Nav.Link>
                        </div>
                        {dataListCount.map((item, index) =>
                            <>
                                <Row>
                                    <Col md={11}>
                                        <InputGroup size={'lg'}>
                                            <Form.Group>
                                                <Row>
                                                    {designData.map(checkbox =>
                                                checkbox[designProperties.VALUE] !=='sreportno' 
                                                && checkbox[designProperties.VALUE] !=='sarno' 
                                                && checkbox[designProperties.VALUE] !=='sspecname' 
                                                && checkbox[designProperties.VALUE] !=='dregdate' 
                                                && checkbox[designProperties.VALUE] !=='stransdisplaystatus' 
                                                && checkbox[designProperties.VALUE] !=='ntestcount'
                                                && checkbox[designProperties.LISTITEM] !=='label' && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen

                                                        <Col md={4}>
                                                            <Form.Check
                                                                inline={true}
                                                                type="checkbox"
                                                                name={checkbox["2"]}
                                                                label={checkbox["1"][this.props.slanguagetypecode] || checkbox["2"]}
                                                                onChange={(event) => this.props.onInputOnChange(event, checkbox["2"], index, checkbox["1"])}
                                                                id={checkbox["2"]}
                                                                checked={checkbox["2"] === (dataList && dataList[index] && dataList[index][checkbox["2"]] && dataList[index][checkbox["2"]]["2"]) ? true : false}
                                                                defaultChecked={checkbox["2"] === (dataList && dataList[index] && dataList[index][checkbox["2"]] && dataList[index][checkbox["2"]]["2"]) ? true : false}
                                                                size={'lg'}
                                                            />
                                                        </Col>


                                                    )}
                                                </Row>
                                            </Form.Group>
                                        </InputGroup >
                                    </Col>
                                    <Col md={1}>
                                        <div className='icon-group-wrap enable-view click-view '>
                                            {/* style={{ "display": "inline-flex", "align-items": "center", "padding-left": "0", "margin-right": "0.75rem" }} */}
                                            <Nav.Link onClick={() => this.props.deleteCombinationUnique(index)} >
                                                <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                                            </Nav.Link>
                                        </div>
                                    </Col>

                                </Row>
                                {dataListCount.length-1 !== index ?
                                    <hr /> : ""}
                            </>
                        )}
                    </> :
                    <AtTabs>
                        <Tabs activeKey={this.state.selectedScreen.eventKey} moreIcon="..." onChange={this.onTabChange}>
                            {this.state.screens.map(screen =>
                                <TabPane name={screen.eventKey} tab={this.props.intl.formatMessage({ id: screen.name })} key={screen.eventKey}>
                                    <div className='d-flex justify-content-end'>
                                        <Nav.Link onClick={() => this.props.addCombinatonUnique(designData, screen.eventKey
                                        )} className="add-txt-btn">
                                            <FontAwesomeIcon icon={faPlus} />{ }
                                            <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                                        </Nav.Link>
                                    </div>
                                    {dataListCount.map((item, index) =>
                                        <>
                                            <Row>
                                                <Col md={11}>
                                                    <InputGroup size={'lg'}>
                                                        <Form.Group>
                                                            <Row style={{ "margin":"0.5px"}}>
                                                                {designData.map(checkbox =>
                                                                  checkbox[designProperties.LISTITEM] !=='label' && //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                                                    <Col md={4}>
                                                                        <Form.Check
                                                                            inline={true}
                                                                            type="checkbox"
                                                                            name={checkbox["2"]}
                                                                            label={checkbox["1"][this.props.slanguagetypecode] || checkbox["2"]}
                                                                            onChange={(event) => this.props.onInputOnChange(event, checkbox["2"], index, checkbox["1"], screen.eventKey)}
                                                                            id={checkbox["2"]}
                                                                            checked={checkbox["2"] === (dataList && dataList[index] && dataList[index][checkbox["2"]] && dataList[index][checkbox["2"]]["2"]) ? true : false}
                                                                            defaultChecked={checkbox["2"] === (dataList && dataList[index] && dataList[index][checkbox["2"]] && dataList[index][checkbox["2"]]["2"]) ? true : false}
                                                                            size={'lg'}
                                                                        />
                                                                    </Col>

                                                                )}
                                                            </Row>
                                                        </Form.Group>
                                                    </InputGroup >
                                                </Col>
                                                <Col md={1} style={{ "padding":"0.5px"}}>
                                                    <div className='icon-group-wrap enable-view click-view '>
                                                        {/* <div style={{ "display": "inline-flex", "align-items": "center", "padding-left": "0", "margin-right": "0.75rem" }}> */}
                                                        <Nav.Link onClick={() => this.props.deleteCombinationUnique(index, screen.eventKey)} >
                                                            <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                                                        </Nav.Link>
                                                    </div>
                                                </Col>
                                            </Row>
                                            {dataListCount.length-1  !== index ?
                                                <hr /> : ""}
                                        </>
                                    )}
                                </TabPane>
                            )}
                        </Tabs>
                    </AtTabs>
                }
            </>
        );
    }
}
export default injectIntl(ConfigureUniqueFields)