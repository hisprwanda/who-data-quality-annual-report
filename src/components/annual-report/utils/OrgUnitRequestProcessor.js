export const getOrgUnitLevel = (response) => {
    const child = response?.data?.results?.children
    console.log(response, child)
    const orgUnitlevel = child?.length > 0 ? child[0]?.level : 0
    console.log(orgUnitlevel, 'is level')
    return orgUnitlevel
}