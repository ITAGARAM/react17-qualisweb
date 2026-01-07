import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { useDrag } from "react-dnd";
import { COMPONENT, COMPONENTROW } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const style = {
   border: "1px dashed black",
  padding: "0",
  cursor: "move"
};
const Componentexp = ({ data, components, path, onclickcomponent, deleteInput, validateDrop, selectedFieldRecord ,  slanguagetypecode}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: COMPONENTROW,
    item: {
      type: COMPONENTROW,
      id: data.id, 
      data: data,
      path
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
    drag(ref);

  // const component = components[data.id];

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className={`component draggable ${selectedFieldRecord.id === data.id ? "selected" : ""} `}
    >
      {/* <div>{data.id}</div> */}
      {/* <Button className={`componentItemButton ${selectedFieldRecord.id === data.id ? "selected" : ""}`} onClick={(e) => onclickcomponent(e, data, path)}> */}
      <div
        className={`componentItem text-center ${selectedFieldRecord.id === data.id ? "selected" : ""}`} //style={{ "whiteSpace": "nowrap" }}
        onClick={(e) => onclickcomponent(e, data, path)}>
        {(data.displayname&& data.displayname[slanguagetypecode]) ? data.displayname[slanguagetypecode]:data.label  || data.componentname}
        {data.templatemandatory != true &&
        <a class="position-absolute delete-dynamic-column" onClick={(e) => deleteInput(e,data, {
              type: COMPONENT,
              id: data.id,
              data: data,
              path
       })}><FontAwesomeIcon icon={faTrashAlt} /></a>
        }
          </div>
      {/* </Button> */}
    </div>
  );
};
export default Componentexp;
