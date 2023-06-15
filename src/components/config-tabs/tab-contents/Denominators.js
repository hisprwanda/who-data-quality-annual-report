import {useState, useEffect} from 'react'
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
    IconAdd16	
  } from '@dhis2/ui'
import { getDenominatorType } from '../../../utils/denominatorsMetadataData';

export const Denominators = ({toggleState, configurations}) => {
  const [denominators, setDenominators] = useState(null);

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
                        name="Primary button" onClick={() => window.alert('It works!')} 
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
                <TableCell> 
                  <Button
                      name="Primary button" onClick={() => window.alert('It works!')} 
                      primary button value="default" icon={<IconAdd16 />}> Add Denominator
                  </Button>
                </TableCell>
            </TableRow>
          </TableBody>
      </Table>

    </div>
  </div>
  )
}
