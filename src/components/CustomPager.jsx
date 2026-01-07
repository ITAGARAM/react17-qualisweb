import React, { useRef } from 'react';
import '../pages/registration/registration.css'
import { Pager } from '@progress/kendo-react-data-tools';
import { injectIntl } from 'react-intl';
// import { withResizeDetector } from 'react-resize-detector';
import {  LocalizationProvider } from '@progress/kendo-react-intl';



const CustomPager = (props) => {
  const ref = useRef(null);
  const handlePageChange = (e) => {
    props.handlePageChange(e)
  }

  const AdaptiveComponent = () => {
    // let divWidth =  JSON.parse(JSON.stringify(width) )
    return <div className={`pager_wrap ${props.width && props.width < (props.pagershowwidth ? props.pagershowwidth:33) ? 'show-list' : 'wrap-class'}`} ref={ref}>
      <LocalizationProvider language={props.userInfo.slanguagetypecode}>
        {props.total > 0 &&
           <Pager
           className="k-pagerheight"
           skip={parseInt(props.skip)}
           take={parseInt(props.take)}
           onPageChange={(e) => handlePageChange(e)}
           total={props.total}
           buttonCount={props.buttonCount}
           info={props.info}
           pageSizes={props.pageSize}
           alwaysVisible={ false}
         // messagesMap={loadMessages(enMessages, "en")}
         />
        }
        
        
      </LocalizationProvider>
    </div>;
  };
  // const AdaptiveWithDetector = withResizeDetector(AdaptiveComponent);
  return (
    // <AdaptiveWithDetector />
    <AdaptiveComponent />
  )
}
export default injectIntl(CustomPager);
