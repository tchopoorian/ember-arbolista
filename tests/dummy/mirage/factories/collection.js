
import { Factory, faker, trait, association } from 'ember-cli-mirage';
import Ember from 'ember';

const { get } = Ember;

export default Factory.extend({
  name() {
    return faker.name.findName();
  },
  parent: null,
  // parentId: null,
  children: null
});
