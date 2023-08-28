export const SettingsProcessor = (data) => {
    let settingsInfo = data ? data?.results.numerators.filter((setting) => setting.core === true && setting.dataID !== null) : []
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
    return processedSettings
}