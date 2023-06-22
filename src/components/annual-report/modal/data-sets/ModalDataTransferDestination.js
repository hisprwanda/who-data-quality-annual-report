import React from 'react'

export const ModalDataTransferDestination = (props) => {
    return (
        <div className='destination-parent'>
            <div>
                Selected Item
            </div>
            <div>
                <ul>
                    <li>
                        {props.selectedElement}
                    </li>
                </ul>
            </div>
        </div>
    );
}