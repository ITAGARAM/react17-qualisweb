import './pdf-viewer-component.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faWindowClose} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
//import { Document, Page } from 'react-pdf';
import PDFViewer from 'pdf-viewer-reactjs'
class PdfViewer extends React.Component {
  constructor(Props) {
    super(Props);
    this.state = { ...Props ,page:1 , open:false}

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
    const MyPdfViewer = () =>{
      return (
        <div className="popup_modal_wrap">
          <FontAwesomeIcon icon={faFilePdf} onClick={this.toggleClick} />
          <div className={`popup_modal ${this.state.open ? 'open':''}`}>
            <span className="close_top"><FontAwesomeIcon icon={faWindowClose} onClick={this.toggleClick} /></span> 
            <PDFViewer
              document={{
                  url: `${this.state.file}`
              }}
              hideRotation={true}
              hideZoom={true}
              page={this.state.page}
              onPrevBtnClick={this.leftClick}
              onNextBtnClick={this.rightClick}
              navigation={[{
                css:{
                  previousPageBtn:'prev_btn',
                  nextPageBtn:'next_btn'

                }
              }]}
            />
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
export default PdfViewer;

