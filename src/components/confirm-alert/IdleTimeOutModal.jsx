import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { AtHeader, ProfileImage } from '../header/header.styles';
import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import { FormattedMessage, injectIntl } from 'react-intl';
import { intl } from '../../components/App';
import { ModalInner } from '../App.styles';
import FormInput from '../form-input/form-input.component';
import { Media } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { createImageFromInitials } from '../header/headerutils';
import { Form } from 'react-bootstrap';

const IdleTimeOutModal = (props) => {

    const { settings, userImagePath, profileColor } = props.Login
    const { susername, suserrolename } = props.Login.userInfo;

    // const Completionist = () => <span>You are good to go!</span>;

    return (
        <Modal show={props.showIdleModal} dialogClassName="freakerstop" backdropClassName="idle-timer-backdrop">
            <Modal.Body>
                <ModalInner>
                    <Row>
                        <Col md="6" style={{ position: 'relative' }}>
                            <ProfileImage style={{ position: 'absolute', left: '70px', top: '19px' }}>
                                {settings && settings[5] && userImagePath && userImagePath !== "" ?
                                    <Image src={settings[5] + userImagePath}
                                        alt="avatar" className="rounded-circle mr-2" width="40" height="40" /> : <Image className="rounded-circle mr-2"
                                            src={createImageFromInitials(70, susername ? susername.charAt(0).toUpperCase() : "", profileColor)}
                                    />}
                            </ProfileImage>
                        </Col>
                        <Col bsPrefix="idleprofile col-md-8">
                            <AtHeader className="mb-3">
                                <Media bsPrefix="product-title-sub flex-grow-1" style={{ marginLeft: "9rem", marginTop: "2rem" }}>
                                    <Media.Body>
                                        <span className="user-name1">{susername}</span>
                                        <span className="user-role1">{suserrolename}</span>
                                    </Media.Body>
                                </Media>
                            </AtHeader>
                            <Form ref={props.passwordref}>
                                <Row style={{ marginLeft: "8rem" }}>
                                    <Col md="12">
                                        <FormInput
                                            name="password"
                                            label={intl.formatMessage({ id: "IDS_PASSWORD" })}
                                            type="password"
                                            required={true}
                                            isMandatory={"*"}
                                            placeholder={intl.formatMessage({ id: "IDS_PASSWORD" })}
                                            onChange={(event) => props.selectInputOnChange}
                                            onKeyUp={props.enterKeyLogin}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>

                    <React.Fragment>
                        <div className="moveanimation" style={{ 'margin-left': "2rem" }}>
                            <React.Fragment>
                                <Row>
                                    <Col style={{"font-weight":"bold"}}>
                                     { props.showForbiddenModal === true 
                                        ? props.intl.formatMessage({ id: "IDS_ACCESSDENNIED".concat(props.responseStatus) }) 
                                        :""}
                                    </Col>
                                </Row>
                                 <Row>
                                    <Col>
                                    { props.intl.formatMessage({ id: "IDS_YOURSESSIONWILLTIMEOUT" })}
                                    </Col>
                                </Row>
                                {/* { props.showForbiddenModal === true 
                                    ? props.intl.formatMessage({ id: "IDS_ACCESSDENNIED".concat(props.responseStatus) }) 
                                    : props.intl.formatMessage({ id: "IDS_YOURSESSIONWILLTIMEOUT" })} */}
                                <Countdown date={props.sessionExpired}
                                    onComplete={(event) => props.showIdleModal ? props.renderer(event) : ""} />
                            </React.Fragment>
                        </div>
                    </React.Fragment>

                </ModalInner>
                <div className="d-flex justify-content-end mt-2">
                    <Button className="btn-user btn-cancel" variant="" onClick={(event) => props.handleLogout(event)}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> { }
                        <FormattedMessage id='logout' defaultMessage={intl.formatMessage({ id: "IDS_LOGOUT" })} />
                    </Button>
                    <Button className="btn-user btn-primary-blue" variant="" onClick={(event) => props.handleLogin(event)}>
                        {/* <FormattedMessage id='login' defaultMessage='Login' /> */}
                        <FormattedMessage id='login' defaultMessage={intl.formatMessage({ id: "IDS_LOGIN" })} />
                    </Button>
                </div>

            </Modal.Body>
            {/* </Form> */}
        </Modal >
    )
}
export default injectIntl(IdleTimeOutModal);