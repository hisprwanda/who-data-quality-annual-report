import { merge } from "rxjs"

export const SettingsProcessor = (data) => {
  
    // Get datasets
    const dataSets = data ? data?.results.dataSets.map(dataset => dataset.id) : []
    // Get numerators
    let settingsInfo = data ? data?.results.numerators.filter((setting) => setting.core === true && setting.dataID !== null) : []
    let configuredDataset = settingsInfo.map(conf => conf.dataSetID)
    let numeratorsFiltered = data ? data?.results.numerators.filter((setting) => setting.dataID !== null) : []
    let numeratorsProcessed = numeratorsFiltered.map(numerator => numerator.dataID)
    let mergedElements = [...dataSets, ...numeratorsProcessed]
    let codes = settingsInfo.map(c => c.code)
    let groupsInfo = data?.results?.groups
    let processedSettings = []
    groupsInfo?.map(group => {
      const x = group.members
      codes?.forEach(element => {
        if(x.includes(element)){
          processedSettings = [...processedSettings, group]
        }
      });
    })
    return {setting: processedSettings, elements: mergedElements, dataset: configuredDataset}
}