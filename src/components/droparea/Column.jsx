import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "./constants";
import DropArea from "./DropArea.jsx";
import "./styles.css"
import Componentrow from "./Componentrow";

const style = {};
const Column = ({ data, components, baselength, handleDrop, validateDrop, path, onclickcomponent, deleteInput, selectedFieldRecord,  slanguagetypecode }) => {
  const ref = useRef(null);
  const mandatoryCheck = [];
  const [{ isDragging }, drag] = useDrag({
    
    type: COLUMN,
    item: {
      type: COLUMN,
      id: data.id,
      children: data.children,
      path
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
      return (
      <Componentrow
        key={component.id}
        data={component}
        baselength= {baselength}
        components={components}
        path={currentPath}
        handleDrop={handleDrop}
        deleteInput={deleteInput}
        validateDrop={validateDrop}
        onclickcomponent={onclickcomponent}
        selectedFieldRecord={selectedFieldRecord}
        slanguagetypecode={slanguagetypecode}
        >
              </Componentrow>
    );
  };

    return (
        <div class="position-relative column">
          {data.children && data.children.map(item=>{
            if(item.children){
                item.children.map(item2=>{
                  if(item2.templatemandatory){
                    mandatoryCheck.push(item2.templatemandatory);
                   }
                })
            }else{
              if(item.templatemandatory){
                mandatoryCheck.push(item.templatemandatory);
               }
            }
          })}
        {mandatoryCheck.length === 0 &&
                <a class="position-absolute delete-dynamic-row" onClick={(e) => deleteInput(e,data, {
                  type: COLUMN,
                  id: data.id,
                  data: data,
                  path
              })}><i class="fa fa-times-circle" aria-hidden="true"></i></a>
        }
          
        
      
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable"

      >

          
      {/* {"Column"} */}
      {data.children ? data.children.map((component, index) => {
        const currentPath = `${path}-${index}`;

        return (
            <React.Fragment key={component.id}>
            <DropArea
              data={{
                path: currentPath,
                childrenCount: data.children.length
              }}
              onDrop={handleDrop}
            />
            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      }) : ""}
      <DropArea
        data={{
          path: `${path}-${data.children.length}`,
          childrenCount: data.children.length
        }}
              onDrop={handleDrop}
              deleteInput={deleteInput}
        isLast
      />
    </div>
    </div>
  );
};
export default Column;
