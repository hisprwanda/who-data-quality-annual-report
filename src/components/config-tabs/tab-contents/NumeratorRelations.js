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
    IconEdit16	
  } from '@dhis2/ui'


export const NumeratorRelations = ({toggleState}) => {
  return (
    <div className={toggleState === 3 ? "content  active-content" : "content"} >
    <p>Numerator Relations</p>
    <hr />

      <div className="relationsContainer">
      <Table>
          <TableHead>
              <TableRowHead>
                  <TableCellHead>Name</TableCellHead>
                  <TableCellHead>Numerator A</TableCellHead>
                  <TableCellHead>Numerator B</TableCellHead>
                  <TableCellHead>Type</TableCellHead>
                  <TableCellHead>Threshold (%)</TableCellHead>
                  <TableCellHead>Threshold explanation</TableCellHead>
                  <TableCellHead>Description</TableCellHead>
                  <TableCellHead>Actions</TableCellHead>
              </TableRowHead>
          </TableHead>
          <TableBody>
            <TableRow>
                <TableCell>ANC 1 - TT1 ratio</TableCell>
                <TableCell>ANC First standard visit 1st trimester</TableCell>
                <TableCell>ANC TT 1given</TableCell>
                <TableCell>A ≈ B</TableCell>
                <TableCell>5</TableCell>
                <TableCell>% difference between A and B.</TableCell>
                <TableCell>A and B should be roughly equal</TableCell>
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
                <TableCell>ANC 1 - TT1 ratio</TableCell>
                <TableCell>ANC First standard visit 1st trimester</TableCell>
                <TableCell>ANC TT 1given</TableCell>
                <TableCell>A ≈ B</TableCell>
                <TableCell>5</TableCell>
                <TableCell>% difference between A and B.</TableCell>
                <TableCell>A and B should be roughly equal</TableCell>
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
                <TableCell>ANC 1 - TT1 ratio</TableCell>
                <TableCell>ANC First standard visit 1st trimester</TableCell>
                <TableCell>ANC TT 1given</TableCell>
                <TableCell>A ≈ B</TableCell>
                <TableCell>5</TableCell>
                <TableCell>% difference between A and B.</TableCell>
                <TableCell>A and B should be roughly equal</TableCell>
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
                <TableCell>ANC 1 - TT1 ratio</TableCell>
                <TableCell>ANC First standard visit 1st trimester</TableCell>
                <TableCell>ANC TT 1given</TableCell>
                <TableCell>A ≈ B</TableCell>
                <TableCell>5</TableCell>
                <TableCell>% difference between A and B.</TableCell>
                <TableCell>A and B should be roughly equal</TableCell>
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
                <TableCell>ANC 1 - TT1 ratio</TableCell>
                <TableCell>ANC First standard visit 1st trimester</TableCell>
                <TableCell>ANC TT 1given</TableCell>
                <TableCell>A ≈ B</TableCell>
                <TableCell>5</TableCell>
                <TableCell>% difference between A and B.</TableCell>
                <TableCell>A and B should be roughly equal</TableCell>
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
            
          </TableBody>
      </Table>

      </div>
  </div>
  )
}
