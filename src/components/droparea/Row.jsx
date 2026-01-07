import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ROW,COLUMN } from "./constants";
import DropArea from "./DropArea.jsx";
import Column from "./Column";
import { COMPONENT, COMPONENTROW } from "./constants";
import "./styles.css"

const style = {};
const DynamicRow = ({ data, components, baselength, handleDrop, deleteInput, validateDrop, className, path, indexrow, onclickcomponent, selectedFieldRecord,slanguagetypecode }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({

    type: ROW,
    item: {
      type: ROW,
      children: data.children,
      path
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderColumn = (column, currentPath) => {
    return (
      <Column
        key={column.id}
        data={column}
        baselength={baselength}
        components={components}
        handleDrop={handleDrop}
        deleteInput={deleteInput}
        validateDrop={validateDrop}
        path={currentPath}
        onclickcomponent={onclickcomponent}
        selectedFieldRecord={selectedFieldRecord}
        slanguagetypecode={slanguagetypecode}
      />
    );
  };
  const classes = {
    1 :"one",
    2: "two",
    3: "three",
    4: "four"
  }

  return (
    <div ref={ref} style={{ ...style, opacity }} className={`base draggable row ${data.children && data.children.length > 0 ? classes[data.children.length] : ""}`}>
      {/* {"Row"}{indexrow} */}
      <div className="columns">
        {data.children.map((column, index) => {
          const currentPath = `${path}-${index}`;

            return (
            <React.Fragment key={column.id}>
              {data.children.length < 3 && <DropArea
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                }}
                onDrop={handleDrop}
                className="horizontalDrag"
              />
              }
                    {renderColumn(column, currentPath)} 

                
                    </React.Fragment>
                    
          );
        })}
        {data.children.length < 3 &&
          <DropArea
            data={{
              path: `${path}-${data.children.length}`,
              childrenCount: data.children.length
            }}
            onDrop={handleDrop}
            className="horizontalDrag"
            isLast
          />
        }
      </div>
    </div>
  );
};
export default DynamicRow;
