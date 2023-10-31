import { useState, useEffect } from "react";
import {
    Button,
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
    ButtonStrip, 
    Input
  } from '@dhis2/ui'
import { getDenominatorRelations } from "../../../utils/denominatorsMetadataData";
import relationTypes from '../../../data/relationTypes.json';
import denominatorTypes from "../../../data/denominatorTypes.json";



export const DenominatorRelations = ({toggleState, configurations}) => {
  const [relations, setRelations] = useState(null);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [newDenominatorRelationInfo, setNewDenominatorRelationInfo] = useState({
    A: "",
    B: "",
    code: "",
    criteria: 12,
    name: "",
    type: ""
  });

  let denominatorsWithDataIds  = configurations.denominators.filter(denominator => denominator.dataID != null);


  useEffect(() => {
    setRelations(configurations.denominatorRelations)
  }, [])
      

  return (
    <div className={toggleState === 6 ? "content  active-content" : "content"} >
    <p>Please map alternative denominators for comparison, for example denominiators from the National Bureau of Statistics with denominators used by health programmes.</p>
    <hr />
    <div className="denominatorRelationsContainer">
        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>Name	</TableCellHead>
                    <TableCellHead>	Denominator A	</TableCellHead>
                    <TableCellHead>	Denominator B	</TableCellHead>
                    <TableCellHead>Criteria</TableCellHead>
                    <TableCellHead>Actions</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
            {relations? relations.map((relation, key) => (
              <TableRow key={key}>
                  <TableCell>{relation.name}</TableCell>
                  <TableCell>{getDenominatorRelations(configurations.denominators, relation.A)}</TableCell>
                  <TableCell>{getDenominatorRelations(configurations.denominators, relation.B)}</TableCell>
                  <TableCell>{relation.criteria}%</TableCell>
                  <TableCell>
                    <Button
                        name="Primary button" onClick={() => setIsModalHidden(false)} 
                        basic button value="default" icon={<IconEdit16 />}> Edit
                    </Button>
                    <Button
                        name="Primary button" onClick={() => window.alert('It works!')} 
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
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell> 
                    <Button
                        name="Primary button" onClick={() => window.alert('It works!')} 
                        primary button value="default" icon={<IconAdd16 />}> Add Relations
                    </Button>
                  </TableCell>
              </TableRow>
            </TableBody>
        </Table>

        {/* TODO: Implement modal reuse */}
        <Modal onClose={()=>setIsModalHidden(true)} hide={isModalHidden}  position="middle" >
            <ModalTitle>
                Denominator relations mapping
            </ModalTitle>
            <ModalContent>
                <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <p>Name</p> 
                        </TableCell>
                        <TableCell>
                            <Input label="Name" name="name"value={newDenominatorRelationInfo.name} onChange={(e) => setNewDenominatorRelationInfo({...newDenominatorRelationInfo, name:e.value})} requiredrequired className='input'
                                />
                        </TableCell>                      
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <p>Type</p> 
                        </TableCell>
                        <TableCell>
                            <SingleSelect className="select" 
                                onChange={(e) => setNewDenominatorRelationInfo({...newDenominatorRelationInfo, type:e.selected})}
                                placeholder="Select relation type"
                                selected={newDenominatorRelationInfo.type}
                            >
                                {relationTypes? relationTypes.map((type, key) =>
                                    <SingleSelectOption label={type.displayName} value={type.code} key={key} />

                                ) : '' }
                            </SingleSelect>
                        </TableCell>                      
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <p>Denominator A</p> 
                        </TableCell>
                        <TableCell>
                            <SingleSelect className="select" 
                                onChange={(e)=> setNewDenominatorRelationInfo({...newDenominatorRelationInfo, A:e.selected})}
                                placeholder="Select denominator A"
                                selected={newDenominatorRelationInfo.A}
                            > 
                            {denominatorsWithDataIds? denominatorsWithDataIds.map((denominator, key) =>
                                <SingleSelectOption label={denominator.name} value={denominator.code} key={key} />
                                ) : '' }
                            </SingleSelect>
                        </TableCell>                      
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <p>Denominator B</p> 
                        </TableCell>
                        <TableCell>
                            <SingleSelect className="select" 
                                onChange={(e)=> setNewDenominatorRelationInfo({...newDenominatorRelationInfo, B:e.selected})}
                                placeholder="Select denominator B"
                                selected={newDenominatorRelationInfo.B}
                            > 
                            {denominatorsWithDataIds? denominatorsWithDataIds.map((denominator, key) =>
                                <SingleSelectOption label={denominator.name} value={denominator.code} key={key} />
                                ) : '' }
                            </SingleSelect>
                        </TableCell>                      
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <p>Threshold (+/-) %</p> 
                        </TableCell>
                        <TableCell>
                            <Input label="Name" name="name" required className='input' type='number' value={newDenominatorRelationInfo.criteria}
                                onChange={(e)=> setNewDenominatorRelationInfo({...newDenominatorRelationInfo, criteria:e.value})}
                            />
                        </TableCell>                      
                    </TableRow>            
                </TableBody>
                </Table>
                <p>Threshold denotes the % difference from national figure that is accepted for a sub-national unit.</p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button  secondary onClick={() => setIsModalHidden(true)}> Cancel </Button>
                    <Button  primary onClick={()=>console.log('creating denominator relations')}>   Create </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>

      </div>
  </div>  )
}
