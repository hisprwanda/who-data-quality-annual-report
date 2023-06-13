import { useState } from "react";
import "./config-tabs.css";

import {Denominators} from "./tab-contents/Denominators";
import {DenominatorRelations} from "./tab-contents/DenominatorRelations";
import {NumeratorGroups} from "./tab-contents/NumeratorGroups";
import {NumeratorRelations} from "./tab-contents/NumeratorRelations";
import { NumeratorParameters } from "./tab-contents/NumeratorParameters";
import {Numerators} from "./tab-contents/Numerators";
import {ExternalDataComparison} from "./tab-contents/ExternalDataComparison";
import { CircularLoader } from "@dhis2/ui";


function Tabs({loading, configurations}) {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="container">

      <div className="bloc-tabs">
        <button 
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
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
        {loading? 
            <div className='circularLoader'>
              <CircularLoader large/>
            </div>
            : 
        <>
          {/* TODO: find a way to pass the state globally or use the context api to share these data */}
          <Numerators toggleState={toggleState} configurations={configurations}/>   
          <NumeratorGroups toggleState={toggleState} configurations={configurations}/>
          <NumeratorRelations toggleState={toggleState} configurations={configurations}/>
          <NumeratorParameters toggleState={toggleState}  configurations={configurations}/>
          <Denominators toggleState={toggleState}  configurations={configurations}/>
          <DenominatorRelations toggleState={toggleState}  configurations={configurations}/>
          <ExternalDataComparison toggleState={toggleState}  configurations={configurations}/>
        </>
      } 
        
      </div>
    </div>
  );
}

export default Tabs;