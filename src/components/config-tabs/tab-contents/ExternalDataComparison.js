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
    IconAdd16	
  } from '@dhis2/ui'
import { getNumeratorDataElement } from "../../../utils/numeratorsMetadataData";
import { getDenominatorRelations } from "../../../utils/denominatorsMetadataData";

export const ExternalDataComparison = ({toggleState, configurations}) => {
  const [relations, setRelations] = useState(null);


  useEffect(() => {
      setRelations(configurations.externalRelations)
    }, [])
    

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
                    {/* TODO: have dhis2 metadata objects you will neen into a context api objt */}
                    <TableCellHead>Level</TableCellHead>
                    <TableCellHead>Actions</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>

            {relations? relations.map((relation, key) => (
                <TableRow key={key}>
                  <TableCell>{relation.name}</TableCell>
                  <TableCell>{getNumeratorDataElement(configurations, relation.externalData)}</TableCell>
                  <TableCell>{getDenominatorRelations(configurations.numerators, relation.numerator)}</TableCell>
                  <TableCell>{getDenominatorRelations(configurations.denominators, relation.denominator)}</TableCell>
                  <TableCell>{relation.criteria}%</TableCell>
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
