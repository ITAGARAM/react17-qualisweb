import { faBolt, faCalculator, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { ModalInner } from '../../components/App.styles';
class FilterCondition extends React.Component {
    render() {
        return (
            <Modal show={this.props.openAlertModal}
                onHide={this.closeModal}
                backdrop="static"
                className="dashboard-parameter"
                size="xl"
                dialogClassName="freakerstop">
                <Modal.Header className="d-flex align-items-center">
                    <Modal.Title id="create-password" className="header-primary flex-grow-1">
                        <FormattedMessage id={this.props.modalTitle} />
                    </Modal.Title>
                    <Button className="btn-user btn-cancel" variant="" onClick={this.props.closeModal}>
                        <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                    </Button>
                    {/* <Button className="btn-user btn-primary-blue" onClick={this.props.onSaveClick}>
                        <FontAwesomeIcon icon={faSave} /> { }
                        <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />
                    </Button> */}
                </Modal.Header>
                <Modal.Body>
                    <ModalInner>
                        <Card.Body>
                            {this.props.modalBody}
                        </Card.Body>

                    </ModalInner>
                </Modal.Body>
                <Modal.Footer className={`${this.props.executeCenter ? "d-flex justify-content-center" : ""}`}>
                    {
                        this.props.executeCenter ?
                            <Button className="btn-user btn-primary-blue " onClick={this.props.onSaveClick}>
                           
                                <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />{'  '}
                                <FontAwesomeIcon icon={faBolt} /> 
                            </Button> :
                            <Button className="btn-user btn-primary-blue " onClick={this.props.onSaveClick}>
                                <FontAwesomeIcon icon={faCalculator} /> { }
                                <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />
                            </Button>

                    }


                </Modal.Footer>
            </Modal>
        );

    }
}
export default injectIntl(FilterCondition);
