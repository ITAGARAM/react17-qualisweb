import { faCloudDownloadAlt, faExternalLinkAlt, faEye, faFlask,faDolly, faGift, faGlobe, faHandHoldingWater, faHandMiddleFinger, faHandPaper, faHands, faMicroscope, faPencilAlt, faPrint, faTasks, faThumbsUp, faTrashAlt, faUserPlus, faArrowRight, faPenSquare, faPuzzlePiece, faAngleDoubleDown, faBoxes, faBox, faSearch, faRecycle,faFileImport,faFileExcel, faDollyFlatbed, faBarcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from 'react'
//import { ReactComponent as Reports } from '../assets/image/reports.svg'
import { ReactComponent as Quarantine } from '../assets/image/Quarantine.svg'
import { ReactComponent as Reject } from '../assets/image/reject.svg';
import { ReactComponent as Reports } from '../assets/image/generate-report.svg'

import { ReactComponent as Adhocparameter } from '../assets/image/adhocparameter.svg'
import { ReactComponent as Elnimage } from '../assets/image/sheet-view.svg'
//import { ReactComponent as Elnimage } from '../assets/image/sheet-view.svg'
import { ReactComponent as DataTransfer } from '../assets/image/data-transfer.svg';
//import { faHandLizard, faHandRock } from "@fortawesome/free-regular-svg-icons";
import { ReactComponent as Mappingicon } from '../assets/image/icon-mapping.svg';
import { ReactComponent as Sync } from '../assets/image/datasync.svg';
import { ReactComponent as ExportTemplate } from '../assets/image/exporttemplate.svg';
import { ReactComponent as AdhocTest } from '../assets/image/adhoctest.svg';
import { ReactComponent as Correction } from '../assets/image/correctionrelease.svg';
import { ReactComponent as ActiveStatus } from '../assets/image/circle-play-regular.svg';
import { ReactComponent as SendToStore } from '../assets/image/send-to-store2.svg';
import { ReactComponent as TestPackage } from '../assets/image/testpackage.svg'

export function getActionIcon(action) {
    switch (action) {
        case "faEye":
            return (
                <FontAwesomeIcon icon={faEye} />
            )
        case "faGift":
            return (
                <FontAwesomeIcon icon={faGift} />
            )
        case "faThumbsUp":
            return (
                <FontAwesomeIcon icon={faThumbsUp} />
            )

        case "faMicroscope":
            return (
                <FontAwesomeIcon icon={faMicroscope} />
            )
        case "faFlask":
            return (
                <FontAwesomeIcon icon={faFlask} />
            );
        case "faPencilAlt":
            return (
                <FontAwesomeIcon icon={faPencilAlt} />
            );
        case "reports":
            return (
                <Reports className="custom_icons" width="15" height="15" />
            );
        case "faTrashAlt":
            return (
                <FontAwesomeIcon icon={faTrashAlt} />
            )
        case "faTasks":
            return (
                <FontAwesomeIcon icon={faTasks} />
            )
        case "Quarantine":
            return (
                <Quarantine className="custom_icons" width="15" height="15" />
            )


        case "reject":
            return (
                <Reject className="custom_icons" width="15" height="15" />
            )
        case "faPenSquare":
            return (
                <FontAwesomeIcon icon={faPenSquare} />
            )
        case "AddSource":
            return (
                <FontAwesomeIcon icon={faGlobe} />
            )

        case "faPrint":
            return (
                <FontAwesomeIcon icon={faPrint} />
            )        

        case "adhoctest":
            return (
                <AdhocTest className='custom_icons' width='17px' height='17px' />
            )            

        case "faExternalLinkAlt":
            return (
                <FontAwesomeIcon icon={faExternalLinkAlt} />
            )

        case "faCloudDownloadAlt":
            return (
                <FontAwesomeIcon icon={faCloudDownloadAlt} />
            )
        case "faUserPlus":
            return (
                <FontAwesomeIcon icon={faUserPlus} />
            )
        case "faReceivedItem":
            return (
                //<FontAwesomeIcon icon={faHandHoldingWater} />
                <FontAwesomeIcon icon={faHandHoldingWater} />
            )
        case "faArrowRight":
            return (
                <FontAwesomeIcon icon={faArrowRight} />
            )
        case "faAdhocParameter":
            return (
                <Adhocparameter className="custom_icons" width="20" height="20" />
            )
        case "elnimage":
            return (
                <Elnimage className="custom_icons" width="20" height="20" />
            );
        case "faOutsource":
            return (
                <DataTransfer className="custom_icons" width="20" height="20" />
            )
        case "faBoxes":
            return (
                <FontAwesomeIcon icon={faBoxes} />
            )
        case "faBox":
            return (
                <FontAwesomeIcon icon={faBox} />
            )
        case "faSearch":
            return (
                <FontAwesomeIcon icon={faSearch} />
            )
        case "faRecycle":
                return (
                    <FontAwesomeIcon icon={faRecycle} />
                )
        case "faFileImport":
                    return (
                        <FontAwesomeIcon icon={faFileImport} />
                    )
        case "faFileExcel":
                        return (
                            // <FontAwesomeIcon icon={faFileExcel} />
                            <ExportTemplate width='17px' height='17px' className='custom_icons' />  
                        )
        case "mapping":
                return (
                    <Mappingicon className="custom_icons" width="20" height="20"/>
                )
        case "faDolly":
                    return (
                        <FontAwesomeIcon icon={faDolly} />
                    )
        case "faDollyFlatbed":
                        return (
                            <FontAwesomeIcon icon={faDollyFlatbed} />
                        )
        case "faBarcode":
            return (
                <FontAwesomeIcon icon={faBarcode} />
            )
        case "sync":
                return (
           <Sync className="custom_icons" width="17" height="17" />
                )
        case "faComments":
                    return (
            <Correction className="custom_icons" width="17" height="17" />
                    )

        //ALPD-4941-->Added by Vignesh R(11-02-2025)--Scheduler Configuration Icon changed
        case "faActiveStatus":
                    return (
            <ActiveStatus className="custom_icons" width="17" height="17" />
                    )
        //Added by L.Subashini -19/09/2025 --Send To Store Icon
        case "sendtostore":
                return (<SendToStore className="custom_icons" width="17" height="17" />)
         
         //ALPDJ21-110-Added by Vignesh -30/09/2025 --Test Package in Registration
        case "faTestPackage":
                return (<TestPackage className="custom_icons" width="22" height="22" />)        
        default:
            return "";
    }
}