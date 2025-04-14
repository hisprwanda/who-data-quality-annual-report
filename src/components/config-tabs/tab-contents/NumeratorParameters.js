import i18n from '@dhis2/d2-i18n'
import { useDataMutation } from '@dhis2/app-runtime'
import {
    Button,
    Input,
    SingleSelect,
    SingleSelectField,
    SingleSelectOption,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconAdd16,
    Chip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    getNumeratorMemberGroups,
    getNumeratorDataElement,
    makeOutlierOptions,
} from '../../../utils/numeratorsMetadataData.js'
import { updateConfigurations } from '../../../utils/updateConfigurations.js'

// TODO: move different queries to their own file when they become many
const updateConfigurationsMutation = {
    resource: 'dataStore/who-dqa/configurations',
    type: 'update',
    data: ({ configurations }) => ({
        ...configurations,
        lastUpdated: new Date().toJSON(),
    }),
}

export const NumeratorParameters = ({
    toggleState,
    configurations,
    mappedNumerators,
}) => {
    const [numerators, setNumerators] = useState(null)
    const [outlierOptions, setOutlierOptions] = useState(null)
    const [datasets, setDatasets] = useState(null)

    const [mutate] = useDataMutation(updateConfigurationsMutation)

    const [updatedConfigurations, setUpdatedConfigurations] = useState(null)

    const handleParametersChange = (
        currentNumeratorCode,
        newValue,
        valueType
    ) => {
        const updatedNumerators = numerators.map((numerator) => {
            if (numerator.code == currentNumeratorCode) {
                switch (valueType) {
                    case 'moderateOutlier':
                        numerator.moderateOutlier = parseFloat(newValue)
                        break
                    case 'extremeOutlier':
                        numerator.extremeOutlier = parseFloat(newValue)
                        break
                    case 'consistency':
                        numerator.consistency = parseFloat(newValue)
                        break
                    case 'comparison':
                        numerator.comparison = newValue
                        break
                    case 'trend':
                        numerator.trend = newValue
                        break
                    case 'missing':
                        numerator.missing = parseFloat(newValue)
                        break
                    default:
                        break
                }
            }
            return numerator
        })

        setNumerators(updatedNumerators)

        setUpdatedConfigurations(
            updateConfigurations({
                configurations,
                configurationType: 'parameters',
                updateType: 'update',
                configsUpdateInfo: numerators,
            })
        )
    }

    const onSaveChanges = async () => {
        if (updatedConfigurations != null) {
            await mutate({ configurations: updatedConfigurations })
        } else {
            alert(i18n.t('Cannot upload null configurations!'))
        }
    }

    useEffect(() => {
        setNumerators(
            configurations.numerators.filter(
                (numerator) => numerator.dataID != null
            )
        )
        setOutlierOptions(makeOutlierOptions())
        setDatasets(configurations.dataSets)
    }, [configurations])

    return (
        <div
            className={
                toggleState === 4 ? 'content  active-content' : 'content'
            }
        >
            <p>
                {i18n.t(
                    'Modify parameters for each numerator. Only data elements/indicators mapped to the database are displayed.'
                )}
            </p>
            <hr />
            <ul>
                <li>
                    {i18n.t(
                        'Moderate outliers: Number of standard deviations (SD) from the mean for a values to quality as a moderate outlier.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Extreme outliers: Number of standard deviations (SD) from the mean for a values to quality as an extreme outlier.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Consistency: Threshold for consistency over time (percentage change over time).',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Expected trend: Whether the numerator value is expected to be constant over time or increase/decrease.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Missing/zero values: Whether to compare consistency over time across organisation units, or to the expected change (e.g. constant or increasing/decreasing).',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Missing/zero values: Threshold for missing/zero values for variable completeness. Note: when zero values are not stored for a data element, zeros and missing are not differentiated.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
            </ul>

            <div className="qualityParametersContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>{i18n.t('Group')} </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Reference indicator/data element')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Local data element/indicator')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Moderate outlier (SD)')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Extreme outlier (SD)')}{' '}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Consistency (%)')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Expected trend')}{' '}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Compare orgunit consistency with')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Missing/zero values (%)')}
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {numerators ? (
                            numerators.map((numerator, key) => (
                                <TableRow key={key}>
                                    <TableCell>
                                        {getNumeratorMemberGroups(
                                            configurations,
                                            numerator.code
                                        ).map((group, key) => (
                                            <Chip key={key} dense>
                                                {group.name}
                                            </Chip>
                                        ))}
                                    </TableCell>
                                    <TableCell>{numerator.name}</TableCell>
                                    <TableCell>
                                        {getNumeratorDataElement(
                                            mappedNumerators,
                                            numerator.dataID
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelect
                                            inputWidth="20px"
                                            selected={numerator.moderateOutlier.toString()}
                                            onChange={(selected) =>
                                                handleParametersChange(
                                                    numerator.code,
                                                    selected.selected,
                                                    'moderateOutlier'
                                                )
                                            }
                                        >
                                            {outlierOptions ? (
                                                outlierOptions.map(
                                                    (opt, key) => (
                                                        <SingleSelectOption
                                                            key={key}
                                                            label={opt.label}
                                                            value={opt.val}
                                                        />
                                                    )
                                                )
                                            ) : (
                                                <SingleSelectOption
                                                    label={i18n.t('option one')}
                                                    value="1"
                                                />
                                            )}
                                        </SingleSelect>
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelectField
                                            inputWidth="2px"
                                            selected={numerator.extremeOutlier.toString()}
                                            onChange={(selected) =>
                                                handleParametersChange(
                                                    numerator.code,
                                                    selected.selected,
                                                    'extremeOutlier'
                                                )
                                            }
                                        >
                                            {outlierOptions ? (
                                                outlierOptions.map(
                                                    (opt, key) => (
                                                        <SingleSelectOption
                                                            key={key}
                                                            label={opt.label}
                                                            value={opt.val}
                                                        />
                                                    )
                                                )
                                            ) : (
                                                <SingleSelectOption
                                                    label={i18n.t('option one')}
                                                    value="1"
                                                />
                                            )}
                                        </SingleSelectField>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={numerator.consistency.toString()}
                                            max="100"
                                            min="0"
                                            name="defaultName"
                                            onChange={(newValue) =>
                                                handleParametersChange(
                                                    numerator.code,
                                                    newValue.value,
                                                    'consistency'
                                                )
                                            }
                                            step="1"
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelectField
                                            selected={numerator.trend}
                                            onChange={(newValue) =>
                                                handleParametersChange(
                                                    numerator.code,
                                                    newValue.selected,
                                                    'trend'
                                                )
                                            }
                                        >
                                            <SingleSelectOption
                                                label={i18n.t('Constant')}
                                                value="constant"
                                            />
                                            <SingleSelectOption
                                                label={i18n.t('Increasing')}
                                                value="increasing"
                                            />
                                            <SingleSelectOption
                                                label={i18n.t('Decreasing')}
                                                value="decreasing"
                                            />
                                        </SingleSelectField>
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelectField
                                            selected={numerator.comparison}
                                            onChange={(newValue) =>
                                                handleParametersChange(
                                                    numerator.code,
                                                    newValue.selected,
                                                    'comparison'
                                                )
                                            }
                                        >
                                            <SingleSelectOption
                                                label={i18n.t('Overall result')}
                                                value="ou"
                                            />
                                            <SingleSelectOption
                                                label={i18n.t(
                                                    'Expected result'
                                                )}
                                                value="th"
                                            />
                                        </SingleSelectField>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={numerator.missing.toString()}
                                            max="100"
                                            min="0"
                                            name="defaultName"
                                            onChange={(newValue) =>
                                                handleParametersChange(
                                                    numerator.code,
                                                    newValue.value,
                                                    'missing'
                                                )
                                            }
                                            step="1"
                                            type="number"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <p>{i18n.t('Dataset completeness')}</p>
            <p>
                {i18n.t(
                    'Set the thresholds for various completeness in the table below. Only dataset linked to indicators are displayed.'
                )}
            </p>
            <hr />
            <ul>
                <li>
                    {i18n.t(
                        'Completeness: Threshold for completeness of reporting.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Extreme outliers: Number of standard deviations (SD) from the mean for a values to quality as an extreme outlier.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Consistency: Threshold for consistency over time (percentage change over time).',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Expected trend: Whether the numerator value is expected to be constant over time or increase/decrease.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Missing/zero values: Whether to compare consistency over time across organisation units, or to the expected change (e.g. constant or increasing/decreasing).',
                        { nsSeparator: '-:-' }
                    )}
                </li>
                <li>
                    {i18n.t(
                        'Missing/zero values: Threshold for missing/zero values for variable completeness. Note: when zero values are not stored for a data element, zeros and missing are not differentiated.',
                        { nsSeparator: '-:-' }
                    )}
                </li>
            </ul>

            <div className="qualityParametersContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>{i18n.t('Group ')}</TableCellHead>
                            <TableCellHead>
                                {i18n.t('Completeness (%) ')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Timeliness(%)')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Consistency (%) ')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Expected trend')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Compare orgunit consistency with')}
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {datasets ? (
                            datasets.map((dataset, key) => (
                                <TableRow key={key}>
                                    <TableCell>{dataset.name}</TableCell>
                                    <TableCell>
                                        <Input
                                            max="100"
                                            min="0"
                                            name="defaultName"
                                            onChange={() =>
                                                console.log('changed option')
                                            }
                                            step="1"
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            max="100"
                                            min="0"
                                            name="defaultName"
                                            onChange={() =>
                                                console.log('changed option')
                                            }
                                            step="1"
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            max="100"
                                            min="0"
                                            name="defaultName"
                                            onChange={() =>
                                                console.log('changed option')
                                            }
                                            step="1"
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelectField
                                            onChange={() =>
                                                console.log('changed option')
                                            }
                                        >
                                            <SingleSelectOption
                                                label={i18n.t('Constant')}
                                                value="Constant"
                                            />
                                            <SingleSelectOption
                                                label={i18n.t('Increasing')}
                                                value="Increasing"
                                            />
                                            <SingleSelectOption
                                                label={i18n.t('Decreasing')}
                                                value="Decreasing"
                                            />
                                        </SingleSelectField>
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelectField
                                            onChange={() =>
                                                console.log('changed option')
                                            }
                                        >
                                            <SingleSelectOption
                                                label={i18n.t('Overall result')}
                                                value="Overall result"
                                            />
                                            <SingleSelectOption
                                                label={i18n.t(
                                                    'Expected result'
                                                )}
                                                value="Expected result"
                                            />
                                        </SingleSelectField>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell></TableCell>
                            </TableRow>
                        )}

                        {/* Save button */}

                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <Button
                                    name="Primary button"
                                    onClick={() => onSaveChanges()}
                                    primary
                                    button
                                    value="default"
                                    icon={<IconAdd16 />}
                                >
                                    {i18n.t('Save Changes')}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

NumeratorParameters.propTypes = {
    configurations: PropTypes.object,
    mappedNumerators: PropTypes.object,
    toggleState: PropTypes.number,
}
