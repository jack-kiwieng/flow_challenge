import FlowDataPoint from "../models/flowDataPoint.js";

class EpochTimeToFlowDataPointConverter {
    static convert(epochTimes) {
        if (!epochTimes) {
          throw new Error("No data provided.");
        }
    
        return EpochTimeToFlowDataPointConverter.parseFlowDataPointsFromEpochTimes(epochTimes);
      }
    
    static parseFlowDataPointsFromEpochTimes(epochTimes) {
        // Parse into FlowDataPoint
        let lastTimeStamp = 0;
        let allFlow = [];
        epochTimes.forEach((timestamp) => {
          let dataPoint = new FlowDataPoint(lastTimeStamp, timestamp);
          allFlow.push(dataPoint);
          lastTimeStamp = timestamp;
        });
        return allFlow;
      }
}

export default EpochTimeToFlowDataPointConverter;