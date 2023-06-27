import {useState, useEffect} from 'react'
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'

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
    IconSubtractCircle16	
  
  } from '@dhis2/ui'
import WarningModal from "../../Modals/WarningModal";
import EditModal from '../../Modals/EditModal';
import PeriodsModal from '../../Modals/PeriodsModal';
import { DataSelectorModal } from '../../Modals/DataSelectorModal';
import { getNumeratorDataElement, getNumeratorDataset, getNumeratorMemberGroups } from '../../../utils/numeratorsMetadataData';
import { clearConfigurations, updateConfigurations } from '../../../utils/updateConfigurations';
import { Chip } from "@dhis2/ui-core";

// TODO: move different queries to their own file when they become many
const updateNumeratorsMutation = {
    resource: 'dataStore/who-dqa/configurations',
    type: 'update',
    data: ({ configurations }) => ({
        ...configurations,
        lastUpdated: new Date().toJSON(),
    }),
}


export const Numerators = ({toggleState, configurations}) => {
    const [isHidden, setIsHidden] = useState(true);
    const [isHiddenEdit, setIsHiddenEdit] = useState(true);
    const [isHiddenPeriod, setIsHiddenPeriod] = useState(true);
    const [isHiddenDataModal, setIsHiddenDataModal] = useState(true);

    const togglePeriodModal = () => setIsHiddenPeriod(state => !state)
    const toggleDataModal = () => setIsHiddenDataModal(state => !state)
    const [dataElements, setDataElements] = useState(null);

    let numerators = configurations? configurations.numerators : []
    const [numeratorToEdit, setNumeratorToEdit] = useState(null);

    const [mutate, { error, data }] = useDataMutation( updateNumeratorsMutation )

    const onClose = () => {
        setIsHidden(true);
    }

    const onCloseEdit = () => {
        setIsHiddenEdit(true);
    }
    
    const onDelete = () => {
        setIsHidden(true);
        setDataElements(null)
    }

    const onSave = async(numerator) => {
        // setDataElements(data)
        console.log("numerator data: ", numerator);
        setIsHiddenEdit(true);
        const updatedConfigurations = updateConfigurations(configurations, 'numerators', 'update', numerator);
        await mutate({ configurations: updatedConfigurations })

        console.log('Saved the following data to the data store: ', data);
    }

    const onSavePeriod = (selected) => { 
        togglePeriodModal;
        // console.log('Saved period: ', selected);
        const dataFromUtils = getNumeratorMemberGroups()
        // console.log('From utils: ', dataFromUtils);
    }

    const onSaveData = (selected) => { 
        toggleDataModal;
        // console.log('Saved data: ', selected);
    }

    // FIXME: this is running every time a tab is switched find why and fix
    const isDisabled = (dataID, dataSetID) => {
        const element = configurations.denominators.find((element) => element.dataID == dataID);
        const dataset = configurations.dataSets.find((dataset) => dataset.id == dataSetID);
        
        if (element || dataset) {
            // console.log('elemnt and dataset ', element + ' ' +dataset);
            return false
        }else{
            return true
        }
    }

    const clearNumeratorElements = async(numerator) =>{
        // setIsHidden(false);    //TODO: uncomment after implementing warning modal
        const updatedConfigurations = clearConfigurations(configurations, 'numerators', 'delete', numerator);
        await mutate({ configurations: updatedConfigurations })
    }

    const updateNumeratorElements = async(numerator) =>{
        const updatedConfigurations = updateConfigurations(configurations, 'numerators', 'update', code);
        await mutate({ configurations: updatedConfigurations })
    }


    const onEditting = (numerator) => {
        console.log('editing initialted');
        setIsHiddenEdit(false);
        setNumeratorToEdit(numerator);
    }


  return (
    <div className={toggleState === 1 ? "content  active-content" : "content"} >
        <p>Please map the reference numerators to the corresponding data element/indicator in this database.</p>
        <hr />

        <div className='configTable'>

        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>Data</TableCellHead>
                    <TableCellHead>Reference numerator</TableCellHead>
                    <TableCellHead>Core</TableCellHead>
                    <TableCellHead>Data element/indicator</TableCellHead>
                    <TableCellHead>Dataset</TableCellHead>
                    <TableCellHead>Actions</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
                {numerators? numerators.map((numerator, key ) => (
                    <TableRow key={key}>
                        <TableCell>{getNumeratorMemberGroups(configurations, numerator.code).map((group, key) =>(
                            <Chip key={key} dense> {group} </Chip>
                        ))}</TableCell>
                        <TableCell>{numerator.name}</TableCell>
                        <TableCell>{numerator.core ? "✔️": ""}</TableCell>
                        <TableCell>{getNumeratorDataElement(configurations, numerator.dataID)}</TableCell>
                        <TableCell>{getNumeratorDataset(configurations, numerator.dataSetID)}</TableCell>
                        <TableCell>
                        <Button
                            name="Primary button" onClick={() => onEditting(numerator)} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        
                        <Button
                            name="Primary button" onClick={() => clearNumeratorElements(numerator)} 
                            basic button icon={<IconSubtractCircle16 />} disabled={isDisabled(numerator.dataID, numerator.dataSetID)}> Clear
                        </Button>
                        </TableCell>
                    </TableRow>
                ))
                :
                ""
                }
{/*                 
                <TableRow>
                    <TableCell>General Service Statistics</TableCell>
                    <TableCell>OPD visits</TableCell>
                    <TableCell>✔️</TableCell>
                    <TableCell>New cases_OPD</TableCell>
                    <TableCell>{dataElements? dataElements.name : "OutPatient Consultations (OPD)"}</TableCell>
                    <TableCell>
                    <Button
                        name="Primary button" onClick={togglePeriodModal} 
                        basic button value="default" icon={<IconEdit16 />}> Edit period
                    </Button>

                    <Button
                        name="Primary button" onClick={() => setIsHidden(false)} 
                        basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                    </Button>
                    </TableCell>
                </TableRow>*/}
                <TableRow>
                    <TableCell>General Service Statistics</TableCell>
                    <TableCell>OPD visits</TableCell>
                    <TableCell>✔️</TableCell>
                    <TableCell>New cases_OPD</TableCell>
                    <TableCell>{dataElements? dataElements.name : "OutPatient Consultations (OPD)"}</TableCell>
                    <TableCell>
                    <Button
                        name="Primary button" onClick={toggleDataModal} 
                        basic button value="default" icon={<IconEdit16 />}> Edit period
                    </Button>

                    <Button
                        name="Primary button" onClick={() => setIsHidden(false)} 
                        basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                    </Button>
                    </TableCell>
                </TableRow> 
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                        <Button name="Primary button" onClick={() => onEditting([])} button value="default" icon={<IconEdit16 />} primary> Add new numerator </Button>    
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </div>

        {/* <WarningModal onClose={onClose} isHidden={isHidden} onDelete={onDelete}/> */}
        {numeratorToEdit? 
            <EditModal configurations={configurations} onClose={onCloseEdit} isHidden={isHiddenEdit} onSave={onSave} numeratorToEdit={numeratorToEdit}/>
        :
        ''
        }
        <PeriodsModal 
            isHiddenPeriod={isHiddenPeriod}
            currentlySelected={[]}
            toggleModal={togglePeriodModal}
            onSave={onSavePeriod}
        />

        
        <DataSelectorModal
            isHiddenDataModal={isHiddenDataModal}
            currentlySelected={[]}
            toggleModal={toggleDataModal}
            onSave={onSaveData}
        />

        
    </div>
  )
}