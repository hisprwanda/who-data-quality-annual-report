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

function PeriodTypeSelect({ periodType, setPeriodType, setPeriods }) {
    return (
        <SingleSelectField
            label={i18n.t('Period type')}
            placeholder={i18n.t('Choose a period type')}
            selected={periodType}
            onChange={({ selected }) => {
                setPeriodType(selected)
                // Reset period selection too
                setPeriods([])
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
    setPeriodType: PropTypes.func,
    setPeriods: PropTypes.func,
}

/** Combines period and yearsForReference because their state is shared */
const PeriodsSelect = ({
    periodType,
    periods,
    setPeriods,
    yearsForReference,
    setYearsForReference,
}) => {
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

    const handleChange = React.useCallback(
        ({ periodId, newYearsForReference }) => {
            if (!periodId) {
                return
            }

            const selectedPeriodIdx = generatedPeriods.findIndex(
                ({ id }) => id === periodId
            )
            const endIdx = selectedPeriodIdx + newYearsForReference + 1
            // todo: add an alert to show warning in UI. Could also validate years > 0
            if (endIdx > generatedPeriods.length) {
                console.warn(
                    'The current period selection uses periods older than 10 years ago. Only periods up to 10 years ago will be used.'
                )
            }

            const selectedPeriods = generatedPeriods.slice(
                selectedPeriodIdx,
                endIdx
            )
            setPeriods(selectedPeriods)
        },
        [generatedPeriods, setPeriods]
    )

    return (
        <>
            <SingleSelectField
                label={i18n.t('Period')}
                placeholder={
                    periodType
                        ? i18n.t('Choose a period')
                        : i18n.t('Choose a period type first')
                }
                disabled={!periodType}
                selected={periods[0]?.id}
                onChange={({ selected: periodId }) => {
                    handleChange({
                        periodId,
                        newYearsForReference: yearsForReference,
                    })
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
            <InputField
                label={i18n.t('Preceding years for reference')}
                type="number"
                min={'1'}
                value={String(yearsForReference)}
                onChange={({ value }) => {
                    const newYearsForReference = Number(value)
                    handleChange({
                        periodId: periods[0]?.id,
                        newYearsForReference,
                    })
                    setYearsForReference(newYearsForReference)
                }}
            />
        </>
    )
}
PeriodsSelect.propTypes = {
    /** Expected to be an ISO ID of the period type */
    periodType: PropTypes.string,
    periods: PropTypes.array,
    setPeriods: PropTypes.func,
    setYearsForReference: PropTypes.func,
    yearsForReference: PropTypes.number,
}

export const PeriodSelector = ({
    selectedPeriods: periods,
    setSelectedPeriods: setPeriods,
}) => {
    const [open, setOpen] = useState(false)
    const [periodType, setPeriodType] = useState()
    const [yearsForReference, setYearsForReference] = useState(3)

    return (
        <SelectorBarItem
            label={i18n.t('Period')}
            value={periods[0]?.name}
            noValueMessage={i18n.t('Choose a period')}
            open={open}
            setOpen={setOpen}
        >
            <div className={styles.menuContainer}>
                <div className={styles.inputsContainer}>
                    <PeriodTypeSelect
                        periodType={periodType}
                        setPeriodType={setPeriodType}
                        setPeriods={setPeriods}
                    />
                    <PeriodsSelect
                        periodType={periodType}
                        periods={periods}
                        setPeriods={setPeriods}
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
    selectedPeriods: PropTypes.array,
    setSelectedPeriods: PropTypes.func,
}
