import FlowEvent from "./models/flowEvent.js";
import {
  MINIMUM_DATA_COUNT,
  TIMESTAMP_THRESHOLD_INCLUSIVE,
} from "./constants.js";

const IngestionStates = {
  DATA: "data",
  NOISE: "noise",
};

class FlowDataIngestor {
  ingestionState = IngestionStates.NOISE;
  currentEventData = [];
  completedEvents = [];

  ingestionSubscription = null;

  ingestFromFlowDataPoints = (flowDataPoints) => {
    if (!flowDataPoints) {
      throw new Error("No data provided.");
    }

    flowDataPoints.forEach((dataPoint) => {
      switch (this.ingestionState) {
        case IngestionStates.NOISE:
          this.processNoiseIngestionState(dataPoint);
          break;
        case IngestionStates.DATA:
          this.processDataIngestionState(dataPoint);
          break;
      }
    });
  };

  getProcessedEvents = () => {
    return this.completedEvents;
  };

  subscribeNewEvent = (subscriptionMethod) => {
    this.ingestionsSubscription = subscriptionMethod;
  };

  close = () => {
    if (this.currentEventData.length < MINIMUM_DATA_COUNT) {
      this.createEvent();
    } else {
      this.createEvent();
    }
    this.currentEventData = [];
    this.ingestionState = IngestionStates.NOISE;
  };

  createEvent = () => {
    if (this.currentEventData.length == 0) {
      return;
    }
    const newEvent = new FlowEvent(this.currentEventData);
    this.completedEvents.push(newEvent);
    if (!!this.ingestionSubscription) {
      this.ingestionSubscription(newEvent);
    }
  };

  processNoiseIngestionState = (dataPoint) => {
    //If we have MINIMUM_DATA_COUNT data points that are within threshold, transition to data state
    if (
      this.currentEventData.length >= MINIMUM_DATA_COUNT &&
      this.currentEventData
        .slice(-MINIMUM_DATA_COUNT)
        .every(
          (dataPoint) => dataPoint.duration <= TIMESTAMP_THRESHOLD_INCLUSIVE
        )
    ) {
      // We must carry over the first MINIMUM_DATA_COUNT data points to the new set of data
      const carryOverEvents = this.currentEventData.slice(-MINIMUM_DATA_COUNT);
      this.currentEventData.splice(-MINIMUM_DATA_COUNT);
      this.ingestionState = IngestionStates.DATA;
      this.createEvent();

      this.currentEventData = [...carryOverEvents, dataPoint];
    } else {
      this.currentEventData.push(dataPoint);
    }
  };

  processDataIngestionState = (dataPoint) => {
    // If we have a data point that is outside of threshold, transition to garbage state
    if (dataPoint.duration > TIMESTAMP_THRESHOLD_INCLUSIVE) {
      this.ingestionState = IngestionStates.NOISE;
      this.createEvent();
      this.currentEventData = [dataPoint];
    } else {
      this.currentEventData.push(dataPoint);
    }
  };

}

export default FlowDataIngestor;
