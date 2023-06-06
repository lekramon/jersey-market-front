import React, { useState } from "react";

const Modal = ({ showModal, setShowModal, component }: any) => {
    return (
        <>
            {showModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="absolute right-4 top-4">
                                    <button onClick={() => setShowModal(false)}>Fechar</button>
                                </div>
                                {component}
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default Modal;