import React from "react";

const Content = ({ color, icon, title, description }) => {
    return (
        <div className="info-box">
      <span className={`info-box-icon ${color}`}>
        <i className={icon} />
      </span>
            <div className="info-box-content">
                <span className="info-box-text">{title}</span>
                <span className="info-box-number">{description}</span>
            </div>
        </div>
    );
};

export default Content;
