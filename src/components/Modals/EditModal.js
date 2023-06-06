import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle  
  } from '@dhis2/ui'

const EditModal = ({onClose, isHidden, onSave}) => {

    const editData = {
        name: 'John Doe',
        phone: '+19392038348',
        gender: 'Male'
    }
  return (
    <div>
        <Modal onClose={onClose} hide={isHidden} position="middle" large>
        <ModalTitle>
            Numerators Mapping to Data Elements
        </ModalTitle>
        <ModalContent>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
            <p>Numerators Mapping to Data Elements</p>
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button  secondary onClick={onClose}>
                    Cancel
                </Button>
                <Button  primary onClick={() => onSave (editData)}> 
                    Save
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
    </div>
  )
}

export default EditModal