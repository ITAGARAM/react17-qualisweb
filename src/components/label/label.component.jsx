import React from 'react';
//import './form-label.styles';
//import { Form } from 'react-bootstrap';

class  LabelComponent extends React.Component  {

    render(){
        //console.log("className:",this.props.className, this.props.style);
        return(
            <React.Fragment>               
                      
                    {/* <Form.Label htmlFor={this.props.name}
                        id={this.props.name}
                        label={this.props.label}
                        name={this.props.name}
                        className={this.props.className}                      
                        style={this.props.style}                       
                       // style={{"text-decoration":"underline", 'font-size':`'${this.props.textSize}px'`}}
                    >
                   {this.props.label}
                   </Form.Label> */}
                   <h4 className={`${this.props.className} mb-4`} style={this.props.style}>
                    {this.props.label}
                    </h4>
                
            </React.Fragment>
        )
    }
 

}

export default LabelComponent;