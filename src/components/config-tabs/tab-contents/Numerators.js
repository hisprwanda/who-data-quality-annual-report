import {useState} from 'react'

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


export const Numerators = ({toggleState, configurations}) => {
    const [isHidden, setIsHidden] = useState(true);
    const [isHiddenEdit, setIsHiddenEdit] = useState(true);
    const [isHiddenPeriod, setIsHiddenPeriod] = useState(true);
    const [isHiddenDataModal, setIsHiddenDataModal] = useState(true);

    const togglePeriodModal = () => setIsHiddenPeriod(state => !state)
    const toggleDataModal = () => setIsHiddenDataModal(state => !state)
    const [dataElements, setDataElements] = useState(null);

    let numerators = configurations? configurations.numerators : []

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

    const onSave = (data) => {
        setDataElements(data)
        setIsHiddenEdit(true);
        console.log('Saved the following data to the data store: ', dataElements);
    }


    const onSavePeriod = (selected) => { 
        togglePeriodModal;
        // console.log('Saved period: ', selected);
        const dataFromUtils = getNumeratorMemberGroups()
        console.log('From utils: ', dataFromUtils);
    }


    const onSaveData = (selected) => { 
        toggleDataModal;
        console.log('Saved data: ', selected);
    }

    //TODO: create utils functions to get different values for each numerator ie: groups, datasets etc

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
                        <TableCell>{getNumeratorMemberGroups(configurations, numerator.code)}</TableCell>
                        <TableCell>{numerator.name}</TableCell>
                        <TableCell>{numerator.core ? "✔️": ""}</TableCell>
                        <TableCell>{getNumeratorDataElement(configurations, numerator.dataID)}</TableCell>
                        <TableCell>{getNumeratorDataset(configurations, numerator.dataSetID)}</TableCell>
                        <TableCell>
                        <Button
                            name="Primary button" onClick={() => setIsHiddenEdit(false)} 
                            basic button value="default" icon={<IconEdit16 />}> Edit
                        </Button>
                        
                        <Button
                            name="Primary button" onClick={() => setIsHidden(false)} 
                            basic button value="default" icon={<IconSubtractCircle16 />}> Clear
                        </Button>
                        </TableCell>
                    </TableRow>

                ))
                :

                ""
                }
                
                {/* <TableRow>
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
                </TableRow>
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
                </TableRow> */}
            </TableBody>
        </Table>
        </div>

        <WarningModal onClose={onClose} isHidden={isHidden} onDelete={onDelete}/>
        <EditModal onClose={onCloseEdit} isHidden={isHiddenEdit} onSave={onSave}/>
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