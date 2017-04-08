
import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  name() {
    return faker.name.findName();
  },
  withChildren: trait({
    afterCreate(parent, server) {
      server.create('collection', { parent, name: 'first child' });
      server.create('collection', { parent, name: 'second child' });
      server.create('collection', { parent, name: 'third child' });
    }
  })
});
