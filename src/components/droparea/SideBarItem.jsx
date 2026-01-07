import React from "react";
import { useDrag } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBalanceScale, faBed, faBoxes, faCalendarDay, faCaretSquareDown, faChartArea, faCheckSquare, faEnvelopeOpenText, faFileAlt, faFileSignature, faFilter, faFont, faIdCard, faIndustry, faListOl, faParagraph,faSearch } from "@fortawesome/free-solid-svg-icons";


import "./styles.css"
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";


const SideBarItem = ({ data, displayField }) => {
  const [{ opacity }, drag, collected, dragPreview] = useDrag({
    type: 'sidebarItem',
    item: data.jsondata,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  const icons =(val)=>{
    let icon;
    switch (val) {
      case "Short Text":
        icon = <FontAwesomeIcon icon={faFont} />
        break; 
      case "Paragarph":
        icon = <FontAwesomeIcon icon={faParagraph} />
        break; 
      case "Drop Down":
        icon = <FontAwesomeIcon icon={faCaretSquareDown } />
        break; 
      case "Date":
        icon = <FontAwesomeIcon icon={faCalendarDay} />
        break; 
      case "Number":
        icon = <FontAwesomeIcon icon={faListOl} />
        break; 
      case "E-Mail":
        icon = <FontAwesomeIcon icon={faEnvelopeOpenText } />
        break; 
      case "Multiple Choice":
        icon = <FontAwesomeIcon icon={faCheckCircle} />
        break; 
      case "Checkboxes":
        icon = <FontAwesomeIcon icon={faCheckSquare} />
        break; 
      case "File Upload":
        icon = <FontAwesomeIcon icon={faFileAlt} />
        break; 
      case "Product Category":
        icon = <FontAwesomeIcon icon={faIdCard } />
        break; 
      case "Unit":
        icon = <FontAwesomeIcon icon={faBalanceScale } />
        break; 
      case "Patient Id":
        icon = <FontAwesomeIcon icon={faBed} />
        break; 
      case "Supplier":
        icon = <FontAwesomeIcon icon={faBoxes} />
        break; 
      case "Manufacturer":
        icon = <FontAwesomeIcon icon={faIndustry } />
        break; 
      case "Manufacturer Site":
        icon = <FontAwesomeIcon icon={faChartArea} />
        break; 
      case "Manufacturer Contact":
        icon = <FontAwesomeIcon icon={faFileSignature} />
        break; 
      case "Search":
        icon = <FontAwesomeIcon icon={faSearch}/>
        break;
      case "Filter":
        icon = <FontAwesomeIcon icon={faFilter}/>
        break;
      default:
        break;
    }
    return icon;
  }
  return collected.isDragging ? (
    <div ref={dragPreview} className="sideBarItem" >
      {icons(data.component.type) ? 
      <span className="drag-icon">{icons(data.component.type)}</span>
        : 
      <span className="drag-icon-text">{data.component.type.charAt(0)}</span>
      }
      <span className="item">
        {data.component.type}
      </span>
    </div>
  ) : (
    <div className="sideBarItem" ref={drag} {...collected} style={{ opacity, cursor: 'move' }}>
      {icons(data.jsondata[displayField]) ? 
        <span className="drag-icon">{icons(data.jsondata[displayField])}</span>
      :
        <span className="drag-icon-text">{data.jsondata[displayField].charAt(0)}</span>
      }
      <span className="item">
        {data.jsondata[displayField]}
      </span>
    </div>
  )
};
export default SideBarItem;
