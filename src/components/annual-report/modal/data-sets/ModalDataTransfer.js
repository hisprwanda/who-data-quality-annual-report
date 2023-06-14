
import React from 'react'
import { IconArrowLeftMulti24, IconArrowRightMulti24, IconArrowRight24, IconArrowLeft24 } from '@dhis2/ui-icons'
import { Button } from '@dhis2/ui'


export const ModalDataTransfer = () => {
    return (
        <div>
            <ul>
                <li>
                <Button name = "Small button" onClick = { () => {} } small value = "default">
                    <IconArrowRightMulti24/> 
                </Button>
                </li>
                <li>
                    <Button name = "Small button" onClick = { () => {} } small value = "default">
                        <IconArrowRight24/>
                    </Button>
                </li>
                <li>
                    <Button name = "Small button" onClick = { () => {} } small value = "default">
                        <IconArrowLeft24/>
                    </Button>
                </li>
                <li>
                    <Button name = "Small button" onClick = { () => {} } small value = "default">
                        <IconArrowLeftMulti24/>
                    </Button>
                </li>
            </ul>
        </div>
    )
}