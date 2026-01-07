import styled from 'styled-components';
export const AtTabs = styled.div`
.rc-tabs {
  border: solid 1px var(--border-primary);
  border-radius: 5px;
}
.rc-tabs-nav-wrap {
  border-bottom: 1px solid var(--border-primary);
}
.rc-tabs-tab {
  color: #a2aab8;
  font-size: 14px;
  font-weight: bold;
  /* padding: 0.75rem 1.375rem; */
  /* text-transform: uppercase; */
}
.rc-tabs-tab.rc-tabs-tab-active {
  font-size: 14px;
  font-weight: bold;
  color: #172b4d;
}
.rc-tabs-tab-btn {
  line-height: 1.4;
  padding: 0.75rem 1.375rem;
  border-right: 1px solid var(--border-primary);
}
.rc-tabs-tab-btn:focus, .rc-tabs-tab-btn:active, .rc-tabs-nav-more:focus, 
.rc-tabs-nav-more:active, .rc-tabs-tabpane {
  outline: 0;
  box-shadow: none;
}
.rc-tabs-ink-bar {
  background-color: var(--background-primary);
}
.rc-tabs-nav-more {
  width: 30px;
  background: rgba(255, 255, 255, 0.65);
  border-color: var(--border-primary);
  // transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  // box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  margin-right: -1px;
  margin-left: -1px;
}
.rc-tabs-nav-measure-ping-right::after, .rc-tabs-nav-wrap-ping-right::after {
  height: 100%;
  border-color: var(--border-primary);
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);

}
.rc-tabs-nav-measure-ping-left::before, .rc-tabs-nav-wrap-ping-left::before {
  width: 30px;
  height: 100%;
  border-color: var(--border-primary);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  z-index: 99;
  margin-right: -1px;
  margin-left: -1px;
}
`;

