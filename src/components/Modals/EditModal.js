import {useState} from 'react'
import {
    Button,
    ButtonStrip,
    Checkbox,
    Input,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SingleSelect,
    SingleSelectOption 
  } from '@dhis2/ui'

  import '../Modals/edit_modal_styles.css'

const EditModal = ({onClose, isHidden, onSave}) => {
    const [editData, setEditData] = useState(null);
    const handleInputChange = (e) => {
        console.log('Current e: ', e.value)
    }

    const [toggleStateModal, setToggleStateModal] = useState(1);

    const toggleTabModal = (index) => {
      setToggleStateModal(index);
    };


  return (
    <div>
        <Modal onClose={onClose} hide={isHidden} position="middle" large>
        <ModalTitle>
            Numerators Mapping to Data Elements
        </ModalTitle>
        <ModalContent>
            <div className='modal_content'>

                <div className='modal_top_content'>
                    <div className='left'>
                        <p>Name</p> 
                        <p>Definition</p> 
                        <p>Groups</p> 
                    </div>
                    <div className="right">
                        
                        <Input label="Default label" name="defaultName" onChange={(e) => handleInputChange(e)} required className='input'/>
                        <Input label="Default label" name="defaultName" onChange={(e) => handleInputChange(e)} required className='input' />
                        
                        <div className='input groups'>
                            <div className='group_item'>
                                <Input label="Default label" name="defaultName" onChange={(e) => handleInputChange(e)} required />
                            </div>
                            <div className='group_item'>
                                <p>Core</p>
                            </div>
                            <div className='group_item'>
                                <Checkbox
                                    checked
                                    name="Ex"
                                    onChange={()=> console.log('cheched...')}
                                    onFocus={()=> console.log('focused.. .')}
                                    value="checked"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                

                <h3>Data Mapping</h3>
                    <div className='dataElementsIndicatorToggle bloc-tabs-modal'>
                        <button className={toggleStateModal === 1 ? "tabs-modal active-tabs-modal" : "tabs-modal"} onClick={() => toggleTabModal(1)} >Data elements </button>
                        <button className={toggleStateModal === 2 ? "tabs-modal active-tabs-modal" : "tabs-modal"} onClick={() => toggleTabModal(2)}>Indicators</button>
                    </div>

                
                <div className='content-tabs-modal'>
                    <div className={toggleStateModal === 1 ? "content-modal  active-content-modal" : "content-modal"} >
                        <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Data Element Groups">
                            <SingleSelectOption label="Group one" value="1" />
                            <SingleSelectOption label="Group two" value="2" />
                            <SingleSelectOption label="Group three" value="3" />
                        </SingleSelect>
                        <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Data Element Groups">
                            <SingleSelectOption label="Group one" value="1" />
                            <SingleSelectOption label="Group two" value="2" />
                            <SingleSelectOption label="Group three" value="3" />
                        </SingleSelect>
                

                        <h3>Data set for completeness</h3>
                        <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Select Dataset">
                            <SingleSelectOption label="Group one" value="1" />
                            <SingleSelectOption label="Group two" value="2" />
                            <SingleSelectOption label="Group three" value="3" />
                        </SingleSelect>

                        <h3>Variable for completeness</h3>
                        <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Select Variable">
                            <SingleSelectOption label="Group one" value="1" />
                            <SingleSelectOption label="Group two" value="2" />
                            <SingleSelectOption label="Group three" value="3" />
                        </SingleSelect>
                        <p>"DPT 1" will be mapped to "Penta 1 doses given"</p>
                    </div>

                    <div className={toggleStateModal === 2 ? "content-modal  active-content-modal" : "content-modal"}>
                        <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Indicators Groups">
                            <SingleSelectOption label="Group one" value="1" />
                            <SingleSelectOption label="Group two" value="2" />
                            <SingleSelectOption label="Group three" value="3" />
                        </SingleSelect>
                        <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Indicators Groups">
                            <SingleSelectOption label="Group one" value="1" />
                            <SingleSelectOption label="Group two" value="2" />
                            <SingleSelectOption label="Group three" value="3" />
                        </SingleSelect>
                
                        <p>"DPT 1" will be mapped to "Penta 1 doses given"</p>
                    </div>
                </div>

            </div>
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button  secondary onClick={onClose}>
                    Cancel
                </Button>
                <Button  primary onClick={() => onSave (editData)}> 
                    Save
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
    </div>
  )
}

export default EditModal