import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = (props) => (
    <Button
      type={props.type}
      className={props.className}
      onClick={props.handleClick}
      color=""
      disabled={props.disabled}
    >
      {props.label}
    </Button>
  );

export default CustomButton;
