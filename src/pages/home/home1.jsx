
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

        this.forms = []
        this.props.Login.menuDesign && this.props.Login.menuDesign.map((menuItem, index) => {
            menuItem.lstmodule.map((moduleItem, moduleIndex) => {
                moduleItem.lstforms.map((formItem, formIndex) => {
                    // if (formItem.sdisplayname.toLowerCase().includes(event.target.value.toLowerCase())) {
                    this.forms.push(formItem)
                    //}
                })
            })
        })
    }

    render() {
        return (
            <div className="client-listing-wrap mtop-4 screen-height-window">
                {
                    <>
                        <Row style={{ "margin-left": "100px" }}>
                            {this.forms.map(x =>
                                this.props.searchText === '' ?
                                    <Col md={3}>
                                        <Card onClick={(e) => this.props.onClickSearchForm(x)} className='m-2'
                                            style={{
                                                "width": "210px", "height": "160px",
                                                "margin-right": "30px", "text-align": "center"
                                            }}>
                                            <Card.Body>
                                                {/* <Media> */}
                                                <Nav.Link
                                                    className='btn form-icon-home noborder mr-2'>
                                                    <FormIcon nformcode={x.nformcode} size="3x"/>
                                                </Nav.Link>
                                                {/* <Media.Body>
                                                        {x.sdisplayname}
                                                    </Media.Body> */}
                                                {/* </Media> */}
                                            </Card.Body>
                                            <div >
                                            <Card.Footer className={'homeNotopborder'}>
                                                {x.sdisplayname}
                                            </Card.Footer>
                                            </div>
                                        </Card>
                                    </Col>
                                    : this.props.defaultSearch &&
                                    this.props.defaultSearch.findIndex(x1 => x1.nformcode === x.nformcode) !== -1 &&
                                    <Col md={3}>
                                        <Card onClick={(e) => this.props.onClickSearchForm(x)} className='m-2' style={{
                                            "width": "210px",
                                            "height": "150px", "margin-right": "30px"
                                            , "text-align": "center"
                                        }}>
                                            <Card.Body>
                                                <Nav.Link className='btn btn-circle outline-grey mr-2'
                                                >
                                                    <FormIcon nformcode={x.nformcode} />
                                                </Nav.Link>
                                                {/* {x.sdisplayname} */}
                                            </Card.Body>
                                            <Card.Footer style={{ "background-color": "rgb(248 248 248)" }}>
                                                {x.sdisplayname}
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                            )}


                        </Row>
                    </>
                }

            </div>
        )
    }
}

export default connect(mapStateToProps, {})(Home);