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

export const ExternalDataComparison = ({toggleState}) => {
  return (
    
    <div className={toggleState === 7 ? "content  active-content" : "content"} >
    <p>Please identify external (survey) data that can be used for comparison with routine data, e.g. ANC coverage, immunisation coverage etc. The "external data" should refer to calculated survey result (e.g. a percentage), whilst the numerator and denominator refer to the raw data</p>
    <hr />
    
      <div className="ExternalDataContainer">
        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>Name</TableCellHead>
                    <TableCellHead>Survey/external indicator</TableCellHead>
                    <TableCellHead>Routine data numerator</TableCellHead>
                    <TableCellHead>Routine data denominator</TableCellHead>
                    <TableCellHead>Criteria</TableCellHead>
                    <TableCellHead>Level</TableCellHead>
                    <TableCellHead>Actions</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
              <TableRow>
                  <TableCell>ANC 1 coverage - routine to surveyt</TableCell>
                  <TableCell>AIDS clinical_OPDDH	</TableCell>
                  <TableCell>ANC First standard visit 1st trimester</TableCell>
                  <TableCell>AIDS clinical_OPDDH</TableCell>
                  <TableCell>33 %	</TableCell>
                  <TableCell>District</TableCell>
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
              <TableRow>
                  <TableCell>ANC 1 coverage - routine to surveyt</TableCell>
                  <TableCell>AIDS clinical_OPDDH	</TableCell>
                  <TableCell>ANC First standard visit 1st trimester</TableCell>
                  <TableCell>AIDS clinical_OPDDH</TableCell>
                  <TableCell>33 %	</TableCell>
                  <TableCell>District</TableCell>
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
              

               {/* Add button */}

               <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell> 
                    <Button
                        name="Primary button" onClick={() => window.alert('It works!')} 
                        primary button value="default" icon={<IconAdd16 />}> Add Comparison
                    </Button>
                  </TableCell>
              </TableRow>
            </TableBody>
        </Table>

      </div>
  </div>

    )
}
