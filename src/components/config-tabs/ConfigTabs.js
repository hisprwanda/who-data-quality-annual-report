import { useState } from "react";
import "./config-tabs.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  IconEdit16,
  IconDelete16,
  IconAdd16,	
} from '@dhis2/ui'
import {Denominators} from "./Denominators";
import NumeratorGroups from "./NumeratorGroups";
import NumeratorRelations from "./NumeratorRelations";
import { NumeratorParameters } from "./NumeratorParameters";
import Numerators from "./Numerators";


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
        
        <Numerators toggleState={toggleState}/>
        <NumeratorGroups toggleState={toggleState}/>
        <NumeratorRelations toggleState={toggleState}/>
        <NumeratorParameters toggleState={toggleState} />
        <Denominators toggleState={toggleState} />


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
        </div>

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

        
      </div>
    </div>
  );
}

export default Tabs;