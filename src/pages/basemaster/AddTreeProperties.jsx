import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';

const AddTreeProperties = (props) => {
    return (
        <Row>          
            {/* <Col md={12}>
                <CustomSwitch
                    id={"locationlastnode"}
                    name={"locationlastnode"}
                    type={"switch"}
                    label={props.intl.formatMessage({ id: "IDS_LOCATIONEND" })}
                    className={"custom-switch-md"}
                    checked={props.selectedRecord === undefined ? false : props.selectedRecord["locationlastnode"] }
                    defaultValue={props.selectedRecord === undefined ? false : props.selectedRecord["locationlastnode"] }
                    onChange={props.onInputChange}
                    
                />
            </Col>
            <Col md={12}>
                <CustomSwitch
                    id={"containerfirstnode"}
                    name={"containerfirstnode"}
                    type={"switch"}
                    label={props.intl.formatMessage({ id: "IDS_STORAGESTART" })}
                    className={"custom-switch-md"}
                    checked={props.selectedRecord === undefined ? false : props.selectedRecord["containerfirstnode"] }
                    defaultValue={props.selectedRecord === undefined ? false : props.selectedRecord["containerfirstnode"] }
                    onChange={props.onInputChange}
                    
                />
            </Col> */}
            <Col md={12}>
                <CustomSwitch
                    id={"containerlastnode"}
                    name={"containerlastnode"}
                    type={"switch"}
                    label={props.intl.formatMessage({ id: "IDS_STORAGEEND" })}
                    className={"custom-switch-md"}
                    checked={props.selectedRecord === undefined ? false : props.selectedRecord["containerlastnode"] }
                    defaultValue={props.selectedRecord === undefined ? false : props.selectedRecord["containerlastnode"] }
                    onChange={props.onInputChange}
                    
                />
            </Col>
        </Row>
    )
}
export default injectIntl(AddTreeProperties);