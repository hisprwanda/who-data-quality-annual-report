import React, {useState, useEffect} from 'react'


export const ModalDataTransferDestination = (props) => {
    
    let [x, setX] = useState([])

    useEffect(() => {
        setX(props.selectedElement[props.selectedElement.length - 1])
    }, [props.selectedElement])
    
    return (
        <div className='destination-parent'>
            <div>
                Selected Item {props.state.count} ---
            </div>
            <div>
                <div>
                    {
                        props.selectedElement
                    }
                </div>
            </div>
        </div>
    );
}