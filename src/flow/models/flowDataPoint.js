class FlowDataPoint {
  constructor(startEpoch, endEpoch) {
    this.startEpoch = startEpoch;
    this.endEpoch = endEpoch;
    this.duration = this.endEpoch - this.startEpoch;
  }

  toJSON() {
    return this.duration;
  }
}

export default FlowDataPoint;
