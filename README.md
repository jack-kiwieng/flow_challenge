# Flow Event Processor

This package contains code which can convert a file of epoch times to a meaningful json file which represents coffee machine events.

## How to use it
Run the command below to download dependencies:
```
npm install
```

To run the program:

```
npm start inputFile outputFile
```

Example:

``` 
npm start pulses.csv out.json 
```

To run unit tests:
```
npm test
```


### Overview
There are two main stages in processing the input file.  The first is to convert it to FlowDataPoint objects, which is a representation of start time, end time and duration.  This is done in the EpochTimeToFlowDataPointConverter class.

The second stage in processing is to split the data into discrete events.  This is done by the FlowDataIngestor class.
There is a constants file that configures how this seperation is done.


### Ingestion strategy

The FlowDataIngestor can take a list of FlowDataPoints, and holds state.  In this case, it takes the entire file's worth of data points.  In a more generic case, you could give it single data points (or a subset of points) and it will continue to process.  By having it keep state, it can continue to ingest streaming data from a coffee machine as pours continue. 

Also included in the ingestor is the subscribeNewEvent method.  This can be used when streaming data to have new events be pushed to other code for further processing.

### FlowDataPoint classification

The FlowDataPoint class handles classification of an event into a FlowEventType (noise, purge or extraction).  FlowDataPoint has a classifier injected into it (the default classifier by default).

The default classifier, FlowDefaultEventClassifier uses simple math to identify event type.  This could be expanded and improved upon a lot to classify more complicated events.