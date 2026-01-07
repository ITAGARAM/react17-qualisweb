import { useCallback, useRef, useState } from "react";

const LongPress = (
    onLongPress,
    onClick,
    { shouldPreventDefault = true, delay = 300 } = {}
    ) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef();
    const target = useRef();

    const start = useCallback(
        event => {

           // console.log('event' , event)
            if (shouldPreventDefault && event.target) {
                    event.target.addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            setLongPressTriggered(false);
            timeout.current = setTimeout(() => {
                setLongPressTriggered(true);
            }, delay);
            event.preventDefault();
            event.stopPropagation();
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event, shouldTriggerClick) => {
            //console.log('event' , event)
            timeout.current && clearTimeout(timeout.current);
            !longPressTriggered && onClick();
            longPressTriggered && onLongPress(event);
            setLongPressTriggered(false);
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener("touchend", preventDefault);
            }
        },
        [shouldPreventDefault, onClick, longPressTriggered]
    );

    return {
        onMouseDown: e => start(e , true),
        onTouchStart: e => start(e , true),
        onMouseUp: e => clear(e , true),
        onTouchEnd: e => clear(e, false)
    };
};

const isTouchEvent = event => {
return "touches" in event;
};

const preventDefault = event => {
if (!isTouchEvent(event)) return;

if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
}
};

export default LongPress;