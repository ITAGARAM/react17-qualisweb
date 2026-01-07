import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faTimes } from '@fortawesome/free-solid-svg-icons';

class RestoreReleaseFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: false
        }
    }
    showMoreToggle = () => {
        this.setState({
            showMore: !this.state.showMore

        })
    }
    componentWillUpdate(previousProps) {
        if (this.props !== previousProps) {
        if(this.props.selectedRestoreFilter.nrestorefiltercode>1)
        {
             let showMore=false;
             this.setState({showMore});
            // this.setState({
            //     showMore: !this.state.showMore
    
            // })
        }
    }
    }
    render() {
          
        return (
            <div className="side_more_filter_wrap">
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SITENAME" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SITENAME" })}
                            name="nsitecode"
                            className='form-control'
                            options={this.props.Site}
                            value={this.props.selectedSite ? { "label": this.props.selectedSite.ssitename, "value": this.props.selectedSite.nsitecode } : ""}
                            optionId="nsitecode"
                            optionValue="ssitename"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => this.props.onFilterComboChange(event, "nsitecode")}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_FILTERTYPE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_FILTERTYPE" })}
                            name="nrestorefiltercode"
                            className='form-control'
                            options={this.props.RestoreFilter}
                            value={this.props.selectedRestoreFilter ? { "label": this.props.selectedRestoreFilter.srestorefiltername, "value": this.props.selectedRestoreFilter.nrestorefiltercode } : ""}
                            optionId="nrestorefiltercode"
                            optionValue="srestorefiltername"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => this.props.onFilterComboChange(event, "nrestorefiltercode")}
                        />
                    </Col>
                    {this.props.selectedRestoreFilter.nrestorefiltercode===1?
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_PURGEDATE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_PURGEDATE" })}
                            name="npurgemastercode"
                            className='form-control'
                            options={this.props.PurgeMaster}
                            value={this.props.selectedPurgeMaster ? { "label": this.props.selectedPurgeMaster.stodate, "value": this.props.selectedPurgeMaster.npurgemastercode } : ""}
                            optionId="npurgemastercode"
                            optionValue="stodate"
                            isMandatory={this.props.selectedRestoreFilter.nrestorefiltercode===1?true:false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => this.props.onFilterComboChange(event, "npurgemastercode")}
                        />
                    </Col>
                    :
                    this.props.selectedRestoreFilter.nrestorefiltercode===2 ?
                    <Col md={12}>
                    <FormInput
                    label={this.props.intl.formatMessage({ id: "IDS_RELEASENO" })} 
                    name={"sreleaseno"}
                    type="text"
                    onChange={(event) => this.props.onInputOnChange(event)}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_RELEASENO" })}
                    value={this.props.selectedRecord ? this.props.selectedRecord["sreleaseno"] : ""}
                    isMandatory={this.props.selectedRestoreFilter.nrestorefiltercode===2?true:false}
                    required={true}
                    maxLength={"50"}
                />
                    </Col>
                    :
                    <Col md={12}>
                    <FormInput
                    label={this.props.intl.formatMessage({ id: "IDS_ARNO" })} 
                    name={"sarno"}
                    type="text"
                    onChange={(event) => this.props.onInputOnChange(event)}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_ARNO" })}
                    value={this.props.selectedRecord ? this.props.selectedRecord["sarno"] : ""}
                    isMandatory={this.props.selectedRestoreFilter.nrestorefiltercode===3?true:false}
                    required={true}
                    maxLength={"50"}
                />
                    </Col>
    }

{!this.state.showMore && this.props.selectedRestoreFilter && this.props.selectedRestoreFilter.nrestorefiltercode === 1 ? <button className="btn_sidebar_open" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faAngleDoubleRight} /> </button> : ''}
                    <div className={`side_more_filter ${this.state.showMore ? 'active' : ''} `} >
                        <button className="btn_sidebar_close" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faTimes} /> </button>
                        <Row>
                        {this.props.selectedRestoreFilter.nrestorefiltercode===1?
                        <Col md={12}>
                    <FormInput
                    label={this.props.intl.formatMessage({ id: "IDS_RELEASENO" })} 
                    name={"smorereleaseno"}
                    type="text"
                    onChange={(event) => this.props.onInputOnChange(event)}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_RELEASENO" })}
                    value={this.props.selectedRecord ? this.props.selectedRecord["smorereleaseno"] : ""}
                    isMandatory={false}
                    required={true}
                    maxLength={"50"}
                />
                    
                               
                                
                    <FormInput
                    label={this.props.intl.formatMessage({ id: "IDS_ARNO" })} 
                    name={"smorearno"}
                    type="text"
                    onChange={(event) => this.props.onInputOnChange(event)}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_ARNO" })}
                    value={this.props.selectedRecord ? this.props.selectedRecord["smorearno"] : ""}
                    isMandatory={false}
                    required={true}
                    maxLength={"50"}
                />
                                    
                                
                            
                            </Col>
                            :
                            ""
                           
                            
                        }
                        
                        </Row>
                    </div>
                </Row>

            </div>
        );
    }
}
export default injectIntl(RestoreReleaseFilter)