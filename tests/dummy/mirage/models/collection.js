import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  parent: belongsTo('collection', { inverse: 'children' }),
  children: hasMany('collection', { inverse: 'parent' }),
});
