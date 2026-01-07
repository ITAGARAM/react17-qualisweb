
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Card, Col, Media, Nav, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import FormIcon from './FormIcon'
import './home.css'


const mapStateToProps = (state) => {
    return { Login: state.Login };
};


class Home extends React.Component {
    constructor(props) {
        super(props)

        this.forms = this.props.forms
        // this.props.Login.menuDesign && this.props.Login.menuDesign.map((menuItem, index) => {
        //     menuItem.lstmodule.map((moduleItem, moduleIndex) => {
        //         moduleItem.lstforms.map((formItem, formIndex) => {
        //             // if (formItem.sdisplayname.toLowerCase().includes(event.target.value.toLowerCase())) {
        //             this.forms.push(formItem)
        //             //}
        //         })
        //     })
        // })
    }

    render() {
        return (
            <div className="client-listing-wrap mtop-4 screen-height-window">
                <div class="containerHome">
                    {this.props.menuClick &&
                        <a class="card2Home HomeBackBlue colorChange" href="#" onClick={(e) => this.props.onClickBackToMenu(e)}>
                            <Nav.Link
                                className='btn form-icon-home HomeBackBlue1 noborder1 mr-2'>
                                <FontAwesomeIcon icon={faBackward} size="3x" />
                            </Nav.Link>
                            <p class="smallHome HomeBackBlue1">
                                {"Back To Menu"}
                            </p>

                            <div class="go-cornerHome" href="#">
                                <div class="go-arrowHome">
                                    →
                                </div>
                            </div>
                        </a>}
                    {/* <Row> */}
                    {this.forms.map((x,index) =>
                        // this.props.searchText !== '' && this.props.menuClick === false ?
                        //     // <Col md={4}>
                        //     <a class="card2Home" href="#" onClick={(e) => this.props.onClickSearchForm(x)}>
                        //         <Nav.Link
                        //             className='btn  outline-grey noborder1 mr-2'>
                        //             <FormIcon nformcode={x.nformcode} size="3x" />
                        //         </Nav.Link>
                        //         <p class="smallHome">
                        //             {x.sdisplayname}
                        //         </p>

                        //         <div class="go-cornerHome" href="#">
                        //             <div class="go-arrowHome">
                        //                 →
                        //             </div>
                        //         </div>
                        //     </a>
                        //     // </Col>
                        //     :  
                            this.props.defaultSearch &&
                            this.props.defaultSearch.findIndex(x1 => x1.nformcode === x.nformcode) !== -1 &&

                            <div class="card2Home" href="#" onClick={(e) => this.props.onClickSearchForm(x)}>
                                <Nav.Link
                                    className='btn form-icon-home noborder1 mr-2'>
                                    <FormIcon nformcode={x.nformcode} size="3x" index={index} option={x}/>
                                    {x.sdisplayname}
                                </Nav.Link>
                                <p class="smallHome">
                                    {x.sdisplayname}
                                </p>

                                <div class="go-cornerHome" href="#">
                                    <div class="go-arrowHome">
                                        →
                                    </div>
                                </div>
                            </div>

                    )}
                    {/* </Row> */}

                </div>
            </div>
        )
    }


    //             <Row style={{ "margin-left": "100px" }}>
    //                 {this.forms.map(x =>
    //                     this.props.searchText === '' ?
    //                         <Col md={3}>
    //                             <Card onClick={(e) => this.props.onClickSearchForm(x)} className='m-2'
    //                                 style={{
    //                                     "width": "210px", "height": "160px",
    //                                     "margin-right": "30px", "text-align": "center"
    //                                 }}>
    //                                 <Card.Body>
    //                                     {/* <Media> */}
    //                                     <Nav.Link
    //                                         className='btn  outline-grey noborder mr-2'>
    //                                         <FormIcon nformcode={x.nformcode} size="3x"/>
    //                                     </Nav.Link>
    //                                     {/* <Media.Body>
    //                                             {x.sdisplayname}
    //                                         </Media.Body> */}
    //                                     {/* </Media> */}
    //                                 </Card.Body>
    //                                 <div >
    //                                 <Card.Footer className={'homeNotopborder'}>
    //                                     {x.sdisplayname}
    //                                 </Card.Footer>
    //                                 </div>
    //                             </Card>
    //                         </Col>
    //                         : this.props.defaultSearch &&
    //                         this.props.defaultSearch.findIndex(x1 => x1.nformcode === x.nformcode) !== -1 &&
    //                         <Col md={3}>
    //                             <Card onClick={(e) => this.props.onClickSearchForm(x)} className='m-2' style={{
    //                                 "width": "210px",
    //                                 "height": "150px", "margin-right": "30px"
    //                                 , "text-align": "center"
    //                             }}>
    //                                 <Card.Body>
    //                                     <Nav.Link className='btn btn-circle outline-grey mr-2'
    //                                     >
    //                                         <FormIcon nformcode={x.nformcode} />
    //                                     </Nav.Link>
    //                                     {/* {x.sdisplayname} */}
    //                                 </Card.Body>
    //                                 <Card.Footer style={{ "background-color": "rgb(248 248 248)" }}>
    //                                     {x.sdisplayname}
    //                                 </Card.Footer>
    //                             </Card>
    //                         </Col>
    //                 )}


    //             </Row>
    //         </>
    //     }

    // </div>
    // )
    //}
}

export default connect(mapStateToProps, {})(Home);