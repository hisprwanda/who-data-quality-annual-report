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
  import { useDataQuery, useAlert } from "@dhis2/app-runtime";


  import '../Modals/edit_modal_styles.css'
import { filterSelectedMetadata, getNumeratorMemberGroups } from '../../utils/numeratorsMetadataData';
import { generateNumeratorCode } from '../../utils/generateNumeratorCode';


const dataElementGroupsQuery = {
    elements: {
      resource: 'dataElementGroups',
      params: {
        paging: false,
      }
    }
  };

  const dataElementsQuery = {
    elements: {
      resource: 'dataElements',
      params: ({groupID}) =>({
        paging: false,
        filter: `dataElementGroups.id:eq:${groupID}`
      }),
    },
  };

  const dataSetsQuery = {
    dataSets: {
      resource: 'dataElements',
      id: ({elementID}) => elementID,
      params: {
        fields: 'dataSets[displayName,id,periodType],dataSetElements[dataSet[displayName,id,periodType]'
      },
    },

    dataElementOperands: {
        resource: 'dataElementOperands',
        params: ({elementID}) =>({
        fields: 'displayName,id',
        paging: false,
        filter: `dataElement.id:eq:${elementID}`
      }),
      },
  };


const UpdateNumeratorsModal = ({configurations, onClose, isHidden, onSave, numeratorToEdit, updateType}) => {
    const [toggleStateModal, setToggleStateModal] = useState(1);
    const [selectedGroups, setSelectedGroup] = useState([]);
    const [isHiddenElementsGroups, setIsHiddenElementsGroups] = useState(true);
    const [selectedElementGroups, setSelectedElementGroups] = useState([]);
    const [isHiddenElements, setIsHiddenElements] = useState(true);
    const [selectedElements, setSelectedElements] = useState([]);
    const [selectedDataSets, setSelectedDataSets] = useState('');
    const [selectedOperands, setSelectedOperands] = useState([]);
    const [filteredSelectedElementGroups, setFilteredSelectedElementGroups] = useState([]);
    const [filteredSelectedElements, setFilteredSelectedElements] = useState([]);

    const [mappedDataElementGroups, setMappedDataElementGroups]  = useState([]);
    const [mappedDataElements, setMappedDataElements] = useState([]);
    const [mappedDataSets, setMappedDataSets] = useState([]);
    const [mappedDataElementOperands, setMappedDataElementOperands] = useState([]);
    const [footerMessage, setFooterMessage] = useState(null);

    // run the data element groups querry
    const { loading: lementGroupsLoading, error:elementGroupsError, data:datalementGroupsData, refetch:lementGroupsRefetch } = useDataQuery(dataElementGroupsQuery, {
        lazy: false,
    });

    // run the data elements querry
    const { loading: elementsLoading, error:elementsError, data:dataElementsData, refetch:elementsRefetch } = useDataQuery(dataElementsQuery, {
        lazy: true,
    });

    // run the datasets querry
    const { loading: dataSetsLoading, error:dataSetsError, data:dataSetsData, refetch:dataSetsRefetch } = useDataQuery(dataSetsQuery, {
        lazy: true,
    });

    // TODO with TOM: is there a neat way to map value & label of metadata below
    useEffect(() => { 
    if (datalementGroupsData) {
        let deGroups  = datalementGroupsData.elements.dataElementGroups;
        setMappedDataElementGroups(deGroups.map(({ id, displayName }) => ({
            value: id,
            label: displayName
          })));    
      }
    }, [datalementGroupsData]);

      useEffect(() => { 
          if (dataElementsData) {
            let dataElements  = dataElementsData.elements.dataElements;
            setMappedDataElements(dataElements.map(({ id, displayName }) => ({
                value: id,
                label: displayName
              })));    
          }
    }, [dataElementsData]);


    useEffect(() => {
      if (dataSetsData) {
        let dataSets  = dataSetsData.dataSets.dataSetElements;
        setMappedDataSets(dataSets.map(({ dataSet }) => ({
            value: dataSet.id,
            label: dataSet.displayName
        })));   
        
        // set the data element operands
        let operands  = dataSetsData.dataElementOperands.dataElementOperands;
        setMappedDataElementOperands(operands.map(({ id, displayName }) => ({
            value: id,
            label: displayName
        })));   
        }
    }, [dataSetsData]);



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

    const newCode = generateNumeratorCode(configurations.numerators);

    const [numerator, setNumerator] = useState({
        name: '',
        definition: '',
        core:false,
    });

    const handleGroupSelection = (selectedG) => {
        setSelectedGroup(selectedG.selected)
        setNumerator({
            ...numerator,
            code: newCode,
            groups: selectedGroups
        })
    }

    const toggleTabModal = (index) => {
      setToggleStateModal(index);
    };

    useEffect(() => { 
        if (updateType == 'create') {
            // resetting state values
            setNumerator({
                name: '',
                definition: '',
                core:false,
            })
            setSelectedGroup([])
            
        } else if (updateType == 'update') {
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
        }
    }, [isHidden]);

    useEffect(() => {
        setFilteredSelectedElementGroups(
            filterSelectedMetadata(mappedDataElementGroups, selectedElementGroups)
        );
    }, [selectedElementGroups]);

    useEffect(() => {
        setFilteredSelectedElements(
            filterSelectedMetadata(mappedDataElements, selectedElements)
        );
    }, [selectedElements]);

    useEffect(() => {
        if (filteredSelectedElements[0] && numerator.name) {
            setFooterMessage(`"${numerator.name}" will be mapped to ${filteredSelectedElements[0].label}`)
        }
    }, [filteredSelectedElements])


  return (
    <div>
        {/* Main update modal */}
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
                                        maxWidth: 300,
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
                                        {filteredSelectedElementGroups.length != 0? filteredSelectedElementGroups.map((group, key) => 
                                            <Chip key={key}>{group.label}</Chip>
                                        )
                                        :
                                        "Select data element groups"
                                    }
                                    </Box>
                                </div>

                                <div className="medataDataSelectionBox" style={boxStyles} onClick={() => setIsHiddenElements(false)} >
                                    <Box >
                                        {filteredSelectedElements.length != 0? filteredSelectedElements.map((group, key) => 
                                            <Chip key={key}>{group.label}</Chip>
                                        )
                                        :
                                        "Select data elements"
                                    }
                                    </Box>
                                </div>

                            </div>
                    

                            <h3>Data set for completeness</h3>
                            <SingleSelect 
                                className="select" 
                                disabled={mappedDataSets.length > 0? false:true}

                                onChange={(selected)=> {
                                    setNumerator({...numerator, dataSetID:selected.selected})
                                    setSelectedDataSets(selected.selected)
                                }}

                                placeholder="Select Dataset"
                                selected={selectedDataSets}
                            >
                                {mappedDataSets.map((dataset, key) => 
                                    <SingleSelectOption label={dataset.label} value={dataset.value} key={key} />
                                )}
                            </SingleSelect>

                            <h3>Variable for completeness</h3>
                            <SingleSelect 
                                className="select" 
                                disabled={mappedDataElementOperands.length > 0? false:true}
                                onChange={(selected)=> {
                                    setSelectedOperands(selected.selected);
                                    setNumerator({...numerator, dataElementOperandID:selected.selected})

                                }} 
                                placeholder="Select Variable"
                                selected={selectedOperands}
                            >
                                {mappedDataElementOperands.map((operand, key) => 
                                    <SingleSelectOption label={operand.label} value={operand.value} key={key} />
                                )}                            
                            </SingleSelect>
                            <p>{footerMessage}</p>
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
                    <Button  primary onClick={() => onSave(numerator)}> 
                        Create
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
                    onChange={(selected) => {
                        setSelectedElementGroups(selected.selected);
                        setFilteredSelectedElements([]);
                        elementsRefetch({ groupID: selected.selected});     // fetch data elements only after a data element group has been selected
                        setNumerator({...numerator, dElementGroup:selected.selected[0]})
                    }}
                    options={mappedDataElementGroups}
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
                <Transfer 
                    filterLabel="Select or search below" 
                    filterPlaceholder="Search" 
                    filterable 
                    maxSelections={1}
                    options={mappedDataElements} 
                    selected={selectedElements}
                    disabled
                    onChange={ (selected) =>   {
                        setSelectedElements(selected.selected);
                        setMappedDataSets([]);
                        setMappedDataElementOperands([]);
                        dataSetsRefetch({elementID: selected.selected[0]})  // fetch datasets only after a data element has been selected
                        setNumerator({...numerator, dataID:selected.selected[0]})

                    }}
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

export default UpdateNumeratorsModal