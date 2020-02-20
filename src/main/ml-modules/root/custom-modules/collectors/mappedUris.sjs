'use strict';
var options;

let uris = cts.uris(null, null, cts.collectionQuery(options.collections));

const checkUris = () => {return cts.uris(null, null, cts.documentQuery(uris))};

xdmp.invokeFunction(
  checkUris, 
  {database: xdmp.database(options.sourceDatabase)}
)