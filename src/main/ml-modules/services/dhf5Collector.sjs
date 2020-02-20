const DataHub = require("/data-hub/5/datahub.sjs");
const datahub = new DataHub();

function get(context, params) {

    const flowName = params["flow-name"];
    const options = params.options ? JSON.parse(params.options) : {};

    let step =  params["step"];
    
    if (!step) {
      step = 1;
    }

    let flowDoc = datahub.flow.getFlow(flowName);
    
    if (!fn.exists(flowDoc)) {
      context.outputStatus = [500, 'error'];
      fn.error(null, "RESTAPI-SRVEXERR", Sequence.from([404, "Not Found", "The requested flow was not found"]));
    }
    let stepDoc = flowDoc.steps[step];
    if (!stepDoc) {
        context.outputStatus = [500, 'error'];
        fn.error(null, "RESTAPI-SRVEXERR", Sequence.from([404, "Not Found", `The step number "${step}" of the flow was not found`]));
    }
    let baseStep = datahub.flow.step.getStepByNameAndType(stepDoc.stepDefinitionName, stepDoc.stepDefinitionType);
    if (!baseStep) {
        context.outputStatus = [500, 'error'];
        fn.error(null, "RESTAPI-SRVEXERR", Sequence.from([404, "Not Found", `A step with name "${stepDoc.stepDefinitionName}" and type of "${stepDoc.stepDefinitionType}" was not found`]));
    }
    let combinedOptions = Object.assign({}, baseStep.options, flowDoc.options, stepDoc.options, options);
    const collectorDatabase = combinedOptions.collectorDatabase || params.collectorDatabase;
    
    const modulesDatabase = combinedOptions.modulesDatabase || xdmp.databaseName(xdmp.modulesDatabase())

    if(!combinedOptions.sourceQuery && flowDoc.sourceQuery) {
      combinedOptions.sourceQuery = flowDoc.sourceQuery;
    }
    
    let query = combinedOptions.sourceQuery;
    
    if (!query) {
      datahub.debug.log("The collector query was empty");
      context.outputStatus = [500, 'error'];
      fn.error(null, "RESTAPI-SRVEXERR", Sequence.from([404, "Not Found", "The collector query was empty"]));
    }
    
    let results;
    try {
        let urisEval;
        const isModule = 
        fn.head(xdmp.eval(`
                var uri; 
                fn.docAvailable(uri)
                `, 
                {uri: query}, 
                {database: xdmp.database(modulesDatabase)}
            ));

        if (isModule) {
            results = xdmp.invoke(query, {options: options}, {database: xdmp.database(collectorDatabase), modules:xdmp.database(modulesDatabase) });
        } else {
            if (/^\s*cts\.uris\(.*\)\s*$/.test(query)) {
                urisEval = query;
            } else {
                urisEval = "cts.uris(null, null, " + query + ")";
            }
            results =  xdmp.eval(urisEval, {options: options}, {database: xdmp.database(collectorDatabase)});
        }
     
      context.outputStatus = [200, 'okay'];
    } catch (err) {
      datahub.debug.log(err);
      fn.error(null, 'RESTAPI-INVALIDREQ', err);
      context.outputStatus = [500, 'error'];
   }

context.outputTypes = ['application/json'];

return results;

};
exports.GET = get;