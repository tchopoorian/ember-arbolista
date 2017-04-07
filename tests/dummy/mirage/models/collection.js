import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({

  children: hasMany('collection', {inverse: 'children'})
});
