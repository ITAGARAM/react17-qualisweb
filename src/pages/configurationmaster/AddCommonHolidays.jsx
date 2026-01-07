import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';

const AddCommonHolidays = (props) => {
    return (
        <Row>
            <Col md={6} >
                <Row>
                    <Col md={12} className="border">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_SUNDAY" })}
                            type="switch"
                            name={"nsunday"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SUNDAY" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nsunday"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nsunday"] === 3 ? true : false : false}
                        >
                        </CustomSwitch>
                    </Col>
                    <Col md={12} className="border">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_MONDAY" })}
                            type="switch"
                            name={"nmonday"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MONDAY" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nmonday"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nmonday"] === 3 ? true : false : false}
                        >
                        </CustomSwitch>
                    </Col>
                    <Col md={12} className="border">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_TUESDAY" })}
                            type="switch"
                            name={"ntuesday"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_TUESDAY" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["ntuesday"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["ntuesday"] === 3 ? true : false : false}
                        >
                        </CustomSwitch>
                    </Col>
                    <Col md={12} className="border">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_WEDNESDAY" })}
                            type="switch"
                            name={"nwednesday"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_WEDNESDAY" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nwednesday"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nwednesday"] === 3 ? true : false : false}
                        >
                        </CustomSwitch>
                    </Col>
                </Row>
            </Col>
            <Col md={6}>
                <Row>
                    <Col md={12} className="border">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_THURSDAY" })}
                            type="switch"
                            name={"nthursday"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_THURSDAY" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nthursday"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nthursday"] === 3 ? true : false : false}
                        >
                        </CustomSwitch>
                    </Col>
                    <Col md={12} className="border">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_FRIDAY" })}
                            type="switch"
                            name={"nfriday"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_FRIDAY" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nfriday"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nfriday"] === 3 ? true : false : false}
                        >
                        </CustomSwitch>
                    </Col>
                    <Col md={12} className="border">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_SATURDAY" })}
                            type="switch"
                            name={"nsaturday"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SATURDAY" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nsaturday"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nsaturday"] === 3 ? true : false : false}
                        >
                        </CustomSwitch>
                    </Col>
                </Row>
            </Col>



        </Row>
    )
}
export default injectIntl(AddCommonHolidays);