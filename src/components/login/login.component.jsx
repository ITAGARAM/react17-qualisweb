import React from 'react';
import './login.styles.jsx';
import './App.styles.jsx';
import SignIn from '../sign-in/sign-in.component';
import flowIcon1 from '../../assets/image/method-execution.svg';
import flowIcon2 from '../../assets/image/instrument-data.svg';
import flowIcon3 from '../../assets/image/spreadsheet.svg';
import flowIcon4 from '../../assets/image/workflows.svg';
import productImg from '../../assets/image/product-image@3x.png'
import Logo from '../../assets/image/qualis-lims@3x.png';
import {LoginLeftContainer, LoginRightContainer, 
    LogoContainer, VersionTxt, WelcomeTxt, SubTxt,CardImgRight, TagLine} from './login.styles';
import { Container, Row, Col, Card, Image, Media } from 'react-bootstrap';


export const Login = props => (
    <Container fluid={true} className="px-0">
        <Row noGutters={true} className="align-items-center">
            <Col md="6" sm="6" xs="12">
                <LoginLeftContainer>
                    <LogoContainer className="d-flex align-items-center mb-4">
                        <img src={Logo} alt="Lims-Logo" width="180" height="76" className="mr-3" />
                        <VersionTxt>Version 5.1</VersionTxt>
                    </LogoContainer>
                    <WelcomeTxt>
                        Welcome to Qualis <SubTxt>LIMS</SubTxt> 
                    </WelcomeTxt>
                    <TagLine>We make it easier for everyone to resolve problems</TagLine>
                    {/* SignIn Component */}
                    <SignIn />
                </LoginLeftContainer>
            </Col>
            <Col md="6" sm="6" xs="12">
                <LoginRightContainer>
                    <Card>
                        <Card.Body>
                        <Card.Title>How we help your business</Card.Title>
                        <Media className="mb-4">
                            <Image className="align-self mr-4" src={flowIcon1} width={41} height={41} alt="Icon-1" />
                            <Media.Body>
                                <h5 className="media-heading">Method execution</h5>
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                                deserunt mollit anim id est laborum.
                            </Media.Body>
                        </Media>
                        <Media className="mb-4">
                            <Image className="align-self mr-4" src={flowIcon2} width={41} height={41} alt="Icon-2" />
                            <Media.Body>
                                <h5 className="media-heading">Spreadsheet templates</h5>
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                                deserunt mollit anim id est laborum.
                            </Media.Body>
                        </Media>
                        <Media className="mb-4">
                            <Image className="align-self mr-4" src={flowIcon3} alt="Icon-3" width={41} height={41} />
                            <Media.Body>
                                <h5 className="media-heading">Workflows</h5>
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                                deserunt mollit anim id est laborum.
                            </Media.Body>
                        </Media>
                        <Media className="mb-4">
                            <Image className="align-self-start mr-4" src={flowIcon4} alt="Icon-4" width={41} height={41} />
                            <Media.Body>
                                <h5 className="media-heading">Method execution</h5>
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                                deserunt mollit anim id est laborum.
                            </Media.Body>
                        </Media>
                        </Card.Body>
                        <CardImgRight>
                            <Card.Img src={productImg} className="img-fluid" width="416" height="232" alt="Product-Bottom" />
                        </CardImgRight>
                    </Card>
                </LoginRightContainer>
            </Col>
        </Row>
    </Container>
);