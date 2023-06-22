/*
Author: Joseph MANZI
Company: HISP Rwanda
Date: May, 30 2023
The page used to present the user interface for the user to manage the reports
*/

import React, { useEffect, useReducer, useState } from 'react'
import { Modal, ModalTitle, ModalActions, ModalContent, MultiSelect, MultiSelectField, MultiSelectOption, ButtonStrip, Button} from '@dhis2/ui'
import './styles/datasets.css'
import { ModalDataTransfer } from './ModalDataTransfer'
import { SearchDataComponent } from '../../search-data/SearchData.Component'
import { ModalDataTransferDestination } from './ModalDataTransferDestination'
import { dataSetQueryStructure } from '../../datasource/dataset/dataset.source'

export const DataSetModal = (props) => {

    const [_selectedElement, setSelectedItem] = useState('')
    const [allSelectedElement, setAllSelectedElements] = useState([])
    
    return (
        <Modal hide={props.status} position="top" fluid onClose={() => props.changeDataModalStatus(true)}>
          <ModalTitle>
             Data
          </ModalTitle>
          <ModalContent>
            <div className='data-set-modal-parent'>
                <div>
                    {!props.status && <SearchDataComponent clickedElement={setSelectedItem}/>}
                </div>
                <div>
                    <ModalDataTransfer />
                </div>
                <div>
                    <ModalDataTransferDestination selectedElement={_selectedElement}/>
                </div>
            </div>
          </ModalContent>
          <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => {}} >Hide</Button>
                </ButtonStrip>
                <div className='divider'></div>
                <ButtonStrip end>
                    <Button onClick={() => {}} primary>Update</Button>
                </ButtonStrip>
          </ModalActions>
      </Modal>
    )
}