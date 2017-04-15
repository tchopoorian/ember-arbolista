
import { Factory, faker, trait, association } from 'ember-cli-mirage';
import Ember from 'ember';

const { get } = Ember;

export default Factory.extend({
  name() {
    return faker.name.findName();
  },
  parent: null,
  parentId: null,
  children: null
  // withChildren: trait({
  //   afterCreate(parent, server) {
  //     server.create('collection', { parent, name: 'first child', parent_id: parent.id });
  //     server.create('collection', { parent, name: 'second child' });
  //     server.create('collection', { parent, name: 'third child' });
  //   }
  // })
});
