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
import { getDenominatorType } from '../../../utils/denominatorsMetadataData';

export const Denominators = ({toggleState, configurations}) => {
  const [denominators, setDenominators] = useState(null);
  const [toggleStateModal, setToggleStateModal] = useState(1);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const toggleTabModal = (index) => {
    setToggleStateModal(index);
  };

  const onModalClose = () => {
    setIsModalHidden(true)
  }
/*
TODO: get denominator types from data and fill them
TODO: get org unit levels & populate them into lowest level available
TODO: fill data elements and groups as done in numerators
TODO: check what changes happen when a denominator is created 
TODO: check what changes happen when a denominator is editted 
TODO: make these changes happen
*/ 

  useEffect(() => {
    setDenominators(configurations.denominators)
  }, [])
      

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
                    <TableCell>	{getDenominatorType(denominator.type).displayName}</TableCell>
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
                            <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Data Element Groups">
                                <SingleSelectOption label="Group one" value="1" />
                                <SingleSelectOption label="Group two" value="2" />
                                <SingleSelectOption label="Group three" value="3" />
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
                                          <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Data element eroup">
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
                            <SingleSelect className="select" onChange={()=> console.log('selected')} placeholder="Data Element Groups">
                                <SingleSelectOption label="Group one" value="1" />
                                <SingleSelectOption label="Group two" value="2" />
                                <SingleSelectOption label="Group three" value="3" />
                            </SingleSelect>
                        </TableCell>
                    </TableRow>                  
                </TableBody>
              </Table>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button  secondary onClick={onModalClose}> Cancel </Button>
                    <Button  primary onClick={onModalClose}>   Create </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
  </div>
  )
}
