import React from "react";
import { connect } from 'react-redux';
import { updateStore } from '../../actions';
import { injectIntl } from "react-intl";
import AlertSlide from "./AlertSlide";



const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class AlertHome extends React.Component {
    constructor(Props) {
        super(Props);
       // this.state = { ...Props}
    }


    render() {
      
        return (
            <>
                <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                  <AlertSlide/>
                </div>
            </>
        )
    }



 


}
export default connect(mapStateToProps, { updateStore })(injectIntl(AlertHome));

