import React from 'react'
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { ReactComponent as Pass } from '../assets/image/Pass.svg'
// import { ReactComponent as Fail } from '../assets/image/Fail.svg'
import { ReactComponent as Withdrawn } from '../assets/image/Withdraw.svg'
import { ReactComponent as Complete } from '../assets/image/complete.svg'
import { ReactComponent as Approve } from '../assets/image/approve.svg'
import { ReactComponent as Review } from '../assets/image/review.svg'
import { ReactComponent as Retest } from '../assets/image/retest.svg'
//import { ReactComponent as Recalc } from '../assets/image/ReCalc.svg'
import { ReactComponent as RecommendRecalc } from '../assets/image/recommend-recal.svg'
import { ReactComponent as RecommendRetest } from '../assets/image/recomment-test.svg';
import { ReactComponent as Checked } from '../assets/image/checked.svg'
import { ReactComponent as Correction } from '../assets/image/correction.svg';
import { ReactComponent as Register } from '../assets/image/register.svg';
import { ReactComponent as Reject } from '../assets/image/reject.svg';
import { ReactComponent as Cancel } from '../assets/image/cancel.svg';
import { ReactComponent as Preregister } from '../assets/image/pre-register.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck,faRocket,faUserTimes,faCheckCircle,faTimes } from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons'


export function getStatusIcon(statusCode) {
    switch (statusCode) {
        case 17:
            return (
                <Preregister className="custom_icons" width="15" height="15" />
            );
        case 18:
            return (
                <Register className="custom_icons" width="15" height="15" />
            );
        case 25:
            return (
                <Complete className="custom_icons" width="15" height="15" style={{ color: '#0062cc' }} />
            );
        case 24:
            return (
                <RecommendRecalc className="custom_icons" width="15" height="15" />
            );
        case 26:
            return (
                <RecommendRecalc className="custom_icons" width="15" height="15" />
            );
        case 27:
            return (
                <RecommendRetest className="custom_icons" width="15" height="15" />
            );
        case 28:
            return (
                <Checked className="custom_icons" width="15" height="15" />
            );
        case 29:
            return (
                <Review className="custom_icons" width="20" height="20" />
            );
        case 31:
            return (
                <Approve className="custom_icons" width="20" height="20" />
            );

        case 32:
            return (
                <Retest className="custom_icons" width="15" height="15" />
            );

        case 45:
            return (
                // <Pass className="custom_icons" width="15" height="15" />
                <><FontAwesomeIcon className="icon-green" icon={faThumbsUp} />{" "}</>
            );
        case 46:
            return (
                // <Fail className="custom_icons" width="15" height="15" />
                <><FontAwesomeIcon className="icon-red" icon={faThumbsDown} />{" "}</>
            );
        case 47:
            return (
                <Withdrawn className="custom_icons" width="15" height="15" />
            );
        case 48:
            return (
                <Correction className="custom_icons" width="20" height="20" />
            );
        case 34:
            return (
                <Reject className="custom_icons" width="15" height="15" />
            );
        case 35:
            return (
                <Cancel className="custom_icons" width="15" height="15" />
            );
        case 30:
            return (
                <><FontAwesomeIcon className="custom_icons" icon={faCheck} />{" "}</>
            );
            case 33:
                return (
                    <><FontAwesomeIcon className="custom_icons" icon={faThumbsUp} />{" "}</>
                );
            case 7:
                    return (
                        <><FontAwesomeIcon className="custom_icons" icon={faThumbsDown} />{" "}</>
        
                    );
            case 56:
                    return (
                        <><FontAwesomeIcon className="custom_icons" icon={faThumbsUp} />{" "}</>
                    );
             case 57:
                    return (
                        <><FontAwesomeIcon className="custom_icons" icon={faThumbsDown} />{" "}</>
                
                    );
        default:
    }
}