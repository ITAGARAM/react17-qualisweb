import React, { useEffect, useRef } from "react";
import { Form, InputGroup } from "react-bootstrap";
import TreeMenu, { ItemComponent } from "react-simple-tree-menu";
import "react-simple-tree-menu/dist/main.css";
import { TreeMenuGroup } from "../form-tree-menu/form-tree-menu.styles";
import { AtWell } from '../App.styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const openedIcon = <FontAwesomeIcon icon={faMinus} />;
const closedIcon = <FontAwesomeIcon icon={faPlus} />;

const FormTreeMenu = ({
  name,
  onChange,
  className,
  errors,
  hasSearch,
  resetOpenNodesOnDataUpdate,
  disableKeyboard,
  activeKey,
  focusKey,
  data,
  initialOpenNodes,
  initialActiveKey,
  handleTreeClick,
  openNodes,
  placeholder,
  ...props
}) => {
  const focusRef = useRef(null);

  useEffect(() => {
  const animationFrame = requestAnimationFrame(() => {
    if (focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

      const scrollParent = focusRef.current.closest(".ps");
      if (scrollParent) {
        const top = focusRef.current.offsetTop;
        scrollParent.scrollTop = top - scrollParent.clientHeight / 2;
      }
    } else {
     // console.warn("Focus ref is null - element may not be rendered yet.");
    }
  });

  return () => cancelAnimationFrame(animationFrame);
}, [focusKey]);


  return (
    <TreeMenuGroup>
      <TreeMenu
        name={name}
        data={data}
        cacheSearch={false}
        debounceTime={125}
        disableKeyboard={disableKeyboard}
        resetOpenNodesOnDataUpdate
        initialOpenNodes={initialOpenNodes}
        onClickItem={handleTreeClick}
        openNodes={openNodes}
        activeKey={activeKey}
        focusKey={focusKey}
        initialActiveKey={initialActiveKey}
      >
        {({ search, items }) => (
          <>
            {hasSearch && (
              <AtWell>
                <Form.Group controlId="formSearch">
                  <InputGroup className="organisationtreeclass">
                    <InputGroup.Prepend>
                      <InputGroup.Text className="backgroundhidden">
                        <FontAwesomeIcon icon={faSearch} style={{ color: "#c1c7d0" }} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      placeholder={placeholder}
                      hidden={!hasSearch}
                      onKeyUp={(e) => e.keyCode === 13 ? search(e.target.value) : ""}
                    />
                  </InputGroup>
                </Form.Group>
              </AtWell>
            )}

            <ul className="list-unstyled">
              {items.map((itemProps) => {
                const isFocused = itemProps.key === focusKey;
                return (
                  <li
                    key={itemProps.key}
                    ref={isFocused ? focusRef : null}
                  >
                    <ItemComponent
                      {...itemProps}
                      openedIcon={openedIcon}
                      closedIcon={closedIcon}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </TreeMenu>
    </TreeMenuGroup>
  );
};

export default FormTreeMenu;
