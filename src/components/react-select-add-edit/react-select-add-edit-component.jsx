import React from "react";
import './react-select-add-edit-component.css';
import { LabelNormal, DivWrap } from './react-select-add-edit-component.style';
import { Row, Col } from 'react-bootstrap';
import { Form , ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes  , faChevronUp , faChevronDown} from '@fortawesome/free-solid-svg-icons';

class ReactSelectAddEdit extends React.Component {
  constructor(Props) {
   
    super(Props);
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = { ...Props, inputValue: '', list:Props.options,  showList: false, filteredList: [],displayNameSearch:Props.displayNameSearch };
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.wrapperRef = React.createRef();
    // this.handleClickOutside = this.handleClickOutside.bind(this); 
  }
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target) && this.state.showList) {
      this.closeList(event)
    }
  }
  closeList(){
      this.setState({
          showList:false 
        })
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  handleChange = (newValue) => {
       this.setState({
          value: newValue ,//actionMeta.option
          inputValue:newValue[this.state.optionValue],
          showList:false  
        })
        this.props.getValue(newValue)
  }
  clearData=()=>{
    this.setState({
      showList:false,
      inputValue :''
    })

  }
  toggleList =() =>{
    this.setState({
      showList : !this.state.showList,
      options:this.state.list
    })
  }
  handleInputChange = (inputValue) => {
  
          let optionObj = inputValue.trimStart()!==""? { value: inputValue, label: inputValue}: []
         
          let arrayList = this.state.list.filter(o =>
                            o["item"][this.state.optionValue].toString().toLowerCase().includes(inputValue.toLowerCase())
                          );
          this.setState({
            value: optionObj,
            inputValue: inputValue,
            options:arrayList,
            showList: arrayList.length > 0 ? true : false
          })
          this.props.getValue(optionObj)
          
  }
  componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
      this.setState({ value: this.props.value, inputValue: this.props.value[this.state.optionValue] ? this.props.value[this.state.optionValue] : this.props.value.label ? this.props.value.label : ''    });
        
    }

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
            <DivWrap className={` parent_select_search_custom ${this.state.showList ? 'active-list' : ''} ${this.state.inputValue ? 'actice-input' : ''}`} ref={this.wrapperRef}>
              <LabelNormal className="form-label mgb-0" >{this.state.label}{this.state.isMandatory ? <span className="sup">*</span> : ''}</LabelNormal>
              <DivWrap  className="regular-input">
                <Form.Control  type="text" placeholder={this.state.displayNameSearch} maxLength={'100'} 
                value={this.state.inputValue} onChange={e => this.handleInputChange(e.target.value)} onClick={e => this.handleInputChange(e.target.value)} />    
                {!this.state.isMandatory ? <i onClick={this.clearData}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></i> : ''}
                <FontAwesomeIcon className="input_ico" icon={this.state.showList ? faChevronUp : faChevronDown }  onClick={e => this.toggleList()}/>
              </DivWrap>
              <ListGroup className="regular-input-list">
                {this.state.options && this.state.options.map(optionItem => 
                  <ListGroup.Item onClick={()=>this.handleChange(optionItem)}>
                    {optionItem["item"][this.state.optionValue]}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </DivWrap>
          </Col>
        </Row>
      </>
    )
  }
  componentDidUpdate(prevProps) {
    document.addEventListener('mousedown', this.handleClickOutside);

    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value, inputValue: this.props.value[this.state.optionValue] ? this.props.value[this.state.optionValue] : this.props.value.label ? this.props.value.label : ''    });
    }
  }
}
export default ReactSelectAddEdit;

