import React from 'react'

export const OrganizationUnitGroupComponent = ({group, selectedGroupInfo}) => {
    return (
        <div className='organization-unit-group-parent'>
            {
                group.map((grp) => (
                    <li key={grp.id} onClick={selectedGroupInfo}>{grp.displayName}</li>
                ))
            }
        </div>
    )
}