import './doc-viewer-component.css';
//import { LabelNormal, DivWrap, SpanWrap } from './doc-viewer-component.style';
//import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload , faWindowClose } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
//import { Document, Page } from 'react-pdf';
//import FileViewer from 'react-file-viewer';

class DocViewer extends React.Component {
  // constructor(Props) {
  //   super(Props);
  //   let iconName;
  //   let fileName;
  //   switch(Props.type){
  //     case 'pdf': 
  //       fileName = 'export.pdf';
  //       iconName = faFilePdf ;
  //       break;
  //     case 'xlsx':
  //       fileName = 'export.xlsx'; 
  //       iconName = faFileExcel ;
  //       break;
  //     case 'png': 
  //       fileName = 'export.png';
  //       iconName = faImages;
  //       break;
  //     case 'jpeg':
  //       fileName = 'export.jpeg'; 
  //       iconName = faFileImage;
  //       break;
  //     case 'docx':
  //       fileName = 'export.doc'; 
  //       iconName = faFileAlt;
  //       break;
  //     default:
  //       fileName =  'export.pdf';
  //       iconName = faFilePdf ;
  //       break;
  //   }
  //   console.log(iconName)
  //   this.state = { ...Props ,page:1 , open:false , iconName:iconName , fileName:fileName}

  // }

  constructor(props) {
    super(props);
    this.state = { 
      ...props ,
      page:1 , 
      open:this.props.showReport
    }
  }


  leftClick = (data) =>{
    this.setState({
      page:data
    })
  }
  rightClick = (data) =>{
    this.setState({
      page:data
    })
  }
  toggleClick = () =>{
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    //const docs = [{ uri: this.state.file }]; 
   // console.log("doc viewer:", this.state.file, this.state.fileName);
    const MyPdfViewer = () =>{
      return (
        <div className="popup_modal_wrap">
          {/* <FontAwesomeIcon icon={this.state.iconName} onClick={this.toggleClick} /> */}
          <div className={`popup_modal ${this.state.open ? 'open':''}`}>
            <span className="close_top">
              <FontAwesomeIcon icon={faWindowClose} onClick={this.props.closeModal} />
              {this.state.isDownloadable ? <a href={this.state.file} download={this.state.fileName}>
                <FontAwesomeIcon icon={faDownload} onClick={this.toggleClick} />
              </a> : ''}
              
            </span> 
            {/* <FileViewer
              fileType={this.state.type}
              filePath={this.state.file}
             /> */}
          </div> 
        </div>

      );
    }
    return (
      <>
        <MyPdfViewer/>
      </>
    )
  }
  componentDidMount(prevProps) {
  }
}
export default DocViewer;

