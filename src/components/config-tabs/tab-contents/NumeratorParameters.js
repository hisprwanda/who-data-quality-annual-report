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
    IconAdd16
  } from '@dhis2/ui'


export const NumeratorParameters = ({toggleState}) => {
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
            <TableRow>
                <TableCell>General Service Statistics	</TableCell>
                <TableCell>OPD visits	</TableCell>
                <TableCell>New cases_OPD	</TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 2 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 3 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 33 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Constant </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Expected" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Overall result </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 90 </DropdownButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>General Service Statistics	</TableCell>
                <TableCell>OPD visits	</TableCell>
                <TableCell>New cases_OPD	</TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 2 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 3 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 33 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Constant </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Expected" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Overall result </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 90 </DropdownButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>General Service Statistics	</TableCell>
                <TableCell>OPD visits	</TableCell>
                <TableCell>New cases_OPD	</TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 2 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 3 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 33 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Constant </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Expected" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Overall result </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 90 </DropdownButton>
                </TableCell>
            </TableRow>
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
            <TableRow>
                <TableCell>07 Antenatal Consultations</TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 90 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 75 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 33 </DropdownButton>
                </TableCell>
                <TableCell>
                <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Constant </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Overall result </DropdownButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>ANC Antenatal Consultations</TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 90 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 75 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 33 </DropdownButton>
                </TableCell>
                <TableCell>
                <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Constant </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Overall result </DropdownButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>OutPatient Consultations (OPD)</TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 90 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 75 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label=" 1" /><MenuItem label=" 2" /><MenuItem label=" 3" /></FlyoutMenu>} name="buttonName" value="buttonValue" > 33 </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Constant </DropdownButton>
                </TableCell>
                <TableCell>
                  <DropdownButton component={<FlyoutMenu><MenuItem label="Increasing" /><MenuItem label="Decreasing" /></FlyoutMenu>} name="buttonName" value="buttonValue" > Overall result </DropdownButton>
                </TableCell>
            </TableRow>

            

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

