import React from 'react'
import { useState } from 'react'

export const ChildComponent = (props) => {

    return (
        <div>
            <div>
                <span onClick={props.exampleFunction}></span>
            </div>
        </div>
    )
}