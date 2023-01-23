import * as readline from "readline";
import * as fs from "fs";
import FlowDataIngestor from "./flow/flowDataIngestor.js";
import EpochTimeToFlowDataPointConverter from "./flow/converters/epochTimeToFlowDataPointConverter.js";

if (process.argv.length < 4) {
  throw Error("Please specify input and output files.");
}

var lineReader = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
});

let epochTimes = [];

lineReader
  .on("line", function (line) {
    epochTimes.push(line);
  })
  .on("close", () => {
    let ingestor = new FlowDataIngestor();
    ingestor.ingestFromFlowDataPoints(
      EpochTimeToFlowDataPointConverter.convert(epochTimes)
    );
    ingestor.close();
    fs.writeFile(
      process.argv[3],
      JSON.stringify(ingestor.getProcessedEvents(), null, 4),
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + process.argv[3]);
        }
      }
    );
  });
