import { useDataQuery } from "@dhis2/app-runtime";
import { loadAnalytics } from "../../datasource/dataset/dataset.source";

export const getAnalytics = () => {

    let { loading, error, data } = useDataQuery(loadAnalytics, {}, {}, {}, {}, {});
    if(loading) {
        return {
            status: 'Loading ...',
            data: {}
        }
    }
    if(error) {
        return {
            status: 'Error',
            data: {}
        }
    }
    if(data) {
        return {
            status: 'Success',
            data
        }
    }

}