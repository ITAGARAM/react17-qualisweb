import React from "react";
import classNames from "classnames";
import { useDrag, useDrop } from "react-dnd";
import "./styles.css"
const ACCEPTS = ["sidebarItem", "column", "component", "componentrow", "row"];

const DropArea = ({ data, onDrop, isLast, className, isEmpty }) => {

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath.split("-");
      const itemPath = item.path;

      // sidebar items can always be dropped anywhere
      if (!itemPath) {
        if (splitDropZonePath.length === 1) {
          if (data.childrenCount === 1) {
            return false;
          }
          //  return false;
        }
        return true;
      }

      const splitItemPath = itemPath.split("-");

      // limit columns when dragging from one row to another row
      const dropZonePathRowIndex = splitDropZonePath[0];
      const itemPathRowIndex = splitItemPath[0];
      const diffRow = dropZonePathRowIndex !== itemPathRowIndex;
      if (
        diffRow &&
        splitDropZonePath.length === 2 &&
        data.childrenCount >= 3
      ) {
        return false;
      }


      // Invalid (Can't drop a parent element (row) into a child (column))
      const parentDropInChild = splitItemPath.length < splitDropZonePath.length;
      if (parentDropInChild) return false;

      // Current item can't possible move to it's own location
      if (itemPath === dropZonePath) return false;

      // Current area
      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-");
        const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
      }

      if (splitItemPath.length > 1) {
        if (splitDropZonePath.length === 1) {
          return false;
        } else {
          return true;
        }
      }


      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = !isOver && canDrop;
  const isOkay = isOver && canDrop;
  return (
    <div
      className={classNames(`${isEmpty ? "emptyDropZone" : "dropZone"}`, `${isActive ? 'active' : isOkay ? "okay" : ""}`, isLast, className)}
      ref={drop}
   
      ></div>
  );
};
export default DropArea;
