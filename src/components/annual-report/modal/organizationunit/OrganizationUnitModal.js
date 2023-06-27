import React, { useState } from 'react'
import { Modal, ModalActions, ModalTitle, ModalContent, ButtonStrip, Button, Checkbox } from '@dhis2/ui'
import './style/organisationunit.css'
import { CheckboxField, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import { OrgUnitComponent } from '../../OrgUnit.Component'

export const OrganizationUnitModal = (props) => {

    let [selectedLevel, setSelectedLevel] = useState("0")
    let [selectedGroup, setSelectedGroup] = useState("0")

    return (
        <Modal hide={props.status} onClose={ () => {props.changeOrganisationUnitStatus(true)}} position="top" fluid>
            <ModalTitle>
                Organisation Unit
            </ModalTitle>
            <ModalContent>

                <div className='organisation-unit-modal-parent'>
                    <div>
                        <ul>
                            <li>
                                <Checkbox label = "User organisation unit" name = "Ex" onBlur = {() => {}} onChange = {() => {}} onFocus = {() => {}} valid value = "valid"/> 
                            </li>
                            <li>
                                <Checkbox label = "User Sub Unit" name = "Ex" onBlur = {() => {}} onChange = {() => {}} onFocus = {() => {}} valid value = "valid"/>
                            </li>
                            <li>
                                <Checkbox label = "User sub-2x-unit" name = "Ex" onBlur = {() => {}} onChange = {() => {}} onFocus = {() => {}} valid value = "valid"/> 
                            </li>
                        </ul>
                    </div>
                    <div>
                        <OrgUnitComponent />
                    </div>
                    <div>
                        <div>
                            <SingleSelect className="select" onChange={(e)=> setSelectedLevel(e.selected) } selected={selectedLevel}>
                                <SingleSelectOption label="Select Level" value="0" />
                                <SingleSelectOption label="National" value="National" />
                                <SingleSelectOption label="Province" value="Province" />
                                <SingleSelectOption label="District" value="District" />
                                <SingleSelectOption label="Sector" value="Sector" />
                            </SingleSelect>
                        </div>
                        <div>
                            <SingleSelect className="select" onChange={(e)=> setSelectedGroup(e.selected) } selected={selectedGroup}>
                                <SingleSelectOption label="Select Group" value="0" />
                                <SingleSelectOption label="Administrative" value="Administrative" />
                                <SingleSelectOption label="Military Hospital" value="Military Hospital" />
                                <SingleSelectOption label="Nursing School" value="Nursing School" />
                                <SingleSelectOption label="PBF Center" value="PBF Center" />
                            </SingleSelect>
                        </div>
                    </div>
                </div>

            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => {props.changeOrganisationUnitStatus(true)}} >Hide</Button>
                </ButtonStrip>
                <div className='divider'></div>
                <ButtonStrip end>
                    <Button onClick={() => {}} primary>Update</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}