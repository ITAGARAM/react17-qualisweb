import React from 'react'
import { Card, Row, Col, FormGroup, FormLabel } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { ReadOnlyText } from '../../components/App.styles';
import { designProperties } from '../../components/Enumeration';
import {faCloudDownloadAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  FontIconWrap } from '../../../src/components/data-grid/data-grid.styles';
import {dynamicFileDownload} from '../../../src/actions/ServiceAction';
import { connect } from 'react-redux';
import { Background } from 'react-flow-renderer';
import { Color } from 'react-input-color';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
class viewRecord extends React.Component {
    render() {
       const data = this.props.data || []
       const values = this.props.values || []
       //const jsondata = this.props.data
       let displayFields =  this.props.displayFields || []
        return (
            <Card className="border-0">
                <Card.Body>
                    {// ALPD-5419 - Gowtham R - 14/02/2025 - SubContractor - Screen Bugs
                    }<Col>
                         {displayFields && displayFields.map((jsondata,i)=>
                        <Row>
                        {jsondata && jsondata.map((field, index) =>
                            // ALPD-950
                            <Col md={this.props.size ? this.props.size : 6} key={index}>
                                <FormGroup>
                                    <FormLabel>
                                        <FormattedMessage
                                            id={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"}
                                            message={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"} />
                                    </FormLabel>
                                    <ReadOnlyText>{values[i][field[designProperties.VALUE]] || "-"}
                                    {field && field[3] === 'files' ?
                                        <FontIconWrap icon={faCloudDownloadAlt} className="ml-2 className action-icons-wrap" size="lg"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                            data-place="left"
                                            onClick={() => this.props.dynamicFileDownload({field,...jsondata ,viewName:'InfoView',userInfo:this.props.userInfo})}>
                                            <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                        </FontIconWrap> : ""
                                    }</ReadOnlyText>
                                   
                                </FormGroup>
                            </Col>
                        )}
                 
                            <div className='border-between'                           
                            />
                        </Row>
                        )} 
                        
                        {/* {this.props.SingleItem && this.props.SingleItem.map((field, index) =>
                            // ALPD-950
                            <Col md={this.props.size ? this.props.size : 6} key={index}>
                                <FormGroup>
                                    <FormLabel>
                                        <FormattedMessage
                                            id={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"}
                                            message={field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] || "-"} />
                                    </FormLabel>
                                    <ReadOnlyText>{jsondata[field[designProperties.VALUE]] || "-"}
                                    {field && field[3] === 'files' ?
                                        <FontIconWrap icon={faCloudDownloadAlt} className="ml-2 className action-icons-wrap" size="lg"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                            data-place="left"
                                            onClick={() => this.props.dynamicFileDownload({field,...jsondata ,viewName:'InfoView',userInfo:this.props.userInfo})}>
                                            <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                        </FontIconWrap> : ""
                                    }</ReadOnlyText>
                                   
                                </FormGroup>
                            </Col>
                        )} */}



                    </Col>
                </Card.Body>
            </Card>

        )
    }
}

export default connect(mapStateToProps,{dynamicFileDownload})(injectIntl(viewRecord));