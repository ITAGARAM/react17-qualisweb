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

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
class ReleaseSampleInfo extends React.Component {
    render() {
        var jsondata =  JSON.parse(this.props.data.value);
        var sarno =  this.props.sarno;
        var sreleaseno = this.props.sreportno;
        //var jsondata =  this.props.data.value;
        //var jsondata =  this.props.data;
        return (



            <Card className="border-0">
                <Card.Body>
                {/* <h3>{"IDS_RELEASESAMPLEINFO"} </h3>

                <FormLabel>
                                        <FormattedMessage
                                            id={"IDS_RELEASESAMPLEINFO" || "-"}
                                            message={"IDS_RELEASESAMPLEINFO" || "-"} />
                                    </FormLabel> */}




                    <Row>
                        
                        {/* { */}
                        
                            
                             {/* <Col md={12}>  */}
                             <Col md={4}>

                             <FormGroup>
              <FormLabel>
                                        
                                            <span> {"ReleaseNo :" }</span>
                                            
                                    </FormLabel>
              <ReadOnlyText>
              
            
            <span>{sreleaseno}</span>
            </ReadOnlyText>
            </FormGroup>
            </Col>

            <Col md={4}>

                             <FormGroup>
              <FormLabel>
                                        
                                            <span> {"ARNo :" }</span>
                                            
                                    </FormLabel>
              <ReadOnlyText>
              
            
            <span>{sarno}</span>
            </ReadOnlyText>
            </FormGroup>
            </Col>

                                   
                                    
                                        
                                         {
        Object.keys(jsondata).map((key, i) => (
            <Col md={4} key={i}>
          {/* <p key={i}> */}
              <FormGroup>
              <FormLabel>
                                        {/* <FormattedMessage
                                            id={{key} || "-"}
                                            message={{key} || "-"} /> */}
                                            <span> {key}</span>
                                            <span> :</span>
                                    </FormLabel>
              <ReadOnlyText>
              {/* <span> {key}</span> */}
            
            {/* <span>{jsondata[key].length>0?jsondata[key]:"-"}</span> */}
            <span>{jsondata[key]!==""?jsondata[key]:"-"}</span>
            </ReadOnlyText>
            </FormGroup>
            </Col>
        //   </p>
        ))
        }

                                    
                                    
                                    
                            {/* </Col> */}
                        
                        {/* } */}
                    </Row>
                </Card.Body>
            </Card>

        )
    }
}

export default connect(mapStateToProps)(injectIntl(ReleaseSampleInfo));