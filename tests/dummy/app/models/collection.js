import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  parentId: DS.attr('number'),
  parent: DS.belongsTo('collection', { inverse: 'children' }),
  children: DS.hasMany('collection', { inverse: 'parent' })
});
