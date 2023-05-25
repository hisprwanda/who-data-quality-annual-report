import { useState } from "react";
import "./config-tabs.css";
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


function Tabs() {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="container">
      <div className="bloc-tabs">
        <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)} > Numerators
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)} > Numerator Groups
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)} > Numerator Relations
        </button>
        <button
          className={toggleState === 4 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(4)} > Numerator Quality Parameters
        </button>
        <button
          className={toggleState === 5 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(5)} > Denominators
        </button>
        <button
          className={toggleState === 6 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(6)} > Denominator Relations
        </button>
        <button
          className={toggleState === 7 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(7)} > External Data Comparison
        </button>
      </div>

      <div className="content-tabs">
        
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
                            name="Primary button" onClick={() => window.alert('It works!')} 
                            basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                        </Button>
                      </TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>HIV/Aids</TableCell>
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
                      </TableCell>
                  </TableRow>
                </TableBody>
            </Table>
          </div>
        </div>

        <div className={toggleState === 2 ? "content  active-content" : "content"} >
          <p>Add and remove numerators to/from groups, and to add new groups.</p>
          <hr />
          <div class="groupsContainer">
          <div class="group">
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
              
              <div class="group">
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

        <div className={toggleState === 3 ? "content  active-content" : "content"} >
          <p>Numerator Relations</p>
          <hr />
          <p>Configure relavant numerator Relations</p>

            </div>
        </div>

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

          <div class="qualityParametersContainer">
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


          <div class="qualityParametersContainer">
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
                </TableBody>
            </Table>

          </div>

        </div>

        <div className={toggleState === 5 ? "content  active-content" : "content"} >
          <p>Please map alternative denominators for comparison, for example denominiators from the National Bureau of Statistics with denominators used by health programmes.</p>
          <hr />
          
          <div class="denominatorsContainer">
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Data element/indicator</TableCellHead>
                        <TableCellHead>Type</TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                  <TableRow>
                      <TableCell>AIDS clinical_OPDDH</TableCell>
                      <TableCell>	Expected pregnancies</TableCell>
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
                      <TableCell>Obs Gyn surgery Post surgical Infection</TableCell>
                      <TableCell>	 Total	Children {'<'} 1 year</TableCell>
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
                      <TableCell>Hosp_Malaria Simple in postpartum_Within 42 days after delivery	</TableCell>
                      <TableCell>	People living with HIV</TableCell>
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

        <div className={toggleState === 6 ? "content  active-content" : "content"} >
          <p>Please map alternative denominators for comparison, for example denominiators from the National Bureau of Statistics with denominators used by health programmes.</p>
          <hr />
          <div class="denominatorRelationsContainer">
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
        </div>

        <div className={toggleState === 7 ? "content  active-content" : "content"} >
          <p>Please identify external (survey) data that can be used for comparison with routine data, e.g. ANC coverage, immunisation coverage etc. The "external data" should refer to calculated survey result (e.g. a percentage), whilst the numerator and denominator refer to the raw data</p>
          <hr />
          
            <div class="ExternalDataContainer">
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

        
      </div>
    </div>
  );
}

export default Tabs;