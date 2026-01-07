import { LocalizationProvider } from '@progress/kendo-react-intl';
import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
// import ReactTooltip from 'react-tooltip';
import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';
import { ReadOnlyText } from '../../components/App.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Tabs, { TabPane } from "rc-tabs";
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { formCode, SampleType } from '../../components/Enumeration';
import 'rc-tabs/assets/index.css';
import { Col, Row, Card } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

class ConfigureSendToStoreFields extends React.Component {
    constructor(props) {
        super(props);

        const screens = [{ eventKey: 'Sample', name: "Sample" }];
        // if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedjoballocation === true)  {
        //     screens.push({ eventKey: 'joballocation', name: "IDS_JOBALLOCATION", formcode: formCode.JOBALLOCATION });
        // }

        // if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedmyjob === true) {
        //     screens.push({ eventKey: 'myjobs', name: "IDS_MYJOBS", formcode: formCode.MYJOBS });
        // }
        if (this.props.needSubSample === true) {
            screens.push({ eventKey: 'SubSample', name: "IDS_SUBSAMPLE" });
        }
        // let extractedColumnList = [];
        // if (this.props.selectedTemplateType === SampleType.Masters) {
        //     extractedColumnList.push(
        //         { "title": "IDS_GRIDITEM", "field": "griditem", "width": "600px" },
        //         { "title": "IDS_GRIDMOREITEM", "field": "gridmoreitem", "width": "600px" }
        //     );
        // }
        // else {
        //     extractedColumnList.push(
        //         { "title": "IDS_EDITABLESTATUS", "field": "editablestatus", "width": "600px" },

        //     );
        // }
        this.state = {
            screens,
            // extractedColumnList,
            selectedScreen: { eventKey: 'Sample', name: "Sample" }
        }
    }
    onTabChange = (tab) => {
        this.setState({
            selectedScreen: this.state.screens.find(screen => screen.eventKey === tab)
        })
    }
    render() {

        return (
            <>
                {this.props.selectedTemplateType === SampleType.Masters ?
                    <PerfectScrollbar>
                        {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                        <AtTableWrap className="at-list-table">
                            <LocalizationProvider language="lang">
                                <>

                                </>
                            </LocalizationProvider>
                        </AtTableWrap>
                        {/* <ReactTooltip /> */}
                    </PerfectScrollbar>

                    :
                    <AtTabs>
                        <Tabs activeKey={this.state.selectedScreen.eventKey} moreIcon="..." onChange={this.onTabChange}>
                            {this.state.screens.map(screen =>
                                <TabPane name={screen.eventKey} tab={this.props.intl.formatMessage({ id: screen.name })} key={screen.eventKey}>
                                    <PerfectScrollbar>
                                        {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                                        <AtTableWrap className="at-list-table">
                                            <LocalizationProvider language="lang">
                                                <Card className="border-0">

                                                    <Card.Header>
                                                        <Row>
                                                            <Col md={6}>
                                                                <ReadOnlyText>
                                                                    <FormattedMessage id="IDS_FIELDS" message="Fields" />
                                                                </ReadOnlyText>
                                                            </Col>
                                                            <Col md={6}>
                                                                <ReadOnlyText>
                                                                    <FormattedMessage id="IDS_MAPPINGFIELD" message="Mapping Field" />
                                                                </ReadOnlyText>
                                                            </Col>
                                                        </Row>
                                                    </Card.Header>
                                                    <Card.Body style={{height:"350px"}} >
                                                        <Row>
                                                            <Col md={6}>

                                                                <ReadOnlyText>{this.props.intl.formatMessage({ id: 'IDS_QUANTITY' })}</ReadOnlyText>

                                                            </Col>
                                                            <Col md={6}>

                                                                <FormSelectSearch
                                                                    // name={this.props.intl.formatMessage({ id: 'IDS_QUANTITY' })}
                                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                    options={this.state.selectedScreen.eventKey === "SubSample" ? this.props.SampleList || [] : this.props.MainSampleList || []}
                                                                    optionId="value"
                                                                    optionValue="label"
                                                                    value={this.state.selectedScreen.eventKey === "SubSample" ? this.props.selectedRecord.SubQuantity === undefined ? this.props.selectedValue && this.props.selectedValue.SubQuantity || [] :
                                                                        this.props.selectedRecord.SubQuantity || [] : this.props.selectedRecord.Quantity === undefined ?
                                                                        this.props.selectedValue && this.props.selectedValue.Quantity || [] : this.props.selectedRecord.Quantity || []}
                                                                    isSearchable={false}
                                                                    isMandatory={false}
                                                                    isClearable={true}
                                                                    isDisabled={false}
                                                                    onChange={(event) => this.props.onComboChange(event, 'Quantity', this.state.selectedScreen.eventKey)}
                                                                    closeMenuOnSelect={true}
                                                                    alphabeticalSort={true}
                                                                />
                                                            </Col>
                                                            <Col md={6}>
                                                                <ReadOnlyText> {this.props.intl.formatMessage({ id: 'IDS_UNIT' })}</ReadOnlyText>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormSelectSearch

                                                                    //  name={this.props.intl.formatMessage({ id: 'IDS_QUANTITY' })}
                                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                    options={this.state.selectedScreen.eventKey === "SubSample" ? this.props.SubSampleList || [] : this.props.MainSubSampleList || []}
                                                                    optionId="value"
                                                                    optionValue="label"
                                                                    value={this.state.selectedScreen.eventKey === "SubSample" ? this.props.selectedRecord.SubUnit === undefined ? this.props.selectedValue && this.props.selectedValue.SubUnit || [] : this.props.selectedRecord.SubUnit || [] : this.props.selectedRecord.Unit === undefined ? this.props.selectedValue && this.props.selectedValue.Unit || [] : this.props.selectedRecord.Unit || []}
                                                                    isMandatory={false}
                                                                    isClearable={true}
                                                                    disableSearch={false}
                                                                    isSearchable={false}
                                                                    isDisabled={false}
                                                                    onChange={(event) => this.props.onComboChange(event, 'Unit', this.state.selectedScreen.eventKey)}
                                                                    closeMenuOnSelect={true}
                                                                    alphabeticalSort={true}
                                                                />
                                                                {/* </FormGroup> */}
                                                            </Col>
                                                        </Row>

                                                    </Card.Body>
                                                </Card>


                                            </LocalizationProvider>
                                        </AtTableWrap>
                                        {/* <ReactTooltip /> */}
                                    </PerfectScrollbar>
                                </TabPane>
                            )}
                        </Tabs>
                    </AtTabs>
                }
            </>
        );
    }
}
export default injectIntl(ConfigureSendToStoreFields)