import {useState, useEffect} from 'react'
import {
    Button,
    ButtonStrip,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconDelete16,
    IconEdit16,
    IconAdd16,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SingleSelect,
    SingleSelectOption,
  } from '@dhis2/ui'
import { getAllDenominatorType, getDenominatorType } from '../../../utils/denominatorsMetadataData';
import { useDataQuery, useDataMutation, useAlert } from "@dhis2/app-runtime";
import { createNewDenominator } from '../../../utils/updateConfigurations';

// TODO: move different queries to their own file when they become many
const updateConfigurationsMutation = {
  resource: 'dataStore/who-dqa/configurations',
  type: 'update',
  data: ({ configurations }) => ({
      ...configurations,
      lastUpdated: new Date().toJSON(),
  }),
}


//TODO: merge some queries below 
const dataElementGroupsQuery = {
  elements: {
    resource: 'dataElementGroups',
    params: {
      paging: false,
    }
  }
};

const orgUnitLevelsQuery = {
  ou: {
    resource: 'organisationUnitLevels',
    params: {
      fields:'displayName,id,level',
      paging: false
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


export const Denominators = ({toggleState, configurations}) => {
  const [denominators, setDenominators] = useState(null);
  const [toggleStateModal, setToggleStateModal] = useState(1);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [denominatorTypes, setDenominatorTypes] = useState(null);
  const [mappedDataElementGroups, setMappedDataElementGroups]  = useState(null);
  const [mappedDataElements, setMappedDataElements] = useState(null);
  const [orgUnitsLevels, setOrgUnitsLevels] = useState(null);
  const [selectedElementsGroup, setSelectedElementsGroup] = useState(null);
  const [newDenominatorInfo, setNewDenominatorInfo] = useState({
    code: "",
    dataID: "",
    displayName: "",
    lowLevel: "",
    name: "",
    type: ""
  });



     // run the data element groups querry
     const { loading: lementGroupsLoading, error:elementGroupsError, data:datalementGroupsData, refetch:lementGroupsRefetch } = useDataQuery(dataElementGroupsQuery, {
      lazy: false,
  });

  // run the data elements querry
  const { loading: elementsLoading, error:elementsError, data:dataElementsData, refetch:elementsRefetch } = useDataQuery(dataElementsQuery, {
      lazy: true,
  });

  // run the data orgUnits querry
  const { loading: orgUnitsLoading, error:orgUnitsError, data:dataOrgUnitsData, refetch:orgUnitsRefetch } = useDataQuery(orgUnitLevelsQuery, {
      lazy: false,
  });

  // run mutation querry
  const [mutate, { error, data }] = useDataMutation( updateConfigurationsMutation )

  const toggleTabModal = (index) => {
    setToggleStateModal(index);
  };

  const onModalClose = () => {
    setIsModalHidden(true)
  }
  const onSaveDenominator = async(newDenominatorInfo) => {
    const updatedConfigurations =  createNewDenominator(configurations, newDenominatorInfo);       
    await mutate({ configurations: updatedConfigurations })
  
    //update the current list
    setDenominators(denominators => [...denominators, newDenominatorInfo]);
    setIsModalHidden(true)
  }

  const handleDataElementSelection = (value) => {
    //getting the details of a selected data element for name and display name
    const selectedItem = mappedDataElements.find(element => element.value === value.selected);
    setNewDenominatorInfo({
      ...newDenominatorInfo, 
      dataID:value.selected,
      displayName: selectedItem.label,
      name: selectedItem.label,
    })
  }


  useEffect(() => {
    setDenominators(configurations.denominators)

    // get denominator types
    setDenominatorTypes(getAllDenominatorType())

     // generate and set the code before saving
     {configurations && (
       setNewDenominatorInfo({
        ...newDenominatorInfo, code:"P"+ (configurations.denominators.length + 1) //TODO: further checks are needed in case some denominators have been deleted or the code is taken
      })
     )
    }

  }, [])
      

   // TODO these 2 use effects below are duplicated in other components, do it once and save it globaly
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
          if (dataOrgUnitsData) {
            setOrgUnitsLevels(dataOrgUnitsData.ou.organisationUnitLevels)   
          }
    }, [dataOrgUnitsData]);


  return (
    
    <div className={toggleState === 5 ? "content  active-content" : "content"} >
      <p>Please map alternative denominators for comparison, for example denominiators from the National Bureau of Statistics with denominators used by health programmes.</p>
      <hr />
      
      <div className="denominatorsContainer">
        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>Data element/indicator</TableCellHead>
                    <TableCellHead>Type</TableCellHead>
                    <TableCellHead>Actions</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
              {denominators? denominators.map((denominator, key) => (
                <TableRow key={key}>
                    <TableCell>{denominator.name}</TableCell>
                    <TableCell>	{getDenominatorType(denominator.type).label}</TableCell>
                    <TableCell>
                      <Button
                          name="Primary button" onClick={()=>setIsModalHidden(false)} 
                          basic button value="default" icon={<IconEdit16 />}> Edit
                      </Button>
                      <Button
                          name="Primary button" onClick={() => console.log('deleting denominator...')} 
                          destructive button value="default" icon={<IconDelete16 />}> Delete
                      </Button>
                    </TableCell>
                </TableRow>
                
              ))
              :
              <TableRow><TableCell></TableCell></TableRow>
            }

              {/* Add button */}

              <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell> 
                    <Button
                        name="Primary button" onClick={()=>setIsModalHidden(false)} 
                        primary button value="default" icon={<IconAdd16 />}> Add Denominator
                    </Button>
                  </TableCell>
              </TableRow>
            </TableBody>
        </Table>

      </div>

      {/* TODO: will move this modal in it's own component */}
      <Modal onClose={onModalClose} hide={isModalHidden}  position="middle" large>
            <ModalTitle>
                Add Denominator
            </ModalTitle>
            <ModalContent>
              <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                          <p>Type</p> 
                        </TableCell>
                        <TableCell>
                            <SingleSelect className="select" 
                              onChange={(value)=> setNewDenominatorInfo({...newDenominatorInfo, type:value.selected})}

                              placeholder="Select denominator type"
                              selected={newDenominatorInfo.type}
                            >
                              {denominatorTypes? denominatorTypes.map((type, key) => 
                                  <SingleSelectOption label={type.label} value={type.value} key={key} />
                              ) : "" }
                            </SingleSelect>
                        </TableCell>                      
                    </TableRow>
                    <TableRow>
                        <TableCell>
                          <p>Denominator</p> 
                        </TableCell>
                        <TableCell>
                          <div className='denominatorSelection'>
                              <div className='dataElementsIndicatorToggle bloc-tabs-modal'>
                                  <button className={toggleStateModal === 1 ? "tabs-modal active-tabs-modal" : "tabs-modal"} onClick={() => toggleTabModal(1)} >Data element</button>
                                  <button className={toggleStateModal === 2 ? "tabs-modal active-tabs-modal" : "tabs-modal"} onClick={() => toggleTabModal(2)}>Indicator</button>
                              </div>                
                              <div className='content-tabs-modal'>
                                  <div className={toggleStateModal === 1 ? "content-modal  active-content-modal" : "content-modal"} >
                                  <div className="dataElementsSelector">
                                          <SingleSelect className="select"
                                            onChange={(value)=> {
                                              setSelectedElementsGroup(value.selected);
                                              setNewDenominatorInfo({...newDenominatorInfo, dataID:""}) //resets the previous value for new data elements to be refetched
                                              elementsRefetch({ groupID: value.selected});     // fetch data elements only after a data element group has been selected
                                            }}
                                            placeholder="Data element group"
                                            selected={selectedElementsGroup}
                                          >
                                                  {mappedDataElementGroups? mappedDataElementGroups.map((group, key) => 
                                                      <SingleSelectOption label={group.label} value={group.value} key={key} />
                                                  ) : "" }                            
                                          </SingleSelect>
                                          <SingleSelect className="select"
                                            onChange={handleDataElementSelection}
                                            placeholder="Select data element" 
                                            disabled={mappedDataElements? false:true}
                                            selected={newDenominatorInfo.dataID}
                                          >
                                                  {mappedDataElements? mappedDataElements.map((element, key) => 
                                                      <SingleSelectOption label={element.label} value={element.value} key={key} />
                                                  ) : "" }                            
                                          </SingleSelect>
                                      </div>
                                  </div>

                                  <div className={toggleStateModal === 2 ? "content-modal  active-content-modal" : "content-modal"}>
                                  <div className="dataElementsSelector">
                                          <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Select indicator group">
                                              <SingleSelectOption label="Group one" value="1" />
                                              <SingleSelectOption label="Group two" value="2" />
                                              <SingleSelectOption label="Group three" value="3" />
                                          </SingleSelect>
                                          <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Select data element">
                                              <SingleSelectOption label="Group one" value="1" />
                                              <SingleSelectOption label="Group two" value="2" />
                                              <SingleSelectOption label="Group three" value="3" />
                                          </SingleSelect>
                                      </div>
                                  </div>
                              </div>
                            </div>
                        </TableCell>                      
                    </TableRow>
                    <TableRow>
                        <TableCell>
                          <p>Lowest available level</p>
                        </TableCell>
                        <TableCell>
                            <SingleSelect className="select" 
                              onChange={(value)=> setNewDenominatorInfo({...newDenominatorInfo, lowLevel:value.selected})} 
                              placeholder="Select Level"
                              selected={newDenominatorInfo.lowLevel.toString()}
                              >
                                  {orgUnitsLevels? orgUnitsLevels.map((ouLevel, key) => 
                                      <SingleSelectOption label={ouLevel.displayName} value={ouLevel.level.toString()} key={key} />
                                  ): ''}
                            </SingleSelect>
                        </TableCell>
                    </TableRow>                  
                </TableBody>
              </Table>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button  secondary onClick={onModalClose}> Cancel </Button>
                    <Button  primary onClick={()=>onSaveDenominator(newDenominatorInfo)}>   Create </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
  </div>
  )
}
