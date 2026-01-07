import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import AlertModal from '../../pages/dynamicpreregdesign/AlertModal';
import PortalModal from '../../PortalModal';

const PortalModalSlideout = (props) => {
    return (
        <PortalModal>
          <Modal
            centered
            scrollable
            bsPrefix = "model model_zindex"
            show={props.show}
            onHide={props.closeModal}
            dialogClassName="modal-fullscreen"
            backdrop="static"
            keyboard={false}
            enforceFocus={false}
            aria-labelledby="example-custom-modal-styling-title">
              <Modal.Header className="d-flex align-items-center">
                    <Modal.Title id="add-user" className="header-primary flex-grow-1">
                        { props.esign === true ? <FormattedMessage id={"IDS_ESIGN"} defaultMessage="Esign" />
                            :props.screenName ? <FormattedMessage id={props.screenName} />: ""}
                    </Modal.Title>
                    <Button className="btn-user btn-cancel" variant="" onClick={props.closeModal}>
                        <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                    </Button>
                    {props.esign === true ?
                        <Button className="btn-user btn-primary-blue" onClick={() => props.handleSaveClick(3)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />
                        </Button>
                        : props.noSave?"":<Button className="btn-user btn-primary-blue" onClick={() => props.handleSaveClick(1)}>
                        <FontAwesomeIcon icon={faSave} /> { }
                        <FormattedMessage id='IDS_SAVE' defaultMessage='Save' />
                    </Button>
                    }
                </Modal.Header>
                <Modal.Body>
                    {/* <ModalInner> */}
                        {/* <Card.Body> */}
                            <React.Fragment>
                                <Form>
                                    {props.addComponent}
                                </Form>
                            </React.Fragment>
                        {/* </Card.Body> */}
                    {/* </ModalInner> */}
                </Modal.Body>
          </Modal>
          <AlertModal
                openAlertModal={props.openAlertModal}
                modalTitle={props.modalTitle}
                closeModal={props.closeAlertModal}
                onSaveClick={props.onSaveClick}
                modalBody={props.modalBody }
            />
        </PortalModal>
    );
};

export default injectIntl(PortalModalSlideout);