// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import { DialogComponent } from '@syncfusion/ej2-react-popups';
// //import './draggable.css';
// const Draggable = () => {
//     let animationSettings;
//     let buttonEle;
//     const [status, setStatus] = useState(true);
//     const [display, setDisplay] = useState('none');
//     animationSettings = { effect: 'None' };
//     const buttonClick = () => {
//         setStatus(true);
//     };
//     const dialogClose = () => {
//         setStatus(false);
//         setDisplay('inline-block');
//     };
//     const dialogOpen = () => {
//         setStatus(true);
//         setDisplay('none');
//     };
//     return (<div className="control-pane">
//         <div id="target" className="col-lg-12 control-section dialog-draggable">
//           <button className="e-control e-btn dlgbtn" onClick={buttonClick} style={{ display: display }} id="dialogBtn">Open Dialog</button>
//           {/* Render alert Dialog */}
//           <DialogComponent id="dialogDraggable" header="Drag Me!!!" isModal={true} showCloseIcon={true} allowDragging={true} animationSettings={animationSettings} width="300px" target="#target" visible={status} open={dialogOpen} close={dialogClose}>This is a dialog with draggable support.</DialogComponent>
//         </div>
//       </div>);
// };
// export default Draggable;