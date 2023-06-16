import { Button} from '@dhis2/ui'
import denominatorTypes from "../data/denominatorTypes.json";


// TODO: in the future, pass the data from a global state or context api 

export const getDenominatorType = (type) => {
  const denominatorType = denominatorTypes.find((denominator) => denominator.code == type);
  console.log('Denominator: ', denominatorType);
  return denominatorType ;
};

//TODO: merge these methods that find objects and make them generic
export const getDenominatorRelations = (denominators, code) => {
  let denominatorObj = denominators.find((denominator) => denominator.code == code);
  if (denominatorObj){ return denominatorObj.name }
}
