import React from "react";
import { injectIntl } from "react-intl";
import {  Row, Col, Modal,Container,Image  } from 'react-bootstrap';
//import { ReadOnlyText } from '../../components/App.styles';
//import Logo from '../../assets/image/qualis-lims@3x.png';
import PrimaryLogo from '../../assets/image/sidebar-logo.png';
// import {LoginLeftContainer, LoginRightContainer, 
//     LogoContainer, VersionTxt, WelcomeTxt, SubTxt,CardImgRight, TagLine} from '..//..//components//login//login.styles';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

    const About = (props)=>{

    const jsondata = props.aboutInfo;
    const width = props.width;
    const height = props.height;
    // console.log("Object.entries(jsondata).size:", Object.entries(jsondata).length);
    // //const height = Object.entries(jsondata).size === 1 ? '800' : props.height;
    // const height = Object.entries(jsondata).length === 1 ? '800px' : props.height;
    // console.log("length:",height);

    return( 
        <>
          <Modal show={props.isOpen} onHide={()=>props.closeAbout()} size={Object.entries(jsondata).length === 1 ? "md":"xl"} 
                centered backdrop="static" keyboard={false} //</>height={height} width={width}>
           > 
          <div className="about-logo-dummy "></div>
            <div>
                <Container fluid={true} className="px-0">
                    <div className="about-logo" style={{position:"relative"}}>
                        <Row >
                            <Col md="2" className=" align-self-center">
                                <div className="d-flex align-items-center" >                    
                                    <Image src={PrimaryLogo} alt="Primary-Logo" width="55" className="mt-auto" style={{margin:"auto"}}/>
                                </div>
                            </Col>
                            <Col md="10" className="bg-white">
                                <Modal.Header closeButton className="border-0 pb-0">
                                    <strong> <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />{props.intl.formatMessage({
                                            id: "IDS_ABOUT",
                                            })}
                                    </strong> 
                                </Modal.Header>
                                <Modal.Body>
                                    
                                    {jsondata && Object.entries(jsondata).map(([key, value]) => (
                                        // <>
                                        // <span key={key}>{`${value['label']} : ${value['value']}`}</span><br/>
                                        // </>                                        
                                        <Row key={key}>
                                            <Col md="5"><span>{value['label']} </span></Col>
                                            <Col md="1">:</Col>
                                            <Col md="5"> {value['value']}</Col>
                                        </Row>
                                     ))}                         
                                </Modal.Body>
                            </Col>
                         </Row>
                    </div>
                </Container>
            </div>
            
            {/* <div>
                <Modal.Body>
            
                    {Object.entries(jsondata).map(([key, value]) => (
                    <ReadOnlyText key={key}>{`${key}: ${value}`}</ReadOnlyText>
                   ))}                         
              </Modal.Body>
            </div> */}
            
          </Modal>    
          </>
      )
}
export default injectIntl(About)