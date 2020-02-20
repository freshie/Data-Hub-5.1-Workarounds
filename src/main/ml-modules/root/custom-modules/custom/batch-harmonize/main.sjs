const DataHub = require("/data-hub/5/datahub.sjs");
const datahub = new DataHub();
 
function main(batch, options) {
  
  const products = cts.doc('/reference/products.json').toObject();
  const contentArray = [];
 
  for (let content of batch) {
    let id = content.uri;
 
    if (!fn.docAvailable(id)) {
      datahub.debug.log({message: 'The document with the uri: ' + id + ' could not be found.', type: 'error'});
      throw Error('The document with the uri: ' + id + ' could not be found.')
    }
 
    let doc = content.value;
 
    if (doc && (doc instanceof Document || doc instanceof XMLDocument)) {
      doc = fn.head(doc.root);
    }
 
    //Handle docs with or without an envelope
    let instance = {};
    if(fn.exists(doc.xpath("/envelope/instance"))) {
      instance = datahub.flow.flowUtils.getInstance(doc) || {};
    } else {
      instance = doc;
    }
 
    let triples = datahub.flow.flowUtils.getTriples(doc) || [];
    let headers = datahub.flow.flowUtils.getHeaders(doc).toObject() || {};
 
    const entityType = "Order";
    const entityVersion = "1.0";
    let wrappedInstance = {
      "info": {
        "title": entityType,
        "version": entityVersion
      }
    };

   const instanceObj = instance.toObject();
  
    /*
      using xpath because sometimes OrderDetails is an array of OrderDetail objects 
      and sometimes its just an object
     */
   instanceObj.OrderDetails = instance.xpath("OrderDetails/OrderDetail").toArray().map(function(OrderDetail){
      let newOrderDetail = OrderDetail.toObject();
     /*
        example of adding reference data
    */
      newOrderDetail.ProductName = products[OrderDetail.ProductID];       

      return newOrderDetail;                                                     
   });
   

    wrappedInstance[entityType] = instanceObj;
 
    content.value = datahub.flow.flowUtils.makeEnvelope(wrappedInstance, headers, triples, "json");
    contentArray.push(content);
  }
 
  return contentArray;
}

module.exports = {
    main: main
};  