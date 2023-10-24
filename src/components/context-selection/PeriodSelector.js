import i18n from '@dhis2/d2-i18n'
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import {
    Button,
    InputField,
    SelectorBarItem,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './PeriodSelector.module.css'

const ANNUAL_REPORT_PERIOD_TYPES = [
    { label: i18n.t('Yearly'), id: 'YEARLY' },
    { label: i18n.t('Financial Year (April)'), id: 'FYAPR' },
    { label: i18n.t('Financial Year (July)'), id: 'FYJUL' },
    { label: i18n.t('Financial Year (October)'), id: 'FYOCT' },
    // todo: wait, what? should this be Nov? see /api/periodTypes
    { label: i18n.t('Financial Year (December)'), id: 'FYDEC' },
]

function PeriodTypeSelect({ periodType, setPeriodType, setPeriod }) {
    return (
        <SingleSelectField
            label={i18n.t('Period type')}
            placeholder={i18n.t('Choose a period type')}
            selected={periodType}
            onChange={({ selected }) => {
                setPeriodType(selected)
                // Reset period selection too
                setPeriod(null)
            }}
        >
            {ANNUAL_REPORT_PERIOD_TYPES.map(({ label, id }) => (
                <SingleSelectOption key={id} label={label} value={id} />
            ))}
        </SingleSelectField>
    )
}
PeriodTypeSelect.propTypes = {
    /** Expected to be an ISO ID of the period type */
    periodType: PropTypes.string,
    setPeriod: PropTypes.func,
    setPeriodType: PropTypes.func,
}

function PeriodSelect({ periodType, period, setPeriod }) {
    const generatedPeriods = React.useMemo(() => {
        return periodType
            ? generateFixedPeriods({
                  // todo: should this be systemInfo.calendar?
                  calendar: 'gregory',
                  periodType: periodType,
                  year: new Date().getFullYear() - 1,
                  // todo: internationalize; me.settings.keyUiLocale (or DB locale?)
                  locale: 'en',
              })
            : []
    }, [periodType])

    return (
        <SingleSelectField
            label={i18n.t('Period')}
            placeholder={i18n.t('Choose a period')}
            empty={i18n.t('Choose a period type first')}
            selected={period?.id}
            onChange={({ selected }) => {
                const selectedPeriod = generatedPeriods.find(
                    ({ id }) => id === selected
                )
                setPeriod(selectedPeriod)
            }}
        >
            {generatedPeriods.map((period) => (
                <SingleSelectOption
                    key={period.id}
                    label={period.name}
                    value={period.id}
                />
            ))}
        </SingleSelectField>
    )
}
PeriodSelect.propTypes = {
    period: PropTypes.object,
    /** Expected to be an ISO ID of the period type */
    periodType: PropTypes.string,
    setPeriod: PropTypes.func,
}

function YearsForReferenceInput({ yearsForReference, setYearsForReference }) {
    // todo: validate that the value is > 0
    return (
        <InputField
            label={i18n.t('Preceding years for reference')}
            type="number"
            min={'1'}
            value={String(yearsForReference)}
            onChange={({ value }) => setYearsForReference(Number(value))}
        />
    )
}
YearsForReferenceInput.propTypes = {
    setYearsForReference: PropTypes.func,
    yearsForReference: PropTypes.number,
}

export const PeriodSelector = ({
    selectedPeriod: period,
    setSelectedPeriod: setPeriod,
    yearsForReference,
    setYearsForReference,
}) => {
    const [open, setOpen] = useState(false)
    const [periodType, setPeriodType] = useState()

    return (
        <SelectorBarItem
            label={i18n.t('Period')}
            value={period?.name}
            noValueMessage={i18n.t('Choose a period')}
            open={open}
            setOpen={setOpen}
        >
            <div className={styles.menuContainer}>
                <div className={styles.inputsContainer}>
                    <PeriodTypeSelect
                        periodType={periodType}
                        setPeriodType={setPeriodType}
                        setPeriod={setPeriod}
                    />
                    <PeriodSelect
                        periodType={periodType}
                        period={period}
                        setPeriod={setPeriod}
                    />
                    <YearsForReferenceInput
                        yearsForReference={yearsForReference}
                        setYearsForReference={setYearsForReference}
                    />
                </div>
                <Button
                    secondary
                    onClick={(_, e) => {
                        // Need stopPropagation to successfully close the menu
                        e.stopPropagation()
                        setOpen(false)
                    }}
                >
                    {i18n.t('Hide menu')}
                </Button>
            </div>
        </SelectorBarItem>
    )
}
PeriodSelector.propTypes = {
    selectedPeriod: PropTypes.object,
    setSelectedPeriod: PropTypes.func,
    setYearsForReference: PropTypes.func,
    yearsForReference: PropTypes.number,
}
