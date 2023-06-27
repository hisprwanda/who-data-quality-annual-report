import {useState, useEffect} from 'react'
import {
    Button,
    ButtonStrip,
    Checkbox,
    Input,
    InputField,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    MultiSelectOption,
    MultiSelectField,
    SingleSelect,
    SingleSelectOption 
  } from '@dhis2/ui'
  import { Chip } from "@dhis2/ui-core";

  import '../Modals/edit_modal_styles.css'
import { getNumeratorMemberGroups } from '../../utils/numeratorsMetadataData';

const EditModal = ({configurations, onClose, isHidden, onSave, numeratorToEdit}) => {
    const [toggleStateModal, setToggleStateModal] = useState(1);
    const [selectedGroups, setSelectedGroup] = useState(['G1']);

    // TODO: remember to improve the seeting and populating of the this modal in editing 
    const [numerator, setNumerator] = useState({
        name: '',
        definition: '',
        core:false,
    });


    const toggleTabModal = (index) => {
      setToggleStateModal(index);
    };

    useEffect(() => { 
        setNumerator({
            ...numerator, 
            code:numeratorToEdit.code,
            name:numeratorToEdit.name, 
            definition:numeratorToEdit.definition,
            core:numeratorToEdit.core
        })
    }, [numeratorToEdit]);

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
                        
                        <Input label="Name" name="name"value={numerator.name} onChange={(e) => setNumerator({...numerator, name:e.value})} required className='input'/>
                        <Input label="Definition" name="definition" value={numerator.definition} onChange={(e) => setNumerator({...numerator, definition:e.value})} required className='input' />
                        
                        {/* Use the multiselect ui */}
                        <div className='input groups'>
                            <div 
                                style={{
                                    maxWidth: 400
                                }}
                                className='group_item'
                            >
                            <MultiSelectField
                                onChange={()=>console.log('selected')}
                                selected={selectedGroups}
                            >
                                {configurations.groups.map((group, key) =>(
                                    <MultiSelectOption label={group.displayName} key={key} value={group.code} />
                                ))}
                                
                            </MultiSelectField>
                                {/* <Input label="Default label" name="defaultName" onChange={(e) => setGroups(e.value)} required /> */}
                            </div>
                            <div className='group_item'>
                                <p>Core</p>
                            </div>
                            <div className='group_item'>
                                <Checkbox
                                    checked={numerator.core}
                                    name="Ex"
                                    onChange={()=> setNumerator({...numerator, core:!numerator.core})}
                                    onFocus={()=> console.log('focused.. .')}
                                    // value="checked"
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
                        <div className="dataElementsSelector">
                        <MultiSelectField
                                onChange={()=>console.log('selected')}
                                placeholder="Data Element Group"
                                selected={[
                                    'G1'
                                ]}
                            >
                                {configurations.groups.map((group, key) =>(
                                    <MultiSelectOption label={group.displayName} key={key} value={group.code} />
                                ))}
                                
                            </MultiSelectField>
                            <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Select Data Element">
                                <SingleSelectOption label="Group one" value="1" />
                                <SingleSelectOption label="Group two" value="2" />
                                <SingleSelectOption label="Group three" value="3" />
                            </SingleSelect>
                        </div>
                

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
                        <div className="dataElementsSelector">
                            <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Indicators Groups">
                                <SingleSelectOption label="Group one" value="1" />
                                <SingleSelectOption label="Group two" value="2" />
                                <SingleSelectOption label="Group three" value="3" />
                            </SingleSelect>
                            <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Select Indicators">
                                <SingleSelectOption label="Group one" value="1" />
                                <SingleSelectOption label="Group two" value="2" />
                                <SingleSelectOption label="Group three" value="3" />
                            </SingleSelect>
                        </div>

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
                </div>

            </div>
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button  secondary onClick={onClose}>
                    Cancel
                </Button>
                <Button  primary onClick={() => onSave (numerator)}> 
                    Save
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
    </div>
  )
}

export default EditModal