import FlowDataIngestor from "./flowDataIngestor.js";
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
  new FlowDataIngestor();
});

describe("Test ingestFromFlowDataPoints method", () => {
  test("null input throws error", () => {
    expect(() =>
      new FlowDataIngestor().ingestFromFlowDataPoints(null)
    ).toThrow("No data provided.");
  });

  test("empty list gives empty response", () => {
    let underTest = new FlowDataIngestor();
    underTest.ingestFromFlowDataPoints([]);
    expect(underTest.getProcessedEvents()).toEqual([]);
  });

  test("too few data points returns noise", () => {
    let dataPoints = [new FlowDataPoint(0, 100), new FlowDataPoint(105, 150)];
    let expectedResponse = new FlowEvent(dataPoints);
    expectedResponse.eventType = "noise";
    let underTest = new FlowDataIngestor();
    underTest.ingestFromFlowDataPoints(dataPoints);
    underTest.close();
    expect(underTest.getProcessedEvents()).toEqual([expectedResponse]);
  });

  test("10 data points return single event", () => {
    let dataPoints = generateDataPoints(10, 0);
    let expectedResponse = new FlowEvent(dataPoints);
    expectedResponse.eventType = "purge";
    let underTest = new FlowDataIngestor();
    underTest.ingestFromFlowDataPoints(dataPoints);
    underTest.close();
    expect(underTest.getProcessedEvents()).toEqual([expectedResponse]);
  });

  test("two events with seperation of 1 second are returned", () => {
    let dataPointsEvent1 = generateDataPoints(21, 0);

    let dataPointsNoise = generateDataPoints(1, 1000, 1000);

    let dataPointsEvent2 = generateDataPoints(21, 2000);

    let allDataPoints = [
      ...dataPointsEvent1,
      ...dataPointsNoise,
      ...dataPointsEvent2,
    ];

    let expectedNoiseEvent = new FlowEvent(dataPointsNoise);
    expectedNoiseEvent.eventType = "noise";
    let expectedResponse = [
      new FlowEvent(dataPointsEvent1),
      expectedNoiseEvent,
      new FlowEvent(dataPointsEvent2),
    ];

    let underTest = new FlowDataIngestor();
    underTest.ingestFromFlowDataPoints(allDataPoints);
    underTest.close();
    expect(underTest.getProcessedEvents()).toEqual(expectedResponse);
  });
});


