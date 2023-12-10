import React from "react";

function Parent() {
    function parentClick() {
        console.log("Parent Clicked!");
    }

    function childClick(e) {
        e.stopPropagation();
        console.log("Child Clicked!");
    }

    return (
        <div
            id="parent"
            onClick={parentClick}
            style={{ border: "1px solid red" }}
        >
            <button id="child" onClick={childClick}>
                Click Me!
            </button>
        </div>
    );
}

export default Parent;