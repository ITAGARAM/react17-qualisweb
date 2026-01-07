import React from 'react';
import FormInput from '../components/form-input/form-input.component';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { MediaHeader } from './App.styles';

const AddLanguageSynonym = (props) => {
    let fieldName = props.fieldName || 'displayname'
    let jsondataKeys = [];
    delete (props.selectedJsondata['salertdisplaystatus']);
    jsondataKeys = Object.keys(props.selectedJsondata);
    const headerName = props.needheader;
    return (
        <Row>
            <Col>
                {
                    jsondataKeys.map((item) => {
                        return (
                            <>
                                {headerName && headerName === "true" ?
                                    <MediaHeader className='mb-3'>
                                        {props.intl.formatMessage({ id: "IDS_" + (fieldName = item).toUpperCase() })}
                                    </MediaHeader> : ""}
                                {fieldName === item ?
                                    props.languages.map(lang => {
                                        return (
                                            <FormInput
                                                label={lang.label}
                                                name={lang.value}
                                                type="text"
                                                onChange={(event) => props.onInputOnChange(event, lang.label, item, fieldName)}
                                                placeholder={lang.label}
                                                value={props.selectedFieldRecord[fieldName] && props.selectedFieldRecord[fieldName][lang.value] ? props.selectedFieldRecord[fieldName][lang.value] : ""}
                                                isMandatory={lang.value == "en-US" ? true : false}
                                                required={true}
                                                readOnly={false}
                                                maxLength={"35"}
                                            />
                                        );
                                    }
                                    ) : ""}


                            </>
                        )
                    }
                    )
                    //)
                }

            </Col>
        </Row>
    )
}
//     return (
//         name2.map(item =>
//             <>
//                 {screenName && screenName === "true" ? 
//                 <MediaHeader className='mb-3'>
//                     {fieldName=item}
//                 </MediaHeader>:""}
//             </>
//         )
//     )
// }
export default injectIntl(AddLanguageSynonym)