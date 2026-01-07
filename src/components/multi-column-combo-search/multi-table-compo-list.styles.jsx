import styled from 'styled-components';

export const LabelNormal = styled.label`
      padding-right: 10px;
`;

export const List = styled.li`
`;

export const TableHead = styled.th`
    border: 1px solid #ccc;
    padding: 5px 10px;
    color: var(--text-primary-color);
    font-weight: 600;
    border-bottom: 1px solid #e7eaed;
    border-right: 1px solid #e7eaed;
    border-left: 1px solid #e7eaed;
`;

export const TableRow = styled.tr`
  &:hover{
     background-color: #ddd;
  }
`;

export const TableData = styled.td`
        padding: 5px 10px;
        color: var(--text-primary-color);
        font-weight: 600;
        border-bottom: 1px solid #e7eaed;
        border-right: 1px solid #e7eaed;
        border-left: 1px solid #e7eaed;
        font-weight: 100;
`;

export const InlineEl = styled.span`
  &.no-data{
    padding:5px 10px;
    width: 100%;
    text-align: center;
    display: block;
    color: var(--text-primary-color);
    font-weight: 600;
    
  }
`;

export const InputWrap = styled.input`
    padding: 5px 0 0 0 ;
    width:  100% ;     
    border: none;
    color: var(--text-primary-color);
    font-weight: 600;
    border-bottom: 1px solid #e7eaed;
    &.checkbox{
      width:auto;
    }
`;

export const UnOrderedList = styled.ul`
`;

export const TableWrap = styled.table`
  &.compo-table{
    position: absolute;
    background: #fff;
    /*padding: 10px;*/
    font-size: 13px;
    line-height: 1.2;
    -webkit-box-shadow: 0px 0px 7px -2px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 7px -2px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 7px -2px rgba(0,0,0,0.75);
    z-index: 9;
  }
`;

export const DivWrap = styled.div`
  &.custom-column-wrap{
    &.selected{
      min-height:75px;
      margin-top:-20px;
      margin-bottom:10px;
      .form-label{
        margin-bottom: 0px;
      }
    }
        min-height:66px;
        position: relative;
        background: #fff;
        /* margin-top:-15px; */
        margin-bottom:15px;
  }
  &.dropdown-wrap{
    z-index: 100;
    width: 100%;
    background: #fff;
    margin-top: -5px;
    left:0;
    .limit-width{
      position: absolute;
      z-index: 9999;
      left: 0;
      right: 0;
      overflow: auto;
      background: #fff;
      max-height: 330px;
    }
    &.listed{
    }
  }
  &.form-group-icon{
    width: 100%;
    margin-top:-15px;
    position: relative;
    // z-index:9;
    input:hover , input:focus{
      outline: none;
    }
    &.list-view{
      .ReactTags__tagInput{
        display:block;
      }
    }
  }
  
  &.icon-input{
    position: relative;
    .react-tagsinput{
      border:none;  
    }
    .ReactTags__tagInput{
      display:none;
      width:100%;
      input{
        border: none;
        width:100%;
        outline: none;
        padding: 5px;
        color: var(--text-primary-color);
        line-height: 1;
        font-weight: 600;
        font-size:13px;
        opacity:0.8;
      }
    }
    .ReactTags__selected{
       // border-bottom:1px solid #e8ebee;
    }
    .tag-wrapper{
      padding: 1px 1px 3px 0  px;
      background: #fff;
      border-radius: 3px;
      margin-right: 3px;
      color: var(--text-primary-color);
      border:none;
      line-height: 1;
      margin-bottom: 5px;
      font-weight: 600;
      text-transform: capitalize;
      overflow: hidden;
      flex-wrap: wrap;
      display: flex;
      a{
        font-size:0;
        &:before{
          top:-6px;
          position:relative;
          font-size:12px;
          font-family: "fontello";
          font-style: normal;
          font-weight: normal;
          speak: never;
          display: inline-block;
          text-decoration: inherit;
          width: 1em;
          margin-right: .2em;
          text-align: center;
          font-feature-settings: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1em;
          margin-left: .2em;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      }
    }
    .react-tagsinput-input{
      color: var(--text-primary-color);
      font-weight: 600;
      opacity:.8;
      margin-bottom:0;
    }
    i{
      position: absolute;
      right: 10px;
      bottom: 17px;
      background: #fff;
      font-size: 15px;
      font-weight: 100;
      color: #57657e;
    }
  }

`;