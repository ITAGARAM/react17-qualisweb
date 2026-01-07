import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { COMPONENT, ROW, COLUMN, COMPONENTROW } from "./constants";
import "./styles.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ACCEPTS = [ROW, COLUMN, COMPONENT, COMPONENTROW];

const TrashDropZone = ({ data, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const layout = data;
      const itemPath = item.path;
      const splitItemPath = itemPath.split("-");
      const itemPathRowIndex = splitItemPath[0];
      const itemRowChildrenLength =
        layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

      // prevent removing a col when row has only one col
      if (
        item.type === COLUMN &&
        itemRowChildrenLength &&
        itemRowChildrenLength < 2
      ) {
        return false;
      }
      if (item.data && item.data.templatemandatory) {
        return false;
      } else {

        return validateDrop(item);
      }

      // return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  const validateDrop = (data, mandatoryComponents) => {
    let mandatoryComponent = mandatoryComponents || [];
    if (data.children) {
      data.children.length > 0 && data.children.map(item => {
        if (item.templatemandatory) {
          mandatoryComponent.push(1)
          return false;
        } else {
          validateDrop(item,mandatoryComponent);
        }
      })
    } else {
      if (data.templatemandatory) {
        mandatoryComponent.push(1);
        return false;
      }
    }
    if (mandatoryComponent.length > 0) {
      return false;
    } else {
      return true;
    }

  }
  const isActive = isOver && canDrop;
  return (
    <div
      className={classNames("trashDropZone", { active: isActive })}
      ref={drop}
    >
      <FontAwesomeIcon icon={faTrashAlt} />
      {/* Drop Columns/Component to remove */}
    </div>
  );
};
export default TrashDropZone;
