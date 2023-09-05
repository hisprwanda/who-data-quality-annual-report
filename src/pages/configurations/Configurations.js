import {useState, useEffect} from 'react'
import MenuBar from '../../components/menu-bar/MenuBar'
import ConfigTabs from '../../components/config-tabs/ConfigTabs'
import './configurations.css'
import { useDataQuery, useAlert } from "@dhis2/app-runtime";


//TODO: use a global state or context api to share these settings accross components
const readDataStoreQuery = {
  dataStore: {
    resource: 'dataStore/who-dqa/configurations',
  },
};


const mappedDataElementsQuery = {
  elements: {
    resource: 'dataElements',
    params:({mappedElements}) =>({
      filter:`id:in:${mappedElements}`,
      paging: false,
    })
  }
};
 
const Configurations = () => {
const [configurations, setConfigurations] = useState(null);
const [mappedNumerators, setMappedNumerators] = useState(null);
const [elementsUids, setElementsUids] = useState(null);

  // A dynamic alert to communicate success or failure 
  // TODO: put this one in a reusable function
  const { show } = useAlert( 
    ({ message }) => message,
    ({ status }) => {
        if (status === 'success') return { success: true }
        else if (status === 'error') return { critical: true }
        else return {}
    } )

  // running the query
  const { loading, error, data } = useDataQuery(readDataStoreQuery);

  // run the mapped data element querry
  const { loading: mappedElementsLoading, error:mappedElementsError, data:mappedElementsData, refetch:mappedElementsRefetch } = useDataQuery(mappedDataElementsQuery, {
   lazy: true,
  });
  
  if (error) { return <span>ERROR: {error.message}</span> }


useEffect(() => {
  if (data) {  
    const configs = data.dataStore;
      setConfigurations(configs);

      const message = 'Successfully retrieved configurations'
      // show({ message, status: 'success' })  //TODO: find the error in the console caused by AlertsProvider
  }
}, [data]);

// useEffect(() => {
//   if (numeratorsWithDataIds) {
//     setElementsUids(numeratorsWithDataIds.map(item => item.dataID).join(','));
//   }
//   if (elementsUids) {
//     mappedElementsRefetch({
//       mappedElements: `[${elementsUids}]`
//     })
//   }
// }, [elementsUids]);



// useEffect(() => {
//   if (mappedElementsData && numeratorsWithDataIds) {
//     console.log('elements:', numeratorsWithDataIds)
//     const returnedElements = mappedElementsData.elements.dataElements;
    
//     for (let i = 0; i < returnedElements.length; i++) {
//       const dataID = returnedElements[i].id;
//       const matchingObj = numeratorsWithDataIds.find(item => item.dataID === dataID);

//       if (matchingObj) {
//         returnedElements[i].code = matchingObj.code;
//         setMappedNumerators(returnedElements)
//       }
//     }
//   }
// }, [mappedElementsData]);


  return (
    <div className='configurationsContainer'>
        <MenuBar />
      
        <div className='subContainer'>
          <div className='descriptionText'>
            <p>
              This module is used for configuring the WHO Data Quality Annual Report, and mapping the proposed data quality indicators to data 
              elements and indicators in the DHIS 2 database. This configuration is used as the basis for the Annual Report, and the numerator and 
              numerator group configuration is also used for the Dashboard.
            </p>
          </div>

          <div className='config-tabs-container' >
              {configurations? 
                <ConfigTabs loading={loading} configurations={configurations} />
              :
              ""
              }
          </div>

        </div>
      </div>
  )
}

export default Configurations