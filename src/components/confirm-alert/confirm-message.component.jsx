import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CustomAlert, CustomAlertFooter } from '../confirm-alert/confirm-alert-styles';
import '../../pages/registration/registration.css';
import Countdown from 'react-countdown';

class ConfirmMessage extends React.Component {

  confirm = (
    name,
    title,
    message,
    doLabel,
    doNotLabel,
    handleClickDelete,
    isOkOnly, handleCancelClick,
    isMaintaince // Gowtham R -- ALPD-5190 -- 14/12/2024 -- for Vacuum Start
  ) => {

    confirmAlert({
      customUI: ({ onClose }) => {
        {isMaintaince && setTimeout(()=>{ onClose() }, isMaintaince)} // Gowtham R -- ALPD-5190 -- 14/12/2024 -- for Vacuum Start
        return (
          <CustomAlert>
            <Card>
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text className="confirm_AlertWindowSize">
                  {message}
                  {isMaintaince ? 
                    <Countdown date={Date.now() + isMaintaince} />
                    : "" }
                </Card.Text>
              </Card.Body>
              {doNotLabel || doLabel ? // Gowtham 
              <CustomAlertFooter>
                {doNotLabel && <Button className={`btn-user ${isOkOnly ? "btn-primary-blue" : "btn-cancel"}`} variant="" onClick={() => {
                  handleCancelClick && handleCancelClick();
                  onClose();
                }}>{doNotLabel}</Button>}
                {doLabel && <Button className="btn-user btn-primary-blue" onClick={() => {
                  handleClickDelete();
                  onClose();
                }}>{doLabel}</Button>}
              </CustomAlertFooter>
               : ""}
            </Card>
          </CustomAlert>
        );
      }, closeOnClickOutside: false, closeOnEscape: false
    });
  };
}
export default ConfirmMessage;