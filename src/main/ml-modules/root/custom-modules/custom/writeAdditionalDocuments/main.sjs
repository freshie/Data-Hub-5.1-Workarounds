
const DataHub = require("/data-hub/5/datahub.sjs");
const datahub = new DataHub();
 
function main(content, options) {

    //grab the doc id/uri
    let id = content.uri;
  
    //here we can grab and manipulate the context metadata attached to the document
    let context = content.context;
  
    //let's set our output format, so we know what we're exporting
    let outputFormat = options.outputFormat ? options.outputFormat.toLowerCase() : datahub.flow.consts.DEFAULT_FORMAT;
  
    //here we check to make sure we're not trying to push out a binary or text document, just xml or json
    if (outputFormat !== datahub.flow.consts.JSON && outputFormat !== datahub.flow.consts.XML) {
      datahub.debug.log({
        message: 'The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.',
        type: 'error'
      });
      throw Error('The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.');
    }
  
    /*
    This scaffolding assumes we obtained the document from the database. If you are inserting information, you will
    have to map data from the content.value appropriately and create an instance (object), headers (object), and triples
    (array) instead of using the flowUtils functions to grab them from a document that was pulled from MarkLogic.
    Also you do not have to check if the document exists as in the code below.
  
    Example code for using data that was sent to MarkLogic server for the document
    let instance = content.value;
    let triples = [];
    let headers = {};
     */
  
    //Here we check to make sure it's still there before operating on it
    if (!fn.docAvailable(id)) {
      datahub.debug.log({message: 'The document with the uri: ' + id + ' could not be found.', type: 'error'});
      throw Error('The document with the uri: ' + id + ' could not be found.')
    }
  
    //grab the 'doc' from the content value space
    let doc = content.value;
  
    // let's just grab the root of the document if its a Document and not a type of Node (ObjectNode or XMLNode)
    if (doc && (doc instanceof Document || doc instanceof XMLDocument)) {
      doc = fn.head(doc.root);
    }
  
    //get our instance, default shape of envelope is envelope/instance, else it'll return an empty object/array
    let instance = datahub.flow.flowUtils.getInstance(doc);
    
    const instanceObj = instance.toObject();
    
    const contentsArray = [];
    
    // get triples, return null if empty or cannot be found
    let triples = datahub.flow.flowUtils.getTriples(doc) || [];
  
    //gets headers, return null if cannot be found
    let headers = datahub.flow.flowUtils.getHeaders(doc) || [];
    
    delete instanceObj.OrderDetails 
    
    //form our envelope here now, specifying our output format
    let envelope = datahub.flow.flowUtils.makeEnvelope(instanceObj, headers, triples, outputFormat);
    
    //assign our envelope value
    content.value = envelope;
  
    //assign the uri we want, in this case the same
    content.uri = id;
  
    //assign the context we want
    content.context = context;
    
    contentsArray.push(content)
    
     /*
      using xpath because sometimes OrderDetails is an array of OrderDetail objects 
      and sometimes its just an object
     */
     instance.xpath("OrderDetails").toArray().forEach(function(OrderDetail, index){
        const OrderDetailContent = {}
        const newOrderDetail = OrderDetail.toObject(); 
       
        newOrderDetail.OrderID = instanceObj.OrderID;
       
        //form our envelope here now, specifying our output format
        const newOrderDetailEnvelope = datahub.flow.flowUtils.makeEnvelope(newOrderDetail, headers, triples, outputFormat);
        
        //assign the uri we want, in this case the same
        OrderDetailContent.uri = "/orders/"+instanceObj.OrderID+"/details/"+(index + 1)+".json";
        
        //assign our envelope value
        OrderDetailContent.value = newOrderDetailEnvelope;
        
        //assign the context we want
        OrderDetailContent.context = context;
        
        OrderDetailContent.context.collections = ['OrderDetails'];
        
        contentsArray.push(OrderDetailContent)                                                   
     });
    
    return contentsArray;
}

module.exports = {
    main: main
};  


