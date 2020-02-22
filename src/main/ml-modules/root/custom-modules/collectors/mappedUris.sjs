'use strict';

let lastDateTime = 
  cts.max(
    cts.elementReference(xs.QName("timeEnded")), 
    null,  
    cts.jsonPropertyValueQuery("name", "mapping")
  );

let jobID = 
fn.head(cts.search(cts.andQuery([
  cts.jsonPropertyRangeQuery("timeEnded", "=", lastDateTime),
  cts.jsonPropertyValueQuery("name", "mapping")
]))).root.batch.jobId;

var processedURisObject = {}

cts.search(cts.andQuery([
  cts.jsonPropertyValueQuery("jobId", jobID),
  cts.jsonPropertyValueQuery("name", "mapping")
])
).toArray()
 .map(doc => doc.root.batch.uris)
 .forEach(urisArray => urisArray.toObject().forEach(uri => processedURisObject[uri] = uri));

let uris = Object.keys(processedURisObject);

Sequence.from(uris)