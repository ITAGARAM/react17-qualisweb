import React from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddMaterialSafetyInstructionTab = (props) => {
    const style1 = {
        "margin-top": "30px"
    }
    return (
        <Row>
            <Col md={12}>
                <InputGroup size={'lg'}>
                    <Form.Group>
                        <Form.Label as="legend" ></Form.Label>
                        <Row>
                            {props.checkboxListL.map((temp) => {
                                return <Col md={6}>  <div style={style1}> <Form.Check
                                    inline={true}
                                    type="checkbox"
                                    name={temp.label}
                                    label={temp.label}
                                    onChange={(event) => props.onInputOnChange(event)}
                                    defaultChecked={props.selectedRecord[temp.label] === 3 ? true : false}
                                    required={true}
                                    size={'lg'}
                                />


                                </div> </Col>
                            })}
                            {props.checkboxListR.map((temp) => {
                                return <Col md={6}>  <div style={style1}> <Form.Check
                                    inline={true}
                                    type="checkbox"
                                    name={temp.label}
                                    label={temp.label}
                                    onChange={(event) => props.onInputOnChange(event)}
                                    defaultChecked={props.selectedRecord[temp.label] === 3 ? true : false}
                                    isMandatory={true}
                                    required={true}
                                    size={'lg'}
                                /></div> </Col>
                            })}
                        </Row>
                        <div style={style1}>
                            <Form.Label as="legend" >Safety Properties(NFPA Rating)</Form.Label>
                        </div>
                        <Row>
                            <Col md={6}>
                                <div style={style1}>

                                    <FormTextarea
                                        name={'Health'}
                                        label={'Health'}
                                        type="text"
                                        value={props.selectedRecord && props.selectedRecord['Health']}
                                        isMandatory={false}
                                        required={true}
                                        onChange={(event) => props.onInputOnChange(event, 'Health')}
                                        rows="2"
                                        maxLength={255}
                                        isDisabled={false}
                                    /></div>
                                <div style={style1}>
                                    <FormTextarea
                                        name={'Reactivity'}
                                        label={'Reactivity'}
                                        type="text"
                                        value={props.selectedRecord && props.selectedRecord['Reactivity']}

                                        isMandatory={false}
                                        required={true}
                                        onChange={(event) => props.onInputOnChange(event, 'Reactivity')}
                                        rows="2"
                                        maxLength={255}
                                        isDisabled={false}
                                    /></div>
                            </Col>
                            <Col md={6}>
                                <div style={style1}>

                                    <FormTextarea
                                        name={'Flammable'}
                                        label={'Flammable'}
                                        type="text"
                                        value={props.selectedRecord && props.selectedRecord['Flammable']}
                                        isMandatory={false}
                                        required={true}
                                        onChange={(event) => props.onInputOnChange(event, 'Flammable')}
                                        rows="2"
                                        maxLength={255}
                                        isDisabled={false}
                                    /></div>
                                <div style={style1}>
                                    <FormTextarea
                                        name={'Specific'}
                                        label={'Specific'}
                                        type="text"
                                        value={props.selectedRecord && props.selectedRecord['Specific']}
                                        isMandatory={false}
                                        required={true}
                                        onChange={(event) => props.onInputOnChange(event, 'Specific')}
                                        rows="2"
                                        maxLength={255}
                                        isDisabled={false}
                                    /></div>
                            </Col>
                        </Row>
                    </Form.Group>

                </InputGroup >
            </Col>

        </Row >
    );
}

export default injectIntl(AddMaterialSafetyInstructionTab);