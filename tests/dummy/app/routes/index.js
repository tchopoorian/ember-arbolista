import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.get('store').findAll('collection');
    // this.get('/collections', (schema, request) => {
    //   console.log(schema);
    //   console.log(request);
    //   return schema.collections.all();
    // });
  }

});
