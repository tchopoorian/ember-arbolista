import Ember from 'ember';
import layout from '../templates/components/arbolista-list';

const { computed, get } = Ember;

export default Ember.Component.extend({
  layout,

  tagName: 'ul',
  classNames: ['tenzo-tree-list'],
  classNameBindings: ['level'],

  currentDepth: 0,

  level: computed('currentDepth', function(){
    return `level-${get(this, 'currentDepth')}`;
  }),

  init() {
    this._super(...arguments);
    let depth = get(this,'currentDepth');

    if (typeof depth === 'number') {
      depth = depth + 1;
    } else {
      depth = 1;
    }
    this.set('currentDepth', depth);
  }


});
