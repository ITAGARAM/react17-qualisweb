import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CustomAlert, CustomAlertFooter } from '../confirm-alert/confirm-alert-styles';
import { FontIconWrap } from '../data-grid/data-grid.styles';

class ConfirmDialog extends React.Component {

  confirm = ({
    name,
    title,
    cardTitle,
    message,
    doLabel,
    doNotLabel,
    handleClickDelete,
  }) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <CustomAlert>
            <Card>
              <Card.Body>
                <Card.Title>{cardTitle ? cardTitle : this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" })}</Card.Title>
                <Card.Text>
                  {message}
                </Card.Text>
              </Card.Body>
              <CustomAlertFooter>
                <Button className="btn-user btn-cancel" variant="" onClick={onClose}>{doNotLabel}</Button>
                <Button className="btn-user btn-primary-blue" onClick={() => {
                  handleClickDelete();
                  onClose();
                }}>{doLabel}</Button>
              </CustomAlertFooter>
            </Card>
          </CustomAlert>
        );
      }, closeOnClickOutside: false, closeOnEscape: false
    });
  };

  render() {
    const { icon, title, hidden, size, dataforprops,className } = this.props;

    return (
      // <FontAwesomeIcon icon={icon} size={size}
      //   data-for={ dataforprops}
      //   data-tooltip-id="my-tooltip" data-tooltip-content={title}
      //   data-place="left"
      //   hidden={hidden}
      //   onClick={() => this.confirm(this.props)}
      // />
      <FontIconWrap
        className = {className}  
        data-tooltip-id="my-tooltip" data-tooltip-content={title}
        data-for={ dataforprops}
        data-place="left"
        hidden={hidden}
        onClick={() => this.confirm(this.props)}
      >
        <FontAwesomeIcon icon={icon} />
      </FontIconWrap>
    );
  }
}
export default injectIntl(ConfirmDialog);