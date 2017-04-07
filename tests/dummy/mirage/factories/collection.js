import { Factory } from 'ember-cli-mirage';

export default Factory.extend({

  name: faker.lorem.text,
  parentId: null,
  children: []

});
