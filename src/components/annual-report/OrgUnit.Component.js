import React, {useState} from 'react'
import { OrganisationUnitTree } from '@dhis2/ui';


export const OrgUnitComponent = () => {
    
    let [selectedOU, setSelectedOU] = useState('/Hjw70Lodtf2/jUMVwrUlNqG/XxBlJkEmJGQ/hDsNksdRjyK/xHe6AHOiQWp/oQuwh1dH5sl')

    return (
        <OrganisationUnitTree name="Hjw70Lodtf2" onChange={(e) => setSelectedOU(e.path)}
          isUserDataViewFallback={true}
          roots={
            ['Hjw70Lodtf2']
          }
          selected={[
            selectedOU
          ]}
        />
    );
}