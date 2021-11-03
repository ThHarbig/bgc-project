import axios from 'axios';

function getComparisons(dataset, callback){
    const params = { dataset: dataset };
    axios.get("api/comparisons",{params}).then((response)=>callback(response))
}
function getBGCs(dataset, comparison, callback){
    const params = { dataset,comparison };
    axios.get("api/BGCs",{params}).then((response)=>callback(response))
}

export {getComparisons,getBGCs};