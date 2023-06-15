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
    IconEdit16	
  } from '@dhis2/ui'
import { getNumeratorRelations, getRelationType } from '../../../utils/numeratorsMetadataData';


export const NumeratorRelations = ({toggleState, configurations}) => {
    const [relations, setRelations] = useState(null);


    useEffect(() => {
        setRelations(configurations.numeratorRelations)
      }, [])
      

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

            {relations? relations.map((relation, key) => (
                <TableRow key={key}>
                    <TableCell>{relation.name}</TableCell>
                    <TableCell>{getNumeratorRelations(configurations.numerators, relation.A)}</TableCell>
                    <TableCell>{getNumeratorRelations(configurations.numerators, relation.B)}</TableCell>
                    <TableCell>{getRelationType(relation.type).displayName}</TableCell>
                    <TableCell>{relation.criteria}</TableCell>
                    <TableCell>{getRelationType(relation.type).thresholdDescription}</TableCell>
                    <TableCell>{getRelationType(relation.type).description}</TableCell>
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
            <TableRow>
                <TableCell>
                    No numerator relations found.
                </TableCell>
            </TableRow>
            }
          </TableBody>
      </Table>

      </div>
  </div>
  )
}
