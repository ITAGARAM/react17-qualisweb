import React from "react";
import './single-select-add-tag-component.css';
import { LabelNormal, DivWrap } from './single-select-add-tag-component.style';
import { Row, Col } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';

class SingleSelectAddTag extends React.Component {
  constructor(Props) {
    super(Props);
    this.state = { ...Props, inputValue: '', showAdd: false, filteredList: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.wrapperRef = React.createRef();
    // this.handleClickOutside = this.handleClickOutside.bind(this); 
  }
  handleChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'select-option':
        this.setState({
          value: newValue//actionMeta.option
        })
        this.props.getValue(newValue)
        // this.props.getValue(actionMeta.option)
        break;
      case 'clear':
        this.setState({
          value: []
        })
        break;
      case 'remove-value':
        this.setState({
          value: []
        })
        break;
      default:
        break;
    }
  }
  handleInputChange = (inputValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'input-change':
        // const re = new RegExp(inputValue, "i");
        let arr = [];
        if (inputValue && inputValue !== "") {
          arr = this.state.options.filter(({ value }) =>
            value && (value === inputValue)
          );
        } else {
          arr = this.state.options
        }
        let optionObj = { value: inputValue, label: inputValue }
        this.setState({
          inputValue: inputValue,
          value: optionObj
        });
        this.props.getValue(optionObj)
        break;
      case 'set-value':
        if (this.state.inputValue && this.state.inputValue !== "") {
          let optionObj = { value: this.state.inputValue, label: this.state.inputValue }
          this.setState({
            value: optionObj,
            inputValue: ""
          })
          this.props.getValue(optionObj)
        }
        break;

      default:
        break;
    }
  }
  // componentDidMount() {
  //       document.addEventListener('mousedown', this.handleClickOutside);
  //   }

  // componentWillUnmount() {
  //       document.removeEventListener('mousedown', this.handleClickOutside);
  //   }

  /**
   * Alert if clicked on outside of element
   */
  // handleClickOutside(event) {
  //      if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
  //        this.setState({ 
  //          inputValue: "",
  //          showAdd: false  
  //        });
  //      }
  // }
  render() {
    return (
      <>
        <Row>
          <Col>
            <DivWrap className="parent_select_search_custom" >
              <LabelNormal className="form-label mgb-0" >{this.state.label}{this.state.isMandatory ? <span className="sup">*</span> : ''}</LabelNormal>
              <CreatableSelect
                isClearable={this.state.isMandatory ? false : true}
                value={this.state.value}
                className={`${this.state.className} select_search_custom`}
                classNamePrefix="react-select"
                onChange={this.handleChange}
                defaultValue={this.state.defaultValue}
                onInputChange={this.handleInputChange}
                options={this.state.options.map(item => {
                  return { label: item[this.state.optionValue], value: item[this.state.optionId], item: item }
                })}
              />

            </DivWrap>
            {/* </Form.Group> */}
          </Col>
        </Row>
      </>
    )
  }
  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value, inputValue: this.props.value });
    }
  }
}
export default SingleSelectAddTag;

