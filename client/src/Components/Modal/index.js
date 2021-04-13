import React from 'react';
import styles from './styles.module.css';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, closeModel, children }) => ReactDOM.createPortal(
    isOpen === false  ? <React.Fragment></React.Fragment> :
    <div className={styles["modal"]}>
    <div className={styles["exit"]} onClick={() => closeModel(false)} >&#x2716;</div>
    <div className={styles["container"]}>
      {children}
    </div>
    </div>,
    document.getElementById('portal')
);

export default Modal;
