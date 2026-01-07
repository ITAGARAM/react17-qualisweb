import React, { Component } from "react";
import flowIcon1 from '../../assets/image/method-execution.svg';
import flowIcon2 from '../../assets/image/instrument-data.svg';
import flowIcon3 from '../../assets/image/spreadsheet.svg';
import flowIcon4 from '../../assets/image/workflows.svg';
import productImg from '../../assets/image/product-1.png';
import productImg2 from '../../assets/image/product-2.png';
import productImg3 from '../../assets/image/product-3.png';
import productImg4 from '../../assets/image/product-4.png';
import productImg5 from '../../assets/image/product-5.png';
import Logo from '../../assets/image/qualis-horizontal-logo.png';
import { LoginLeftContainer, LoginRightContainer, LogoContainer, WelcomeTxt, SubTxt, TagLine, VersionTxt, CardImgRight } from "../../components/login/login.styles";
import { Container, Row, Col, Card, Media, Image } from "react-bootstrap";
import SignIn from "../../components/sign-in/sign-in.component";
import { FormattedMessage } from "react-intl";
import Carousel from 'react-bootstrap/Carousel';
import {intl} from '../../components/App';
import iconScreenSize from '../../assets/image/product-image@3x.png'

class Login extends Component {
 
    render() {
        return (
            <>
                <Container fluid={true} className="px-0 login-fixed-top">
                    <Row noGutters={true} className="align-item-center"> 
                        <Col md="6" sm="6" xs="12">
                            <LoginLeftContainer>
                                <LogoContainer className="d-flex align-items-center ">
                                    <img src={Logo} alt="Lims-Logo" width="180" height="76" className="mr-2" />
                                </LogoContainer> 
                                <VersionTxt>
                                     <FormattedMessage id="IDS_VERSION" defaultMessage="Version" /> 11.0.0.2
                                </VersionTxt>
                                <WelcomeTxt className="mt-2">
                                    <FormattedMessage id="IDS_WELCOMETEXT" defaultMessage="Welcome to Qualis" />
                                    <SubTxt> LIMS</SubTxt>
                                </WelcomeTxt>
                                <TagLine>
                                    <FormattedMessage id="IDS_LIMSINFO" defaultMessage="Digital enabler for laboratories" />
                                </TagLine>
                                <SignIn {...this.props} />
                            </LoginLeftContainer>
                        </Col>
                        <Col md="6" sm="6" xs="12">                            
                            <LoginRightContainer>
                                <Card className="min-vh-100">
                                    <Card.Body>                                     
                                        <Carousel slide={false} controls={false} pause={true} className="px-4 pb-4" >
                                            <Carousel.Item className="text-center">                      
                                                <h5 className="media-heading mt-4"> <FormattedMessage id="IDS_LOGINTEXT_01" defaultMessage="Sample Management & Testing" /></h5>
                                                <p className="pt-2 login-text"><FormattedMessage id="IDS_SUBLOGINTEXT_01" defaultMessage="Dynamic Template based approach for testing different sample types Tracking of sample throughout its lifecycle." /></p>
                                                <Card.Img src={productImg} className="img-fluid" width="316" height="232" alt="Product-Bottom" />                
                                            </Carousel.Item>
                                            <Carousel.Item className="text-center">
                                                <h5 className="media-heading mt-4"><FormattedMessage id="IDS_LOGINTEXT_02" defaultMessage="Work Scheduling, Results Entry & Approval" /></h5>
                                                <p className="pt-2 login-text"><FormattedMessage id="IDS_SUBLOGINTEXT_02" defaultMessage="Schedule work for personnel & instruments, enter results, record instrument and material used and send for approval process with full data integrity & compliance." /></p>
                                                <Card.Img src={productImg2} className="img-fluid" width="316" height="232" alt="Product-Bottom" />                                                
                                            </Carousel.Item>
                                            <Carousel.Item className="text-center">
                                                <h5 className="media-heading mt-4"><FormattedMessage id="IDS_LOGINTEXT_03" defaultMessage="Configurable Workflows" /></h5>
                                                <p className="pt-2 login-text"><FormattedMessage id="IDS_SUBLOGINTEXT_03" defaultMessage="Create and manage workflows for various activities such as review, approval & release of tests, templates, reports, etc" /></p>
                                                <Card.Img src={productImg3} className="img-fluid" width="316" height="232" alt="Product-Bottom" />                                                
                                            </Carousel.Item>
                                            <Carousel.Item className="text-center">        
                                                <h5 className="media-heading mt-4"><FormattedMessage id="IDS_LOGINTEXT_04" defaultMessage="Accurate & Seamless Reports" /></h5>
                                                <p className="pt-2 login-text"><FormattedMessage id="IDS_SUBLOGINTEXT_04" defaultMessage="Create detailed reports on the fly, Automate Report generation, Approve & Release reports" /></p>     
                                                <Card.Img src={productImg4} className="img-fluid" width="316" height="232" alt="Product-Bottom" />   
                                            </Carousel.Item>
                                            <Carousel.Item className="text-center"> 
                                                <h5 className="media-heading mt-4"><FormattedMessage id="IDS_LOGINTEXT_05" defaultMessage="Alerts & Dynamic Dashboard" /></h5>
                                                <p className="pt-2 login-text"><FormattedMessage id="IDS_SUBLOGINTEXT_05" defaultMessage="Create alerts to take timely action on time sensitive tasks. Configure your own dashboard to get insight in key lab parameters." /></p>
                                                <Card.Img src={productImg5} className="img-fluid" width="316" height="232" alt="Product-Bottom" />                  
                                            </Carousel.Item>
                                        </Carousel>
                                    </Card.Body>
                                </Card>
                            </LoginRightContainer>
                        </Col>
                    </Row>
                </Container>
                <>
                  <div class="align-items-center login-info-portrait">
                    <img src={iconScreenSize} className="img-fluid border"  />
                    <h5 className='m-4 p-4 text-center'>"This message typically indicates that the application or website you're trying to access requires a screen resolution of 1024 pixels or wider to display properly. If you're using a tablet, please turn it to landscape mode. This requirement ensures a good user experience and proper layout."</h5>
                  </div>
                  
                  </>
            </>
        )
    }
}
export default Login;