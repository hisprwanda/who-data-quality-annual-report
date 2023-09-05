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
    const [numerators, setNumerators] = useState([]);
    const [numeratorToEdit, setNumeratorToEdit] = useState(null);

    const [mutate, { error, data }] = useDataMutation( updateConfigurationsMutation )
    const [updateType, setUpdateType] = useState(null);

    const onClose = () => {
        setIsHidden(true);
    }

    const onCloseEdit = () => {
        setIsHiddenEdit(true);
    }

    const onCloseCreate = () => {
        setIsHiddenUpdateModal(true);
    }
    
    const onDelete = () => {
        setIsHidden(true);
        setDataElements(null)
    }

    const onSave = async(numerator) => {
        console.log("numerator data: ", numerator);
        setIsHiddenEdit(true);
        const updatedConfigurations = updateConfigurations(configurations, 'numerators', 'update', numerator);
        await mutate({ configurations: updatedConfigurations })
    }

    const onSaveNumeratorUpdates = async(newNumeratorInfo) => {
        // TODO: check if u're editing or updating
        // TODO: remember to add datasets as a list of strings
        // TODO: implement chosing
        // TODO: pull indicators as well

        console.log('new numerator info', newNumeratorInfo)
        const updatedConfigurations =  createNewNumerator(configurations, newNumeratorInfo);       
        await mutate({ configurations: updatedConfigurations })

        setNumerators(numerators => [...numerators, newNumeratorInfo]);
        setIsHiddenUpdateModal(true)
    }

    const onSavePeriod = (selected) => { 
        togglePeriodModal;
        const dataFromUtils = getNumeratorMemberGroups()
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

    useEffect(() => {
        setNumerators(configurations.numerators)    
      }, [])

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
                            name="Primary button" onClick={() => clearNumeratorElements(numerator)} 
                            basic button icon={<IconSubtractCircle16 />} disabled={isDisabled(numerator.dataID, numerator.dataSetID)}> Clear
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