import {useState} from 'react'

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
    IconEdit16,
    IconSubtractCircle16,
    IconDelete16,
    IconAdd16,	
  
  } from '@dhis2/ui'
  import WarningModal from "../Modals/WarningModal";


const Denominators = ({toggleState}) => {
    const [isHidden, setIsHidden] = useState(true);

    const onClose = () => {
        setIsHidden(true);
      }
    
      const onDelete = () => {
        setIsHidden(true);
        console.log('Denominator Deleted');
      }


  return (
    <div>
        <div className={toggleState === 1 ? "content  active-content" : "content"} >
          <p>Please map the reference numerators to the corresponding data element/indicator in this database.</p>
          <hr />

          <div className='configTable'>

            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Data</TableCellHead>
                        <TableCellHead>Reference numerator</TableCellHead>
                        <TableCellHead>Core</TableCellHead>
                        <TableCellHead>Data element/indicator</TableCellHead>
                        <TableCellHead>Dataset</TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                  <TableRow>
                      <TableCell>General Service Statistics</TableCell>
                      <TableCell>OPD visits</TableCell>
                      <TableCell>✔️</TableCell>
                      <TableCell>New cases_OPD</TableCell>
                      <TableCell>OutPatient Consultations (OPD)</TableCell>
                      <TableCell>
                        <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        <Button
                            name="Primary button" onClick={() => setIsHidden(false)} 
                            basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                        </Button>
                      </TableCell>
                  </TableRow>

                   <TableRow>
                      {/*<TableCell>HIV/Aids</TableCell>
                      <TableCell>Retained on ART 12 months after initiation</TableCell>
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
                  <TableRow>
                      <TableCell>Immunization</TableCell>
                      <TableCell>DPT 1</TableCell>
                      <TableCell>✔️</TableCell>
                      <TableCell>DTP_HepB_Hib1</TableCell>
                      <TableCell> Vaccination </TableCell>
                      <TableCell>
                      <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                        </Button>
                      </TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>Malaria</TableCell>
                      <TableCell>Confirmed malaria cases</TableCell>
                      <TableCell> ... </TableCell>
                      <TableCell></TableCell>
                      <TableCell> ... </TableCell>
                      <TableCell>
                      <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                        </Button>
                      </TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>Maternal Health</TableCell>
                      <TableCell> ... </TableCell>
                      <TableCell>✔️</TableCell>
                      <TableCell> ANC First standard visit 1st trimester </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                      <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                        </Button>
                      </TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>TB</TableCell>
                      <TableCell> MDR-TB cases successfully treated </TableCell>
                      <TableCell> ✔️ </TableCell>
                      <TableCell>Ac Chlorhydrique disp</TableCell>
                      <TableCell> TB Drug Management (CDT only) </TableCell>
                      <TableCell>
                      <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        <Button
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                        </Button>
                      </TableCell>*/}
                  </TableRow> 
                </TableBody>
            </Table>
          </div>

         <WarningModal onClose={onClose} isHidden={isHidden} onDelete={onDelete}/>
        </div>
    </div>
  )
}

export default Denominators