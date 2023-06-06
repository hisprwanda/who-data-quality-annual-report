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


export const DenominatorRelations = ({toggleState}) => {
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
              <TableRow>
                  <TableCell>Total population - census to UN projection</TableCell>
                  <TableCell>Hosp_Malaria Simple in postpartum_Within 42 days after delivery</TableCell>
                  <TableCell>Obs Gyn surgery Post surgical Infection Total</TableCell>
                  <TableCell>10%</TableCell>
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
                  <TableCell>Total population - census to UN projection</TableCell>
                  <TableCell>Hosp_Malaria Simple in postpartum_Within 42 days after delivery</TableCell>
                  <TableCell>Obs Gyn surgery Post surgical Infection Total</TableCell>
                  <TableCell>10%</TableCell>
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
                  <TableCell>Total population - census to UN projection</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
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
                  <TableCell> 
                    <Button
                        name="Primary button" onClick={() => window.alert('It works!')} 
                        primary button value="default" icon={<IconAdd16 />}> Add Relations
                    </Button>
                  </TableCell>
              </TableRow>
            </TableBody>
        </Table>

      </div>
  </div>  )
}
