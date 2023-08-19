import {useState, useEffect} from 'react'
import {
    Button,
    ButtonStrip,
    Box,
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
    SingleSelectOption,
    Transfer
  } from '@dhis2/ui'
  import { Chip } from "@dhis2/ui-core";

  import '../Modals/edit_modal_styles.css'
import { getNumeratorMemberGroups } from '../../utils/numeratorsMetadataData';

const EditModal = ({configurations, onClose, isHidden, onSave, numeratorToEdit}) => {
    const [toggleStateModal, setToggleStateModal] = useState(1);
    const [selectedGroups, setSelectedGroup] = useState(['G1']);
    const [isHiddenElementsGroups, setIsHiddenElementsGroups] = useState(true);
    const [selectedElementGroups, setSelectedElementGroups] = useState([]);
    const [isHiddenElements, setIsHiddenElements] = useState(true);
    const [selectedElements, setSelectedElements] = useState([]);
    const [selectedDataSets, setSelectedDataSets] = useState('');

    const dataElements = [
            {
                label: 'ANC 1st visit',
                value: 'ANC 1st visit'
            },
            {
                label: 'ANC 2nd visit',
                value: 'ANC 2st visit'
            },
            {
                label: 'ART No clients who stopped TRT due to TRT failure',
                value: 'ART No clients who stopped TRT due to TRT failure'
            }
    ]
    const dataElementGroups = [
        {
            label: '009-ANC',
            value: '009-ANC'
        }, {
            label: '001-OPD and IMCI',
            value: '001-OPD and IMCI'
        }, {
            label: '03 - Vaccinations',
            value: '03 - Vaccinations'
        },
    ] 
    
    const dataSets = [
        {
            label: '001 Outpatient Consultation (OPD)',
            value: '001 Outpatient Consultation (OPD)'
        }, {
            label: '002 Malaria Dataset',
            value: '002_Malaria_Dataset'
        }, {
            label: '003 Hospitalization',
            value: '003 Hospitalization'
        },
    ]

    // TODO: remove these styles from here
    const boxStyles = {
        border: '1px solid rgb(160, 173, 186)',
        borderRadius: '3px',
        marginBottom: '2px',
        minHeight: '40px',
        cursor: 'pointer',
        color: '#6c7787',
        display:'flex',
        alignItems: 'center',
        fontSize: "14px",
        lineHeight: "16px",
        paddingLeft: "11px"
    }


    // TODO: remember to improve the seeting and populating of the this modal in editing 
    const [numerator, setNumerator] = useState({
        name: '',
        definition: '',
        core:false,
    });

    const handleGroupSelection = (selectedG) => {
        setSelectedGroup(selectedG.selected)
        setNumerator({
            ...numerator,
            groups: selectedGroups
        })
    }

    const toggleTabModal = (index) => {
      setToggleStateModal(index);
    };

    useEffect(() => { 
        // set numerator with existin data
        if (numeratorToEdit.length != 0) {
            setNumerator({
                ...numerator, 
                code:numeratorToEdit.code,
                name:numeratorToEdit.name, 
                definition:numeratorToEdit.definition,
                core:numeratorToEdit.core
            })
        }else{
            setNumerator({
                name: '',
                definition: '',
                core:false,
            })
        }
        
        // set groups with existin data
        setSelectedGroup(
            getNumeratorMemberGroups(configurations, numeratorToEdit.code)
            .map((group) => group.code)
        )
    }, [isHidden]);

  return (
    <div>
        {/* Main edit modal */}
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
                            <div className='input grouping'>
                                <div 
                                    style={{
                                        maxWidth: 400,
                                        minWidth: 300
                                    }}
                                    className='group_item'
                                >
                                <MultiSelectField
                                    onChange={handleGroupSelection}
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
                                <div className="medataDataSelectionBox" style={boxStyles} onClick={() => setIsHiddenElementsGroups(false)} >
                                    <Box >
                                        {selectedElementGroups.length != 0? selectedElementGroups.map((group, key) => 
                                            <Chip key={key}>{group}</Chip>
                                        )
                                        :
                                        "Select data element groups"
                                    }
                                    </Box>
                                </div>

                                <div className="medataDataSelectionBox" style={boxStyles} onClick={() => setIsHiddenElements(false)} >
                                    <Box >
                                        {selectedElements.length != 0? selectedElements.map((group, key) => 
                                            <Chip key={key}>{group}</Chip>
                                        )
                                        :
                                        "Select data elements"
                                    }
                                    </Box>
                                </div>

                            </div>
                    

                            <h3>Data set for completeness</h3>
                            <SingleSelect className="select" 
                                onChange={(selected)=> setSelectedDataSets(selected.selected)} 
                                placeholder="Select Dataset"
                                selected={selectedDataSets}
                            >
                                {dataSets.map((dataset, key) => 
                                    <SingleSelectOption label={dataset.label} value={dataset.value} key={key} />
                                )}
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
    
        {/* TODO: put the modals below (data elements, groups, data sets, etc ) in a single modal and make it dynamic depending of type of metadata */}
        {/* Data element groups selection modal */}
        <Modal hide={isHiddenElementsGroups} position='middle'>
            <ModalContent>
                <Transfer
                    filterLabel="Select or search below"
                    filterPlaceholder="Search"
                    filterable
                    maxSelections={1}
                    onChange={(selected) => 
                        setSelectedElementGroups(selected.selected)}
                    options={dataElementGroups}
                    selected={selectedElementGroups}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button  secondary onClick={() =>setIsHiddenElementsGroups(true)}>
                        Cancel
                    </Button>
                    <Button  primary onClick={() =>setIsHiddenElementsGroups(true)}> 
                        Select
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>

        {/* Data elements selection modal */}
        <Modal hide={isHiddenElements} position='middle'>
            <ModalContent>
                <Transfer filterLabel="Select or search below" filterPlaceholder="Search" filterable options={dataElements} selected={selectedElements}
                    onChange={(selected) =>   setSelectedElements(selected.selected)}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button  secondary onClick={() =>setIsHiddenElements(true)}>
                        Cancel
                    </Button>
                    <Button  primary onClick={() =>setIsHiddenElements(true)}> 
                        Select
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>

    </div>
  )
}

export default EditModal