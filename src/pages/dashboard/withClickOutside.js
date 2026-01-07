import React, { useState, useRef, useEffect } from "react";

export default function withClickOutside(WrappedComponent) {
  const Component = (props) => {
    const [show, setShow] = useState(false);

    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref&&ref.current&& !ref.current.contains(event.target)) {
            setShow(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return <WrappedComponent show={show} setShow={setShow} ref={ref} {...props} />;
  };

  return Component;
}
