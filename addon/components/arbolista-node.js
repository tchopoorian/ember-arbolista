import Ember from 'ember';
import layout from '../templates/components/arbolista-node';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  layout,
  
  tagName: 'li',
  classNames: ['tree-node'],
  classNameBindings: ['isCurrentNode:is-current-node'],

  node: computed('rawNode', 'rawNode.children.[]', function() {
    return get(this, 'rawNode');
  }),

  isCurrentNode: computed('currentNode', function() {
    return get(this, 'node') === get(this, 'currentNode');
  }),

  dragOn: false,

  actions: {

    dragOverAction() {
      this.set('dragOn', true);
    },

    dragOutAction() {
      this.set('dragOn', false);
    }

  }

});
