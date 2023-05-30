import {useState} from 'react'
import React from 'react'
import MenuBar from '../../components/menu-bar/MenuBar'
import './style/report.css'
import { resources } from '../../assets/str-resources/report-section'
import { SingleSelect, SingleSelectOption } from '@dhis2-ui/select'
import { TransferOption } from '@dhis2-ui/transfer'
import { Transfer, CustomTransfer } from '@dhis2-ui/transfer'
import { Button } from '@dhis2-ui/button'
import { Modal, ModalContent } from '@dhis2-ui/modal'


const loadModal = () => {
  console.log('Loading the modal');
  <Modal onClose={() => {}}>
    <ModalContent>
      It is loading now ...
    </ModalContent>
  </Modal>
}

const Report = () => {

  const [visibility, toggleVisibility] = useState({
    'data_section': 'set-visible',
    'period_section': 'set-invisible',
    'orgunit_section': 'set-invisible'
  })

  const setToggleState = (event) => {
    
    let data_section = 'set-invisible';
    let period_section = 'set-invisible';
    let orgunit_section = 'set-invisible';

    const id = event.currentTarget.id;

    if(id === 'period_') {
      data_section = 'set-invisible';
      period_section = 'set-visible';
      orgunit_section = 'set-invisible';
    }

    if(id === 'orgunit_') {
      data_section = 'set-invisible';
      period_section = 'set-invisible';
      orgunit_section = 'set-visible';
    }

    if(id === 'data_') {
      data_section = 'set-visible';
      period_section = 'set-invisible';
      orgunit_section = 'set-invisible';
    }

    toggleVisibility({
      'data_section': data_section,
      'period_section': period_section,
      'orgunit_section': orgunit_section
    })
      
  }

  return (
    <div className='reportContainer'>
      <MenuBar />
        <div className='topParagraph'>
          <p>{resources.report_title}</p>
        </div>

        <div className='configsContainer'>
            <div className='configRows'>
              <div className='title' onClick={setToggleState} id='data_'>
                {resources.data}
              </div>
              <div className={visibility['data_section']} id='data-section'>
                <label>Data Elements Groups</label>
                <SingleSelect className="select" onChange={() => {console.log('Doing change element')}} selected='General Service'>
                  <SingleSelectOption label="General Service" value="General Service" />
                  <SingleSelectOption label="Maternity" value="Maternity" />
                  <SingleSelectOption label="Malaria" value="Malaria" />
                  <SingleSelectOption label="OPD" value="OPD" />
                </SingleSelect>
              </div>
            </div>

            <div className='configRows'>
              <div className='title' onClick={setToggleState} id='period_'>
                {resources.period}
              </div>
              <div className={visibility['period_section']} id='period-section'>
                <label>Period</label>
                <Transfer
                  filterable
                  initialSearchTerm="2023"
                  onChange={() => {}}
                  options={[
                      {
                          label: '2023',
                          value: 'anc_1st_visit'
                      },
                      {
                          label: 'ANC 2nd visit',
                          value: 'anc_2nd_visit'
                      },
                      {
                          label: 'ANC 3rd visit',
                          value: 'anc_3rd_visit'
                      },
                      {
                          label: 'ANC 4th or more visits',
                          value: 'anc_4th_or_more_visits'
                      },
                      {
                          label: 'ARI treated with antibiotics (pneumonia) follow-up',
                          value: 'ari_treated_with_antibiotics_(pneumonia)_follow-up'
                      },
                      {
                          label: 'ARI treated with antibiotics (pneumonia) new',
                          value: 'ari_treated_with_antibiotics_(pneumonia)_new'
                      },
                      {
                          label: 'ARI treated with antibiotics (pneumonia) referrals',
                          value: 'ari_treated_with_antibiotics_(pneumonia)_referrals'
                      },
                      {
                          label: 'ARI treated without antibiotics (cough) follow-up',
                          value: 'ari_treated_without_antibiotics_(cough)_follow-up'
                      },
                      {
                          label: 'ARI treated without antibiotics (cough) new',
                          value: 'ari_treated_without_antibiotics_(cough)_new'
                      },
                      {
                          label: 'ARI treated without antibiotics (cough) referrals',
                          value: 'ari_treated_without_antibiotics_(cough)_referrals'
                      },
                      {
                          label: 'ART No clients who stopped TRT due to TRT failure',
                          value: 'art_no_clients_who_stopped_trt_due_to_trt_failure'
                      },
                      {
                          label: 'ART No clients who stopped TRT due to adverse clinical status/event',
                          value: 'art_no_clients_who_stopped_trt_due_to_adverse_clinical_status/event'
                      },
                      {
                          label: 'ART No clients with change of regimen due to drug toxicity',
                          value: 'art_no_clients_with_change_of_regimen_due_to_drug_toxicity'
                      },
                      {
                          label: 'ART No clients with new adverse drug reaction',
                          value: 'art_no_clients_with_new_adverse_drug_reaction'
                      },
                      {
                          label: 'ART No started Opportunist Infection prophylaxis',
                          value: 'art_no_started_opportunist_infection_prophylaxis'
                      },
                      {
                          label: 'ART clients with new adverse clinical event',
                          value: 'art_clients_with_new_adverse_clinical_event'
                      },
                      {
                          label: 'ART defaulters',
                          value: 'art_defaulters'
                      },
                      {
                          label: 'ART enrollment stage 1',
                          value: 'art_enrollment_stage_1'
                      },
                      {
                          label: 'ART enrollment stage 2',
                          value: 'art_enrollment_stage_2'
                      },
                      {
                          label: 'ART enrollment stage 3',
                          value: 'art_enrollment_stage_3'
                      },
                      {
                          label: 'ART enrollment stage 4',
                          value: 'art_enrollment_stage_4'
                      },
                      {
                          label: 'ART entry point: No PMTCT',
                          value: 'art_entry_point:_no_pmtct'
                      }
                  ]}
              />
              </div>
            </div>

            <div className='configRows'>
              <div className='title' onClick={setToggleState} id='orgunit_'>
                {resources.orgunit}
              </div>
              <div className={visibility['orgunit_section']} id='orgunit_section'>
                <label>Organization Unit</label>
                <Button name="Basic button" onClick={loadModal} value="default">Label me!</Button>
              </div>
            </div>
        </div>
      
    </div>
  )
}

export default Report