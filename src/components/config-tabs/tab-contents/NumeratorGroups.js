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
  } from '@dhis2/ui'

export const NumeratorGroups = ({toggleState}) => {
  return (
    <div className={toggleState === 2 ? "content  active-content" : "content"} >
          <p>Add and remove numerators to/from groups, and to add new groups.</p>
          <hr />
          <div className="groupsContainer">
          <div className="group">
              <h2>General Service Statistics</h2>
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
                      <TableCell>
                        <DropdownButton
                          component={<FlyoutMenu><MenuItem label="Item 1" /><MenuItem label="Item 2" /><MenuItem label="Item 3" /></FlyoutMenu>}
                          name="buttonName" value="buttonValue" > Select item to add to General Service Statistics group...
                      </DropdownButton>
                      </TableCell>
                      <TableCell>
                      <Button
                          name="Primary button" onClick={() => window.alert('It works!')} 
                          primary button value="default" icon={<IconAdd16 />}> Clear
                      </Button>
                      </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
              </div>
              
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
                          primary button value="default" icon={<IconAdd16 />}> Clear
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

