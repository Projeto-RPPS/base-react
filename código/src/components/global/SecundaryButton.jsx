import React from "react";

const SecondaryButton = ({label, onClick}) => {
    return (
        <button type="button" className="br-button block secondary mb-3" onClick={onClick}>
            {label}
        </button>
    );
}

export default SecondaryButton;