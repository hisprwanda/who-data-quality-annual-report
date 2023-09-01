import React from 'react'

export const OrganizationUnitLevelComponent = ({level, selectedLevelInfo}) => {
    return (
        <div className='organization-unit-group-parent'>
            {
                level.map((lvl) => (
                    <li key={lvl.id} onClick={selectedLevelInfo}>{lvl.displayName}</li>
                ))
            }
        </div>
    )
}