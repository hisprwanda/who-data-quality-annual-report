import { Button} from '@dhis2/ui'
import denominatorTypes from "../data/denominatorTypes.json";


// TODO: in the future, pass the data from a global state or context api 

export const getDenominatorType = (type) => {
  const denominatorType = denominatorTypes.find((denominator) => denominator.code == type);
  console.log('Denominator: ', denominatorType);
  return denominatorType ;
};

export const makeOutlierOptions= () =>{
  var opts = [];
  opts.push({"val": '-1', "label": "Ignore"});
  for (let i = 1.5; i <= 4.05; i += 0.1) {
    opts.push({"val": (Math.round(10*i)/10).toString(), "label": (Math.round(10*i)/10).toString()});
  }

  console.log('optionsss: ', opts)
  return opts;
}