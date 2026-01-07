import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { updateStore } from '../../actions';
import HomeDashBoard from "./HomeDashBoard";
import StaticHomeDashBoard from './StaticHomeDashBoard';
import { injectIntl } from "react-intl";
import { ListWrapper } from "../../components/client-group.styles";


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class DashBoard extends React.Component {
    constructor(Props) {
        super(Props);
        this.state = { ...Props, SliderOpen: false, loader: false }
    }

    toggleSilde = () => {
        this.setState({ SliderOpen: !this.state.SliderOpen, loader: !this.state.loader })
    }
    render() {
        let initialPage = this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length > 0
            && Object.keys(this.props.Login.homeDashBoard)[0];
        if (this.props.Login.masterDataStatic && Object.values(this.props.Login.masterDataStatic).length > 0) {
            initialPage = -1;
        }
        return (
            <>
                <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                    {/* <div className="modal-inner-content"> */}
                    {this.props.Login.currentPageNo === -1
                        && (this.props.Login.masterDataStatic && Object.values(this.props.Login.masterDataStatic).length > 0)
                        ? <StaticHomeDashBoard />
                        : <HomeDashBoard />
                    }


                    {this.props.Login.currentPageNo > initialPage ?
                        <a href={() => false} class="left-arrow" onClick={this.getPreviousPage}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </a>
                        :
                        <></>
                    }
                    {this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length > 0
                        && (this.props.Login.homeDashBoard.length - 1) !== this.props.Login.currentPageNo
                        ?
                        <a href={() => false} class="right-arrow" onClick={this.getNextPage}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                        :
                        <></>
                    }
                    {/* </div> */}
                </div>
            </>
        )
    }



    getPreviousPage = () => {
        if (this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length > 0) {
            let initialPage = Object.keys(this.props.Login.homeDashBoard)[0];
            if (this.props.Login.masterDataStatic && Object.values(this.props.Login.masterDataStatic).length > 0) {
                initialPage = -1;
            }
            // console.log("initial page:", initialPage, this.props.Login.currentPageNo);
            if (this.props.Login.currentPageNo > initialPage) {
                const currentPageNo = this.props.Login.currentPageNo - 1;

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { currentPageNo }
                }
                this.props.updateStore(updateInfo);
            }
        }
    }

    getNextPage = () => {
        if (this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length - 1 > this.props.Login.currentPageNo) {
            const currentPageNo = this.props.Login.currentPageNo + 1;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { currentPageNo }
            }
            this.props.updateStore(updateInfo);
        }
    }

    // componentDidMount() {
    //   const thisBoundedIncrementer = this.getListAlert1.bind(this);
    //   setInterval(thisBoundedIncrementer, 100000);
    // }

}
export default connect(mapStateToProps, { updateStore })(injectIntl(DashBoard));

