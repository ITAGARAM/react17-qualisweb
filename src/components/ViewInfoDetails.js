import React, {Component} from 'react';
import { Row, Col,Nav } from 'react-bootstrap';
import { ReadOnlyText } from "../components/App.styles";
import { FormGroup, FormLabel } from "react-bootstrap";
import { injectIntl, FormattedMessage } from 'react-intl';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SlideOutModal from "../components/slide-out-modal/SlideOutModal";
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { rearrangeDateFormatDateOnly } from './CommonScript';

class ViewInfoDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }
  toggleIsActive = () => {
    this.setState({isActive: !this.state.isActive});
  };  
  render(){
    return(
      <>
        <Nav.Link className="btn btn-circle outline-grey mr-2" name="edittestname"
            hidden={this.props.screenHiddenDetails}
            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.dataTip}                              
            onClick={this.toggleIsActive}>
            <FontAwesomeIcon icon={faEye} />
        </Nav.Link>    
        {this.state.isActive?
          <SlideOutModal
            show={true}
            size={"lg" }
            closeModal={this.toggleIsActive}
            hideSave={ true }
            // operation = "view"
            screenName="View"
            inputParam = {{"operation":"view"}}   
            mandatoryFields={ this.mandatoryFields} 
            addComponent={<Row>
            {this.props.rowList &&
              <Col md={12} className='p-0'>
                {this.props.rowList.map(componentrow =>
                  <Row>
                    {componentrow.map(componentColumn =>
                      <Col>
                     { componentColumn.hidden === false ?
                        <>
                         <Nav.Link  className="btn btn-circle outline-grey mr-2 mt-3"
                                    hidden={componentColumn.hidden}
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                    onClick={() =>componentColumn.onClick(this.props.selectedObject, this.props.userInfo)}>
                              <FontAwesomeIcon icon={faCloudDownloadAlt} />
                        </Nav.Link>
                        </> 
                        : componentColumn.idsName && (
                        <FormGroup>                                            
                          <FormLabel><FormattedMessage id={componentColumn.idsName}/></FormLabel>                                
                          <ReadOnlyText className='text-break'>{componentColumn.dateOnly ?
                          rearrangeDateFormatDateOnly(this.props.userInfo,this.props.selectedObject[componentColumn.dataField]):this.props.selectedObject[componentColumn.dataField]}</ReadOnlyText>
                        </FormGroup>
                        
                      ||"")
                    }
                        
                      </Col>
                    )}
                  </Row>                 
                )}
              </Col>

             
            }</Row>
          
          }                    
          />: ''
        }
          
      </>
    );
  }
}
export default injectIntl(ViewInfoDetails);