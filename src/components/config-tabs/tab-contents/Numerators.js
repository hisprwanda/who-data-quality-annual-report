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
    IconDelete16  
  } from '@dhis2/ui'

import WarningModal from "../../Modals/WarningModal";
import PeriodsModal from '../../Modals/PeriodsModal';
import { DataSelectorModal } from '../../Modals/DataSelectorModal';
import { getNumeratorDataElement, getNumeratorDataset, getNumeratorMemberGroups } from '../../../utils/numeratorsMetadataData';
import { clearConfigurations, createNewNumerator, updateConfigurations } from '../../../utils/updateConfigurations';
import { Chip } from "@dhis2/ui-core";
import UpdateNumeratorsModal from '../../Modals/UpdateNumeratorsModal';



// TODO: move different queries to their own file when they become many
const updateConfigurationsMutation = {
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
    const [isHiddenUpdateModal, setIsHiddenUpdateModal] = useState(true);

    const togglePeriodModal = () => setIsHiddenPeriod(state => !state)
    const toggleDataModal = () => setIsHiddenDataModal(state => !state)
    const [dataElements, setDataElements] = useState(null);
    const [numerators, setNumerators] = useState(configurations.numerators);
    const [numeratorToEdit, setNumeratorToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const [mutate, { error, data }] = useDataMutation( updateConfigurationsMutation )
    const [updateType, setUpdateType] = useState(null);


    const onCloseCreate = () => {
        setIsHiddenUpdateModal(true);
    }
    
    const onSaveNumeratorUpdates = async(newNumeratorInfo, updateType) => {
        //show a loader while updating
        setIsLoading(true)

        if (updateType === 'create') {
            const updatedConfigurations =  createNewNumerator(configurations, newNumeratorInfo);       
            await mutate({ configurations: updatedConfigurations })
            setNumerators(numerators => [...numerators, newNumeratorInfo]);
            setIsHiddenUpdateModal(true)
            
        } else if( updateType === 'update') {
            const updatedConfigurations = updateConfigurations(configurations, 'numerators', 'update', newNumeratorInfo);
            let response = await mutate({ configurations: updatedConfigurations })
            if (response) {
                //stop the loader after updating
                setIsLoading(false)
            }
            setIsHiddenUpdateModal(true)
        }
    }

    const onSavePeriod = (selected) => { 
        togglePeriodModal;
        const dataFromUtils = getNumeratorMemberGroups()
    }

    const onDeleteNumerator = async(numeratorToDelete) =>{
        // setIsHidden(false);    //TODO: uncomment after implementing warning modal

        const updatedConfigurations = updateConfigurations(configurations, 'numerators', 'delete', numeratorToDelete);
        setNumerators(numerators.filter(numerator => numerator.code !== numeratorToDelete.code));
        await mutate({ configurations: updatedConfigurations })
    }


    const onEditting = (numerator) => {
        setUpdateType('update')
        setIsHiddenUpdateModal(false)
        setNumeratorToEdit(numerator);
    }

    const onCreating = (numerator) => {
        setUpdateType('create')
        setIsHiddenUpdateModal(false)
        setNumeratorToEdit(numerator);
    }

    // useEffect(() => {
    //     setNumerators(configurations.numerators)    
    //   }, [])

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
                            <Chip key={key} dense> {group.displayName} </Chip>
                        ))}</TableCell>
                        <TableCell>{numerator.name}</TableCell>
                        <TableCell>{numerator.core ? "✔️": ""}</TableCell>
                        <TableCell>{getNumeratorDataElement(numerators, numerator.dataID)}</TableCell>
                        <TableCell>{getNumeratorDataset(configurations, numerator.dataSetID)}</TableCell>
                        <TableCell>
                        <Button
                            name="Primary button" onClick={() => onEditting(numerator)} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        
                        <Button
                            name="Primary button" onClick={() => onDeleteNumerator(numerator)} 
                            destructive basic button icon={<IconDelete16 />} disabled={!numerator.custom}> Delete
                        </Button>
                        </TableCell>
                    </TableRow>
                ))
                :
                ""
                }
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                        <Button name="Primary button" onClick={onCreating} button value="default" icon={<IconEdit16 />} primary> Add new numerator </Button>    
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </div>

        {/* <WarningModal onClose={onClose} isHidden={isHidden} onDelete={onDelete}/> */}
        
        <UpdateNumeratorsModal
            configurations={configurations}
            onClose={onCloseCreate}
            isHidden={isHiddenUpdateModal}
            onSave={onSaveNumeratorUpdates}
            updateType={updateType}
            numeratorToEdit={numeratorToEdit}
            isLoading={isLoading}
        />
        <PeriodsModal 
            isHiddenPeriod={isHiddenPeriod}
            currentlySelected={[]}
            toggleModal={togglePeriodModal}
            onSave={onSavePeriod}
        />

        
    </div>
  )
}