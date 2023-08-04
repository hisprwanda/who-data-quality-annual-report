import {useEffect, useState} from 'react'
import { useDataMutation, useDataQuery, useAlert } from '@dhis2/app-runtime'

import {
    Button,
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconSubtractCircle16,
    IconAdd16,
    SingleSelect,
    SingleSelectOption	
  } from '@dhis2/ui'
import { getNumeratorsInGroup } from '../../../utils/numeratorsMetadataData';
import { updateConfigurations } from '../../../utils/updateConfigurations';


// TODO: move different queries to their own file when they become many
const updateConfigurationsMutation = {
  resource: 'dataStore/who-dqa/configurations',
  type: 'update',
  data: ({ configurations }) => ({
      ...configurations,
      lastUpdated: new Date().toJSON(),
  }),
}


export const NumeratorGroups = ({toggleState, configurations}) => {
const [groups, setGroups] = useState(null)
const [numerators, setNumerators] = useState(null);
const [selectedNumerator, setSelectedNumerator] = useState(null)

const [mutate, { error, data }] = useDataMutation( updateConfigurationsMutation )

  const handleNumeratorSelection = (selected) => {
    setSelectedNumerator(selected)
  }

  // A dynamic alert to communicate success or failure 
  // TODO: put this one in a reusable function
  const { show } = useAlert( 
    ({ message }) => message,
    ({ status }) => {
        if (status === 'success') return { success: true }
        else if (status === 'error') return { critical: true }
        else return {}
    } )

  const handleAddNumerator = async(numerator, group) => {
    //TODO: implement delete/remove

    if (group.members.includes(numerator)) {
      const message = 'This numerator is already a member of this group';
      show({ message, status: 'error' })  
      setSelectedNumerator(null);
    } else{
      const groupUpdateInfo = {
        groupCode: group.code,
        numeratorCode: numerator
      }

      const updatedConfigurations = updateConfigurations(configurations, 'groups', 'update', null, groupUpdateInfo);
      await mutate({ configurations: updatedConfigurations })
      const message = 'Numerator added successfully to the group';
      show({ message, status: 'success' });
      setSelectedNumerator(null);


    }
  } 

  useEffect(() => {
    setGroups(configurations.groups)
    setNumerators(configurations.numerators)
  }, [])
  

  return (
    <div className={toggleState === 2 ? "content  active-content" : "content"} >
          <p>Add and remove numerators to/from groups, and to add new groups.</p>
          <hr />
          <div className="groupsContainer">
            {groups? groups.map((group,key) => ( 
                <div key={key} className="group">
                <h2>{group.name}</h2>
                  <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Data</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                          {getNumeratorsInGroup(numerators, group)}
                      
    
                      <TableRow>
                        <TableCell>

                        <SingleSelect className="select" 
                                onChange={(selected)=> handleNumeratorSelection(selected.selected)} 
                                placeholder="Select Numerator"
                                selected={selectedNumerator}
                            >
                                {numerators.map((numerator, key) => 
                                    <SingleSelectOption label={numerator.name} value={numerator.code} key={key} />
                                )}
                            </SingleSelect>
 
                        </TableCell>
                        <TableCell>
                        <Button
                            name="Primary button" disabled={selectedNumerator? false: true} onClick={() => handleAddNumerator(selectedNumerator, group)} 
                            primary button value="default" icon={<IconAdd16 />}> Add Numerators
                        </Button>
                        </TableCell>
                      </TableRow>
                      </TableBody>
                  </Table>
              </div>
            ))
            :
            ""
            }
              
              <div className="group">
                <h2>HIV/Aids</h2>
                <Table>
                  <TableHead>
                      <TableRowHead>
                          <TableCellHead>Data</TableCellHead>
                          <TableCellHead>Action</TableCellHead>
                      </TableRowHead>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                        <TableCell>OPD visits</TableCell>
                        <TableCell>
                          <Button
                              name="Primary button" onClick={() => window.alert('It works!')} 
                              basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                          </Button>
                        </TableCell>
                    </TableRow>
                    
                    <TableRow>
                        <TableCell>PLHIV in HIV care</TableCell>
                        <TableCell>
                          <Button
                              name="Primary button" onClick={() => window.alert('It works!')} 
                              basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                          </Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>PLHIV on ART	</TableCell>
                        <TableCell>
                          <Button
                              name="Primary button" onClick={() => window.alert('It works!')} 
                              basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                          </Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Pregnant women on ART (PMTCT)</TableCell>
                        <TableCell>
                          <Button
                              name="Primary button" onClick={() => window.alert('It works!')} 
                              basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                          </Button>
                        </TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell>
                        <DropdownButton
                          component={<FlyoutMenu><MenuItem label="Item 1" /><MenuItem label="Item 2" /><MenuItem label="Item 3" /></FlyoutMenu>}
                          name="buttonName" value="buttonValue" > Select item to add to General Service Statistics group...
                      </DropdownButton>
                      </TableCell>
                      <TableCell>
                      <Button
                          name="Primary button" onClick={() => window.alert('It works!')} 
                          primary button value="default" icon={<IconAdd16 />}> Add
                      </Button>
                      </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
              </div>
              
            </div>
        </div>
  )
}

