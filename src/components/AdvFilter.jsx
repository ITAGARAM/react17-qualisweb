import React, {useEffect} from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { ReactComponent as FilterIcon } from '../assets/image/filer-icon.svg';
// import '../pages/product/product.css'
import '../pages/registration/registration.css'
//import { Tooltip } from '@progress/kendo-react-tooltip';
// class AdvFilter extends React.Component{
//     constructor(props) {
//         super(props)
//         this.state = {
//             showDropDown:false
//         }
//     }
//     openCloseDropDown=(showDropDown)=>{
//         this.setState({showDropDown:!showDropDown})
//     }
//     closeDropDown=()=>{
//         this.setState({showDropDown:false})
//     }


//     render(){

//         return(
//             <>
//                 <Button className="bg-default no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo" onClick={this.props.openFilter}>
//                     <Image src={filterIcon} alt="filer-icon" width="20" height="20" className={`ActionIconColor img-normalize ${this.props.showFilter?'active':''}`} title="Filter" />
//                 </Button>
//                 <Overlay show={this.props.showFilter} placement="bottom">
//                     <Popover>
//                         {this.props.filterComponent.map(filterComponent=>{
//                         return(
//                             <>
//                             <Row>
//                                 <Col md={12} className="p-3 mtop-2">
//                                     {Object.values(filterComponent)[0]}
//                                 </Col>
//                             </Row>
//                             <div className="d-flex justify-content-end">
//                                 <Button onClick={this.props.closeFilter} className="theme-btn-rounded-corner ">{this.props.intl.formatMessage({id:"IDS_CANCEL"})}</Button>
//                                 <Button onClick={(event) => this.handleSubmitClick(event)} className="theme-btn-rounded-corner">{this.props.intl.formatMessage({id:"IDS_SUBMIT"})}</Button>
//                             </div>
//                             </> 
//                         )}  
//                     )}
//                     </Popover>
//                 </Overlay>
//             </>
//         )
//     }
// }
// export default injectIntl(AdvFilter);
function AdvFilter(props) {
  const [show, setShow] = React.useState(props.showFilter);
  const [target, setTarget] = React.useState(null);
  const ref = React.useRef(null);

  const handleClick = (event, flag) => {
    document.body.classList.add('no-scroll');
    setTarget(event.target);
    if (flag === 1) {
      setShow(!show)
      props.filterSubmitValueEmpty !== undefined && props.openFilter(); // ALPD-5908  Added props.openFilter and props.filterSubmitValueEmpty by Vishakh (01-07-2025)
      props.showModalBg(true)
    } else {
      document.body.classList.remove('no-scroll');
      setShow(false)
      if(props.callCloseFunction)
      props.closeFilter();

      props.showModalBg(false)
    

    }
  };
  const handleSubmitClick = (event) => {
    // ALPD-5908  Modified codes by Vishakh for advance filter submit with empyty values enhancement(01-07-2025)
    if(props.filterSubmitValueEmpty === undefined){
      document.body.classList.remove('no-scroll');
      props.showModalBg(false)
      setShow(props.filterSubmitValueEmpty ? true : false)
    } 
    props.onFilterSubmit(event)
  }

  // ALPD-5908  Added useEffect by Vishakh for advance filter submit with empyty values enhancement(01-07-2025)
  useEffect(() => {
    if(props.filterSubmitValueEmpty !== undefined){
      props.showModalBg(props.filterSubmitValueEmpty ? true : false);
      setShow(props.filterSubmitValueEmpty ? true : false);
    }
  }, [props.filterSubmitValueEmpty]);

  return (
    <div>
      {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
      {/* <ReactTooltip place="bottom" /> */}
      <Button data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_ADVFILTER" })}
        data-for="tooltip-common-wrap"
        className="bg-default svg_custom_big no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo"
        onClick={(event) => handleClick(event, 1)}>
        <FilterIcon className="custom_icons" width="24" height="24" />
      </Button>
      {/* </Tooltip> */}
      <div ref={ref} className={`blured_shadow ${show ? 'active' : ''}`}>
        <Overlay show={show} target={target} placement="bottom" container={ref.current}>
          <Popover id="popover-contained">
            <div className="popup_btn_g">
              <Button onClick={(event) => handleClick(event, 2)} className="theme-btn-rounded-corner ">{props.intl.formatMessage({ id: "IDS_CANCEL" })}</Button>
              <Button onClick={(event) => handleSubmitClick(event)} className="theme-btn-rounded-corner-bg-blue mr-3">{props.intl.formatMessage({ id: "IDS_SUBMIT" })}</Button>
            </div>
            {props.filterComponent.map(filterComponent =>
              <div className="popup_p_g">
                {Object.values(filterComponent)[0]}
              </div>
            )}
          </Popover>
        </Overlay>
      </div>
    </div>
  );
}

export default injectIntl(AdvFilter)

//   function AdvFilter(props) {
//     const [show, setShow] = React.useState(props.showFilter);
//     const [target, setTarget] = React.useState(null);
//     const ref = React.useRef(null);
//     const popover = (
//         <Popover id="popover-basic">
//           <Popover.Title as="h3">Sample Filter</Popover.Title>
//           <Popover.Content>
//                 {props.filterComponent.map(filterComponent=>
//                     <Row>
//                         <Col md={12} className="p-3 mtop-2">
//                             {Object.values(filterComponent)[0]}
//                         </Col>
//                     </Row>
//                 )}
//                 <Row className="pad-15 d-flex justify-content-end">
//                     <Button onClick={props.closeFilter} trigger="click" className="theme-btn-rounded-corner ">{props.intl.formatMessage({id:"IDS_CANCEL"})}</Button>
//                     <Button onClick={(event) => props.onFilterSubmit(event)} className="theme-btn-rounded-corner">{props.intl.formatMessage({id:"IDS_SUBMIT"})}</Button>     
//                 </Row> 
//           </Popover.Content>
//         </Popover>
//       );
//     return (
//         <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
//             <Button className="bg-default no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo" onClick={props.openFilter}>
//                 <Image src={filterIcon} alt="filer-icon" width="20" height="20" className={`ActionIconColor img-normalize ${props.showFilter?'active':''}`} title="Filter" />
//             </Button>
//         </OverlayTrigger>
//     );
//   }
//   export default injectIntl(AdvFilter)