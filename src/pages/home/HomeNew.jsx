
import React from 'react'
import { Card, Col, Image, Media, Nav, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import FormIcon from './FormIcon'
import HomeModule from './HomeModule';
import './homeNew.css'
//import HomeModule from './HomeModule';

const mapStateToProps = (state) => {
    return { Login: state.Login };
};


class HomeMenu extends React.Component {
    constructor(props) {
        super(props)
        this.forms = []
        this.props.Login.menuDesign && this.props.Login.menuDesign.map((menuItem, index) => {
            menuItem.lstmodule&& menuItem.lstmodule.map((moduleItem, moduleIndex) => {
                moduleItem.lstforms&&moduleItem.lstforms.map((formItem, formIndex) => {
                    // if (formItem.sdisplayname.toLowerCase().includes(event.target.value.toLowerCase())) {
                    this.forms.push({...formItem,smodulename:moduleItem.sdisplayname})
                    //}
                })
            })
        })
    }


    render() {
        return (
            <div className="client-listing-wrap mtop-4 screen-height-window">
              
                {/* <div className="containerHome"> */}
              {  this.props.searchText === ''&&this.props.menuClick===false ?
                // <div class="containerHome containerMargin">
                <div className='containerNew'>
                    {this.props.Login.menuDesign && this.props.Login.menuDesign.map(x =>
                        
                            // <Col md={3}>
                        <>
                            {x.nmenucode!==-2?
                                <div class="containerHomeNew" onClick={(e) => this.props.onClickSearchMenu(x)}>
                                 {/* {    console.log('check',x.nmenucode!==-2)} */}
                                    <div class="cardHomeNew">
                                        <div class="slide slide1">
                                            <div class="content">
                                                <div class="icon iconpadding">                                               
                                                     <Image src={require(`../../assets/image/${x.smenuname.toLowerCase()}.svg`)} alt="sidebar" width="40" height="40" />
                                                        {/* <span>{x.sdisplayname}</span> */}
                                                        {/* <FormIcon nformcode={x.nformcode} size="3x" /> */}                                           
                            
                                                    <div className={'cardHomeNewText'}>
                                                        {x.sdisplayname}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="slide slide2">
                                            <div class="content">
                                                 <h3>
                                                     {x.sshortdesc}
                                                </h3>
                                                {/*<p>Trust yourself and keep going.</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :""
                            }
                            </>
                            // </Col>
                            
                    )}
                    </div>
                    // </div>
                :<HomeModule  forms={this.forms}{...this.props} />}
            </div>
            
        )
    }
}

export default connect(mapStateToProps, {})(HomeMenu);