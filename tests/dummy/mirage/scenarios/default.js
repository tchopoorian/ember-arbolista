import Ember from 'ember';

export default function(server) {

  var roots = server.createList('collection', 10);

  roots.forEach(function(parent){
    server.createList('collection', 3, { parent });
  });

}
