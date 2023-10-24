import React from 'react'
import style from './style/style.module.css'
import {
    completenessLabel,
    mainHeaderLabel,
} from '../../../annual-report/utils/report/ReportLabel.util'

export const CompletenessOfReport = () => {
    return (
        <div className={style.reportParentContainer}>
            <div className={style.reportingMainHeader}>
                {mainHeaderLabel.completenessOfReporting}
            </div>
            <div className={style.reportingDataSection}>
                <div>{completenessLabel.completenessOfFacilityReporting}</div>
                <div>{completenessLabel.completedReportPercentage}</div>
                <div>
                    <table>
                        <tr className={style.tableTitle}>
                            <td rowSpan="2">{completenessLabel.dataset}</td>
                            <td rowSpan="2">
                                {completenessLabel.qualityThreashold}
                            </td>
                            <td rowSpan="2">
                                {completenessLabel.overallScore}
                            </td>
                            <td colSpan="3">
                                {completenessLabel.divergentScore}
                            </td>
                        </tr>
                        <tr className={style.tableTitle}>
                            <td>{completenessLabel.num}</td>
                            <td>{completenessLabel.percent}</td>
                            <td>{completenessLabel.name}</td>
                        </tr>
                        <tr>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                        </tr>
                        <tr>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                            <td>Dynamic data row</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}
