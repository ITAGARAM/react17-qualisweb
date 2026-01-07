import { connect} from 'react-redux';
import '../../assets/styles/forbiddenAccess.css'
import React from 'react';
import { Col, Container, Image, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import AccessDenied from '../../assets/image/Access Denied.png'
import { logOutAuditAction } from '../../actions';

const ForbiddenAccess=(props)=>{   
    
       return (
    <>
    <Container>
        <Row>
            <Col md={6}>
            <Image src={AccessDenied} rounded></Image>
            </Col>
            <Col md={6}>
            <div className="forbidden-container">
                    <h1>403</h1>
                    <p>Forbidden: You don't have permission to access this page.</p>
                    <p>Click Here !!! to go back to <Nav.Link name="IDS_LOGOUT" className="add-txt-btn" onClick={()=>logOut(props)} >       
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id='IDS_LOGOUT' defaultMessage='IDS_LOGOUT'/>
                        </Nav.Link></p>        
                </div>
            </Col>
        </Row>
    </Container>
    </>       
    );
}

const mapStateToProps=(state)=>{
    return {
        Login: state.Login
      }
}

const logOut=(props)=>{
    const inputData = {
        userinfo: props.Login.userInfo,
        scomments: props.intl.formatMessage({ id: "IDS_LOGOUT" }),
        sauditaction: "IDS_LOGOUT"
      };
      props.logOutAuditAction(inputData, props.Login.languageList);
    }


export default connect(mapStateToProps,{logOutAuditAction})(injectIntl(ForbiddenAccess))