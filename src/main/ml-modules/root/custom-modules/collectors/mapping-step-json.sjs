'use strict';
const collection = "json-ingest-step-json"

let maxDateTime = cts.max(cts.elementReference(xs.QName("RequiredDate")), null, cts.collectionQuery(collection));
let minDateTime = maxDateTime.subtract(xs.dayTimeDuration("P30D"));

cts.uris(
    null, 
    null,
    cts.andQuery([
        cts.collectionQuery(collection),
        cts.jsonPropertyRangeQuery("RequiredDate", "<=", maxDateTime),
        cts.jsonPropertyRangeQuery("RequiredDate", ">=", minDateTime)
    ])
);