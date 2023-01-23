import {
  MINIMUM_DATA_COUNT,
  TIMESTAMP_THRESHOLD_INCLUSIVE,
} from "./constants.js";
import FlowDefaultEventClassifier from "./flowDefaultEventClassifier.js";
import { FlowEventType } from "./flowEventType.js";
import FlowDataPoint from "./models/flowDataPoint.js";
import FlowEvent from "./models/flowEvent.js";

let generateDataPoints = (size, offset, duration = 100) => {
  let dataPoints = [];
  for (var i = 0; i < size; i++) {
    dataPoints.push(
      new FlowDataPoint(i * duration + offset, i * duration + duration + offset)
    );
  }
  return dataPoints;
};

test("default constructor does not throw errors", () => {
  new FlowDefaultEventClassifier();
});

describe("Test classify method", () => {
  test("event with less than threshold MINIMUM_DATA_COUNT classified as noise", () => {
    let event = new FlowEvent(generateDataPoints(MINIMUM_DATA_COUNT - 1, 100));
    expect(new FlowDefaultEventClassifier().classify(event)).toEqual(
      FlowEventType.NOISE
    );
  });

  test("event with threshold MINIMUM_DATA_COUNT with duration less than TIMESTAMP_THRESHOLD_INCLUSIVE and no tail returns purge", () => {
    let event = new FlowEvent(
      generateDataPoints(MINIMUM_DATA_COUNT, TIMESTAMP_THRESHOLD_INCLUSIVE / 2)
    );
    expect(new FlowDefaultEventClassifier().classify(event)).toEqual(
      FlowEventType.PURGE
    );
  });

  test("event with threshold MINIMUM_DATA_COUNT with duration less than TIMESTAMP_THRESHOLD_INCLUSIVE and tail returns extraction", () => {
    const dataPoints = [
      ...generateDataPoints(
        MINIMUM_DATA_COUNT,
        TIMESTAMP_THRESHOLD_INCLUSIVE / 2
      ),
      ...generateDataPoints(
        MINIMUM_DATA_COUNT * 2,
        TIMESTAMP_THRESHOLD_INCLUSIVE / 4
      ),
    ];
    let event = new FlowEvent(dataPoints);
    expect(new FlowDefaultEventClassifier().classify(event)).toEqual(
      FlowEventType.EXTRACTION
    );
  });
});
