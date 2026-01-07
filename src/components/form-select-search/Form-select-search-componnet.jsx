import React from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { injectIntl } from 'react-intl';




class FormSelectSearchComponent extends React.Component{
    constructor(props) {
        super(props)
    }

render(){
    return (

        < React.Fragment  >
            <Form.Group onKeyUp={this.props.onKeyUp} className={`form-select w-100 floating-label react-select-wrap ${this.props.formGroupClassName ? this.props.formGroupClassName : ""}`} controlId={this.props.name}>
                <Select
                //   menuIsOpen
                    ref={ this.props.select  }
                    inputId={this.props.name}
                    id={this.props.name}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    options={this.props.options}
                    value={this.props.value}
                    isInvalid={this.props.isInvalid}
                    required={this.props.required}
                    defaultValue={this.props.defaultValue}
                    isMulti={this.props.isMulti}
                    isSearchable={this.props.isSearchable}
                    isDisabled={this.props.isDisabled}
                    isClearable={this.props.isClearable}
                    onChange={this.props.onChange}
                    onBlur={this.props.onBlur}
                    closeMenuOnSelect={this.props.closeMenuOnSelect}
                    className={this.props.className}
                    classNamePrefix="react-select"
                    minMenuHeight={this.props.minMenuHeight}
                    maxMenuHeight={this.props.axMenuHeight}
                    openMenuOnFocus={true}
                    menuPlacement={"auto"}
                    autoComplete="off"
                    menuPosition={this.props.menuPosition}
                    //  openMenuOnFocus={true}
                    noOptionsMessage={() => this.props.intl.formatMessage({ id: "IDS_NOOPTIONS" })}
                // menuPortalTarget={document.querySelector('body')}
                // menuPosition="absolute"
                // styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}

                />
                <Form.Label htmlFor={this.props.name}>{this.props.formLabel}{this.props.isMandatory && <sup>*</sup>}</Form.Label>
                <Form.Control.Feedback type="invalid">
                    {this.props.errors}
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment >
    )
}
    


};
export default injectIntl(FormSelectSearchComponent);