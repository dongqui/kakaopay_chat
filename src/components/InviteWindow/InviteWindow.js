import React from 'react';
import './InviteWindow.css';

const InviteWindow = ({showModal, children }) => {
  const showHideClassName = showModal ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
      </section>
    </div>
  );
};

export default InviteWindow;