import EpochTimeToFlowDataPointConverter from "./epochTimeToFlowDataPointConverter";
import FlowDataPoint from "../models/flowDataPoint.js";

let generateDataPoints = (size, offset, duration = 100) => {
  let dataPoints = [];
  for (var i = 0; i < size; i++) {
    dataPoints.push(
      new FlowDataPoint(i * duration + offset, i * duration + duration + offset)
    );
  }
  return dataPoints;
};

describe("Test convert method", () => {
  test("null input throws error", () => {
    expect(() => EpochTimeToFlowDataPointConverter.convert(null)).toThrow(
      "No data provided."
    );
  });

  test("empty list gives empty response", () => {
    expect(EpochTimeToFlowDataPointConverter.convert([])).toEqual([]);
  });

  test("single data point returns expected result", () => {
    let dataPoints = [100];
    let expectedResponseDataPoints = [new FlowDataPoint(0, 100)];
    expect(EpochTimeToFlowDataPointConverter.convert(dataPoints)).toEqual(
      expectedResponseDataPoints
    );
  });

  test("10 data points returns correct data point", () => {
    let dataPoints = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    let expectedResponseDataPoints = generateDataPoints(10, 0);
    expect(EpochTimeToFlowDataPointConverter.convert(dataPoints)).toEqual(
      expectedResponseDataPoints
    );
  });
});
