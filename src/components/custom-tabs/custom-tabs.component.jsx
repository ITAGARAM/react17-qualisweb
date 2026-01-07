import React from "react";
import 'rc-tabs/assets/index.css';
import Tabs, { TabPane } from "rc-tabs";
import {AtTabs} from '../custom-tabs/custom-tabs.styles';
import { injectIntl } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

class CustomTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  callback = (key) =>{
    this.props.onTabChange(this.props.tabDetail.get(key).props);    
  };

  render() {
    const {activeKey}=this.props
    const keys = [...this.props.tabDetail.keys()];
    return (
      <AtTabs>
        <Tabs activeKey={activeKey} moreIcon="..." onChange={this.callback} destroyInactiveTabPane={this.props.destroyInactiveTabPane?
        this.props.destroyInactiveTabPane:false}>
          {
            keys.map(item =>
              <TabPane name={item}  tab={this.props.intl.formatMessage({id:item})} key={item}  >
                { this.props &&  this.props.paneHeight ?
                    <PerfectScrollbar>
                        <div style={{height: this.props.paneHeight}}>
                          { this.props.tabDetail.get(item)}
                        </div>  
                    </PerfectScrollbar> : this.props.tabDetail.get(item) }
              </TabPane>
          )}
        </Tabs>
      </AtTabs>
    );
  }
}

export default injectIntl(CustomTabs);