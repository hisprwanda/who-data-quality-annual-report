import React from 'react'
import { OrganisationUnitTree } from '@dhis2/ui';

export const OrgUnitComponent = () => {
    return (
        <OrganisationUnitTree name="Hjw70Lodtf2" onChange={() => console.log('User')}
          isUserDataViewFallback={true}
          roots={
            ['Hjw70Lodtf2']
          }
        />
    );
}