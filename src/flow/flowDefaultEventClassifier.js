import { MINIMUM_DATA_COUNT, TIMESTAMP_THRESHOLD_INCLUSIVE, EXTRACTION_TAIL_RATIO } from "./constants.js";
import { FlowEventType } from "./flowEventType.js";

class FlowDefaultEventClassifier {
  classify = (flowEvent) => {
    if (
      flowEvent.totalPulseCount < MINIMUM_DATA_COUNT ||
      flowEvent.profile.some(
        (dataPoint) => dataPoint.duration > TIMESTAMP_THRESHOLD_INCLUSIVE
      )
    ) {
      return FlowEventType.NOISE;
    }

    // 
    // does it have a long tail? the best way would be to fit a distribution to these data sets.  That would allow
    // us to identify other shapes.  
    
    //For the purposes of this excercise, we can simply calulate if there is a
    // long tail by looking at the ratio of total duration in the first half and last half of data
    
    const halfIndex = Math.ceil(flowEvent.profile.length / 2);    
    const firstHalfDuration = flowEvent.profile[halfIndex-1].endEpoch - flowEvent.profile[0].startEpoch;
    const secondHalfDuration = flowEvent.profile[flowEvent.profile.length - 1].endEpoch - flowEvent.profile[halfIndex].startEpoch;

    if(firstHalfDuration > secondHalfDuration * EXTRACTION_TAIL_RATIO){
        return FlowEventType.PURGE;
    } 

    return FlowEventType.EXTRACTION;
  };
}

export default FlowDefaultEventClassifier;
