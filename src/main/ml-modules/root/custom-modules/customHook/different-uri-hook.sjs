/**
 * This is a simple example (not prescriptive, just an example), of a custom hook that determines if the incoming order
 * is a duplicate of an existing order in the staging database, and if so, the existing order is archived. The benefit
 * of using a custom hook is that an update transaction has less impact here vs performing an update in the main module.
 */
declareUpdate();

// A custom hook receives the following parameters via DHF. Each can be optionally declared.
var uris; // an array of URIs (may only be one) being processed
var content; // an array of objects for each document being processed
var options; // the options object passed to the step by DHF
var flowName; // the name of the flow being processed
var stepNumber; // the index of the step within the flow being processed; the first step has a step number of 1
var step; // the step definition object

// Custom hooks can define zero or more properties in the step definition that declares them

for (const contentObject of content) {    
    xdmp.documentInsert(
        "/different-uri" + contentObject.uri, 
        contentObject.value, 
        {
        permissions: contentObject.context.permissions,
        collections: options.collections.concat(contentObject.context.collections).concat(["different-uri"])
        }
    );
   // xdmp.documentDelete(contentObject.uri);
}

