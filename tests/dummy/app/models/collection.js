import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  parent: DS.belongsTo('collection', { inverse: 'children' }),
  children: DS.hasMany('collection', { inverse: 'parent' })
});
