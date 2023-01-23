import FlowDefaultEventClassifier from "../flowDefaultEventClassifier.js";

class FlowEvent {
  time = "";
  totalPulseCount = "";
  eventType = "";
  profile = [];
  constructor(profile, classifier = new FlowDefaultEventClassifier()) {
    this.time = profile[profile.length - 1].endEpoch - profile[0].startEpoch;
    this.totalPulseCount = profile.length;
    this.profile = profile;
    this.eventType = classifier.classify(this);
  }
}

export default FlowEvent;
