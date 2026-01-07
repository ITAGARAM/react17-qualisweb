import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import Componentexp from "./Componentexp";
import { COMPONENT, COMPONENTROW } from "./constants";
import DropArea from "./DropArea";
import "./styles.css"


const Componentrow = ({ data, components, baselength, path, handleDrop, deleteInput, onclickcomponent, selectedFieldRecord,  slanguagetypecode }) => {
  const ref = useRef(null);
  let deleteButton;  
  const mandatoryCheck = [];
    if(data.children){
      data.children.map((item2) =>{
        if(item2.templatemandatory){
          mandatoryCheck.push(item2.templatemandatory);
        }
    })
    if(mandatoryCheck.length === 0 ){
      deleteButton = <a class="order-3 delete-component-row-btn" onClick={(e) => deleteInput(e,data, {
        type: COMPONENTROW,
        id: data.id,
        data: data,
        path
    })}><i class="fa fa-times-circle align-middle red" aria-hidden="true"></i></a>;
    }
  }

  const [{ isDragging }, drag] = useDrag({

    type: COMPONENT,
    item: {
      type: COMPONENT,
      id: data.id,
      data: data,
      children: data.children,
      path
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const style = {
    border: `${data.children ? "1px dashed #ddd" : ""}`,
    padding: `${data.children ? "10px 0px" : ""}`,
    margin: `${data.children ? "0 -3px 0 11px" : ""}`,
    //padding: "0rem 1rem",
    // backgroundColor: "white",
    cursor: "move"
  };
  const getScale = () => {
    let scale = 1;
    if (data.children && data.children.length) {
      if (baselength == 1) {
        if (data.children.length < 10) {
          scale = 1 - (("." + data.children.length) / 2)
        } else {
          scale = .5 - (("." + data.children.length))
        }
      } else if (baselength == 2) {
        if (data.children.length < 10) {
          scale = 1 - (("." + data.children.length) / 1.2)
        } else {
          scale = .5 - (("." + data.children.length))
        }
      } else if (baselength == 3) {
        if (data.children.length < 10) {
          scale = 1 - (("." + data.children.length) / .7)
        } else {
          scale = .5 - (("." + data.children.length))
        }
      } else if (baselength == 4) {
        if (data.children.length < 10) {
          scale = 1 - (("." + data.children.length) / .6)
        } else {
          scale = .5 - (("." + data.children.length))
        }
      }



    }
    return scale < .2 ? .2 : scale;
  }
  const opacity = isDragging ? 0 : 1;
  drag(ref);

  //const component = components[data.id];



  const renderColumn = (column, currentPath) => {
    return (
      <Componentexp
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        deleteInput={deleteInput}
        path={currentPath}
        onclickcomponent={onclickcomponent}
        selectedFieldRecord={selectedFieldRecord}
        slanguagetypecode={slanguagetypecode}
      />
    );
    };

  return (
    <div ref={ref} style={{ ...style, opacity }} className={`base draggable component-row-column row`}>
      <div className="columns d-flex justify-content-center position-relative">
      {deleteButton}
      {/* {data.templatemandatory != true &&
      <a class="order-3 delete-dynamic-row" onClick={(e) => deleteInput(data, {
            type: COMPONENTROW,
            id: data.id,
            data: data,
            path
        })}><i class="fa fa-times-circle align-middle red" aria-hidden="true"></i></a>
      } */}
        {data.children ?
          data.children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            return (
              <React.Fragment key={column.id}>
                {data.children.length < 2 &&
                            <DropArea
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
          }) :
          <React.Fragment key={data.id}>
            <DropArea
              data={{
                path: `${path}-${0}`,
                childrenCount: 1,
              }}
              onDrop={handleDrop}
              className="horizontalDrag"
                          />
            {renderColumn(data, `${path}-${0}`)}
          </React.Fragment>
        }
        {(data.children === undefined || data.children.length < 2 )&&
          <DropArea
            data={{
              path: data.children ? `${path}-${data.children.length}` : `${path}-${1}`,
              childrenCount: data.children ? data.children.length : 1
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
export default Componentrow;
