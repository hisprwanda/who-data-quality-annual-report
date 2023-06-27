import {useEffect, useState} from 'react'
import {
    Button,
    DropdownButton,
    Input,
    FlyoutMenu,
    MenuItem,
    SingleSelect,
    SingleSelectField,
    SingleSelectOption,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconAdd16
  } from '@dhis2/ui'
import { getNumeratorMemberGroups, getNumeratorDataElement, makeOutlierOptions } from '../../../utils/numeratorsMetadataData'


export const NumeratorParameters = ({toggleState, configurations}) => {
  const [numerators, setNumerators] = useState(null);
  const [outlierOptions, setOutlierOptions] = useState(null);
  const [datasets, setDatasets] = useState(null);


  useEffect(() => {
    setNumerators(configurations.numerators)
    setOutlierOptions(makeOutlierOptions());
    setDatasets(configurations.dataSets)
  }, [])
      

  return (
    
    <div className={toggleState === 4 ? "content  active-content" : "content"} >
    <p>Numerator parameters </p>
    <p> Modify parameters for each numerator. Only data elements/indicators mapped to the database are displayed.</p>
    <hr />
    <ul>
      <li>Moderate outliers: Number of standard deviations (SD) from the mean for a values to quality as a moderate outlier.</li>
      <li>Extreme outliers: Number of standard deviations (SD) from the mean for a values to quality as an extreme outlier.</li>
      <li>Consistency: Threshold for consistency over time (percentage change over time). </li>
      <li>Expected trend: Whether the numerator value is expected to be constant over time or increase/decrease. </li>
      <li>Missing/zero values: Whether to compare consistency over time across organisation units, or to the expected change (e.g. constant or increasing/decreasing). </li>
      <li>Missing/zero values: Threshold for missing/zero values for variable completeness. Note: when zero values are not stored for a data element, zeros and missing are not differentiated. </li>
    </ul>

    <div className="qualityParametersContainer">
      <Table>
          <TableHead>
              <TableRowHead>
                  <TableCellHead>Group	</TableCellHead>
                  <TableCellHead>Reference indicator/data element</TableCellHead>
                  <TableCellHead>Local data element/indicator	</TableCellHead>
                  <TableCellHead>Moderate outlier (SD)	</TableCellHead>
                  <TableCellHead>Extreme outlier (SD)	</TableCellHead>
                  <TableCellHead>Consistency (%)</TableCellHead>
                  <TableCellHead>Expected trend	</TableCellHead>
                  <TableCellHead>Compare orgunit consistency with	</TableCellHead>
                  <TableCellHead>Missing/zero values (%)</TableCellHead>
              </TableRowHead>
          </TableHead>
          <TableBody>
            {numerators? numerators.map((numerator, key) =>(
              <TableRow key={key}>
                  <TableCell>{getNumeratorMemberGroups(configurations, numerator.code)}	</TableCell>
                  <TableCell>{numerator.name}</TableCell>
                  <TableCell>{getNumeratorDataElement(configurations, numerator.dataID)}	</TableCell>
                  <TableCell>
                    <SingleSelectField inputWidth='20px' selected='2' onChange={()=> console.log('changed option')}  >
                        {outlierOptions? outlierOptions.map((opt, key) => (
                          <SingleSelectOption key={key} label={opt.label} value={opt.val} />
                        ))
                        :
                        <SingleSelectOption label="option one" value="1" />
                      }
                    </SingleSelectField>
                  </TableCell>
                  <TableCell>
                    <SingleSelectField inputWidth='2px' selected='2' onChange={()=> console.log('changed option')}  >
                          {outlierOptions? outlierOptions.map((opt, key) => (
                            <SingleSelectOption key={key} label={opt.label} value={opt.val} />
                          ))
                          :
                          <SingleSelectOption label="option one" value="1" />
                        }
                      </SingleSelectField>                  
                  </TableCell>
                  <TableCell>
                    <Input max="100" min="0" name="defaultName" onChange={()=> console.log('changed option')} step="1" type="number" />                                          
                  </TableCell>
                  <TableCell>
                    <SingleSelectField onChange={()=> console.log('changed option')}  >
                      <SingleSelectOption  label='Constant' value='Constant' />
                      <SingleSelectOption  label='Increasing' value='Increasing' />
                      <SingleSelectOption  label='Decreasing' value='Decreasing' />
                    </SingleSelectField>          

                  </TableCell>
                  <TableCell>
                    <SingleSelectField onChange={()=> console.log('changed option')}  >
                      <SingleSelectOption  label='Overall result' value='Overall result' />
                      <SingleSelectOption  label='Expected result' value='Expected result' />
                    </SingleSelectField>          
                  </TableCell>
                  <TableCell>
                      <Input max="100" min="0" name="defaultName" onChange={()=> console.log('changed option')} step="1" type="number" />                                          
                  </TableCell>
              </TableRow>
            ))
              :
              <TableRow>
                <TableCell></TableCell>
              </TableRow>
            }
          </TableBody>
      </Table>

    </div>

    <p>Dataset completeness</p>
    <p> Set the thresholds for various completeness in the table below. Only dataset linked to indicators are displayed.</p>
    <hr />
    <ul>
      <li>Completeness: Threshold for completeness of reporting.</li>
      <li>Extreme outliers: Number of standard deviations (SD) from the mean for a values to quality as an extreme outlier.</li>
      <li>Consistency: Threshold for consistency over time (percentage change over time). </li>
      <li>Expected trend: Whether the numerator value is expected to be constant over time or increase/decrease. </li>
      <li>Missing/zero values: Whether to compare consistency over time across organisation units, or to the expected change (e.g. constant or increasing/decreasing). </li>
      <li>Missing/zero values: Threshold for missing/zero values for variable completeness. Note: when zero values are not stored for a data element, zeros and missing are not differentiated. </li>
    </ul>


    <div className="qualityParametersContainer">
      <Table>
          <TableHead>
              <TableRowHead>
                  <TableCellHead>Group	</TableCellHead>
                  <TableCellHead>Completeness (%)	</TableCellHead>
                  <TableCellHead>Timeliness(%)</TableCellHead>
                  <TableCellHead>Consistency (%)	</TableCellHead>
                  <TableCellHead>Expected trend</TableCellHead>
                  <TableCellHead>Compare orgunit consistency with</TableCellHead>
              </TableRowHead>
          </TableHead>
          <TableBody>
            {datasets? datasets.map((dataset, key) => (
              <TableRow key={key}>
                  <TableCell>{dataset.name}</TableCell>
                  <TableCell>
                      <Input max="100" min="0" name="defaultName" onChange={()=> console.log('changed option')} step="1" type="number" />                                          
                  </TableCell>
                  <TableCell>
                      <Input max="100" min="0" name="defaultName" onChange={()=> console.log('changed option')} step="1" type="number" />                                          
                  </TableCell>
                  <TableCell>
                      <Input max="100" min="0" name="defaultName" onChange={()=> console.log('changed option')} step="1" type="number" />                                          
                  </TableCell>
                  <TableCell>
                    <SingleSelectField onChange={()=> console.log('changed option')}  >
                        <SingleSelectOption  label='Constant' value='Constant' />
                        <SingleSelectOption  label='Increasing' value='Increasing' />
                        <SingleSelectOption  label='Decreasing' value='Decreasing' />
                    </SingleSelectField>                     
                  </TableCell>
                  <TableCell>
                    <SingleSelectField onChange={()=> console.log('changed option')}  >
                      <SingleSelectOption  label='Overall result' value='Overall result' />
                      <SingleSelectOption  label='Expected result' value='Expected result' />
                    </SingleSelectField>          
                  </TableCell>
              </TableRow>
            ))
            :
            <TableRow><TableCell></TableCell></TableRow>
          }

            {/* Save button */}

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
                        primary button value="default" icon={<IconAdd16 />}> Save Changes
                    </Button>
                  </TableCell>
              </TableRow>
          </TableBody>
      </Table>

    </div>

  </div>
  )
}

