import Ember from 'ember';
import layout from '../templates/components/arbolista-root';

const { get, computed } = Ember;

export default Ember.Component.extend({
  layout,

  store: Ember.inject.service(),

  classNames: ['arbolista'],

  // defaults
  icon: 'folder',
  yieldBelowTree: false,
  dragAndDrop: false,

  treeControlsComponent: 'arbolista-controls',
  treeListComponent: 'arbolista-list',
  treeNodeComponent: 'arbolista-node',
  nodeDecoratorComponent: 'arbolista-node-decorator',

  rawRoots: computed('model', function(){
    console.log('model: ', get(this, 'model'));
    get(this, 'model').forEach(function(node){
      console.log('node: ', node);
      console.log('children: ', node.get('children'));
      console.log('parent: ', node.get('parent').get('id'));
    })
    let roots = get(this, 'model').filter(function(node){
      return node.get('parent').get('id') == null;
    })
    console.log('roots: ', roots);
    return roots;
  }),

  nestedTree: computed('rawRoots', 'rawRoots.[]', function() {
    let roots = get(this, 'rawRoots');
    let tree = get(this, '_makeLevel')(roots, this);
    return tree;
  }),

  _makeLevel: function(list, _this) {
    var level = Ember.A([]);
    list.forEach(function(node) {
      let nodeObj = get(_this, '_makeNode')(node);
      nodeObj.set('children', get(_this, '_makeLevel')(node.get('children'), _this));
      level.pushObject(nodeObj);
    });
    return level;
  },

  _makeNode: function(node) {
    let hasChildren = node.get('children').get('length') > 0;
    const Node = Ember.Object.extend();
    let nodeHash =  Node.create({
      id: node.get('id'),
      modelObject: node,
      nodeName: node.get('name'),
      modelName: node.constructor.modelName,
      parent: node.get('parent'),
      parentId: node.get('parentId'),
      isChecked: false,
      isOpen: false,
      isSelected: false,
      isDisabled: false,
      hasChildren: hasChildren,
      children: Ember.A([]),
      root: node.get('parentId') === null
    });
    return nodeHash;
  },

  _findNode: function(tree, id, _this) {

    function recursiveFind(tree, id) {
      var nodeMatch = tree.find(function(node){
        return node.get('id') == id;
      });
      if (typeof nodeMatch == 'undefined') {
        for (let node of tree) {
          nodeMatch = recursiveFind(node.get('children'), id);
          if (typeof nodeMatch != 'undefined') {return nodeMatch;}
        }
        return nodeMatch;
      } else {
        return nodeMatch;
      }
    }

    return recursiveFind(get(_this, 'nestedTree'), id);
  },

  _countNodes: function(tree) {

    function recursiveCount(tree) {
      var nodeCount = 0;
      tree.forEach(function(node){
        nodeCount+=1;
        nodeCount += recursiveCount(node.get('children'));
      });
      return nodeCount;
    }

    return recursiveCount(tree);
  },

  modelName: computed('model', function() {
    return get(this, 'model').modelName;
  }),

  treeParentObject: null,
  treeParentModelName: null,

  nodeCount: computed('nestedTree', function(){
    return (get(this, '_countNodes'))(get(this, 'nestedTree'));
  }),

  editMode: false,

  isCheckedNodes: Ember.A([]),
  isOpenNodes: Ember.A([]),

  allNodesAreClosed: computed('isOpenNodes.[]', function() {
    return (get(this, 'isOpenNodes').length == 0);
  }),

  currentNode: null,
  currentNodeHasChildren: null,
  currentNodeIsOpen: null,

  aNodeIsSelected: computed('currentNode', function() {
    return get(this, 'currentNode') != null;
  }),

  // set a property on each node of an array of nodes
  _toggleThemAll: function(nodes, property, flag) {
    let bool = flag || false;
    nodes.forEach(function(node){
      node.set(property, bool);
    })
  },

  // Recursively set property on a tree of nodes
  // If removeFromStack, then this will look for an array named (property + 'Nodes')
  //  and remove the node from that array. (E.g., isOpenNodes, which keeps track of open nodes.)
  _recursiveToggle: function(_this, tree, property, newValue, removeFromStack=false) {
    let bool = newValue || false;
    tree.forEach(function(node){
      let toggleArray = get(_this, `${property}Nodes`);
      toggleArray.removeObject(node);
      node.set(property, bool);
      get(_this, '_recursiveToggle')(_this, node.get('children'), property, bool, removeFromStack);
    });
  },

  actions: {

    nodeDropped(target, dropped) {
      if (target === dropped) {
        // do nothing
      } else {
        // add dropped node as child of target
        let oldParentId = dropped.get('parentId');
        let droppedIsRoot = !oldParentId ? true : false;
        if (!droppedIsRoot) {
          // remove dropped from children of old parent
          // first, get the old parent node
          let oldParentNode = get(this, '_findNode')(get(this, 'nestedTree'), oldParentId, this);
          let oldParentChildren = oldParentNode.get('children');
          oldParentChildren.removeObject(dropped);
          if (oldParentChildren.get('length') === 0) {
            oldParentNode.set('hasChildren', false);
          }
        } else {
          // dropped node is a root
          // remove dropped node from roots
          get(this, 'nestedTree').removeObject(dropped);
        }
        // now set up new parent node
        let newParentId = target.get('id');
        // get the new parent node
        let newParentNode = get(this, '_findNode')(get(this, 'nestedTree'), newParentId, this);
        // set parentId on Node Object
        dropped.set("parentId", newParentId);
        // also set parentId on modelObject
        let modelObject = dropped.get('modelObject');
        modelObject.set('parentId', newParentId);
        // add dropped node to children of new parent
        let children = newParentNode.get('children');
        newParentNode.set('hasChildren', true);
        children.pushObject(dropped);
        // save modelObject
        modelObject.save();
      }
    },

    dragOverAction(target, dragOverNodeAction) {
      dragOverNodeAction();
      if (get(this, 'onDragOver')) {
        get(this, 'onDragOver')(target);
      }
    },

    dragOutAction(target, dragOutNodeAction) {
      dragOutNodeAction();
      if (get(this, 'onDragOut')) {
        get(this, 'onDragOut')(target);
      }
    },

    inlineSave(node, value) {
      node.set('nodeName', value);
      let modelObject = node.get('modelObject');
      modelObject.set('name', value);
      modelObject.save();
    },

    deleteNode() {
      let node = get(this, 'currentNode');
      let nodeParentId = node.get('parentId');
      if (node != null) {
        if (confirm('You sure about this?')) {
          if (!nodeParentId) {
            // node is a root node
            get(this, 'nestedTree').removeObject(node);
          } else {
            // node is not a root node so go find its parent
            let parentNode = get(this, '_findNode')(get(this, 'nestedTree'), nodeParentId, this);
            // remove the child from the parent (always sad but sometimes necessary)
            let children = parentNode.get('children');
            children.removeObject(node);
            // figure out if the parent of deleted node needs to be closed
            // I.e., only close the parent if the deleted node was its only child
            let emptyNest = children.get('length') == 0;
            if (emptyNest) {
              parentNode.set('hasChildren', false);
              if (parentNode.get('isOpen')) {
                parentNode.set('isOpen', false);
                get(this, 'isOpenNodes').removeObject(parentNode);
                if (get(this, 'getOpenNodes')) {
                  get(this, 'getOpenNodes')(get(this, 'isOpenNodes'));
                }
              }
            }

          }
          // this.decrementProperty('nodeCount');
          // persist deletion
          node.modelObject.destroyRecord();
          this.set('currentNode', null);
          this.set('currentNodeHasChildren', null);
          // user hook
          if (get(this, 'onDeleteNode')) {
            get(this, 'onDeleteNode')(node, get(this, 'nodeCount'));
          }
        }
      }
    },

    createNode() {
      var modelName = get(this, 'modelName');
      var parentNode, parentId
      if (this.get('currentNode') != null) {
        // new node is a child
        parentNode = this.get('currentNode');
        parentId = parentNode.get('id');
      } else {
        // new node is a root
        parentNode = null;
        // if a node is not currently selected, ask user if she wants to create a root node
        if (confirm('Create root node?')) {
          parentId = "#";
        } else {
          return;
        }
      }
      // create
      var newModelObject = this.get('store').createRecord(modelName, {
        name: 'New Node',
        parentId: parentId
      });
      // this is not the node parent but an optional object that owns the tree
      var treeParent = this.get('treeParentObject');
      if (treeParent != null) {
        // set the belongsTo parent of the newNode to the tree parent object
        newModelObject.set(this.get('treeParentModelName'), treeParent);
      }
      newModelObject.save().then((newObj) => {
        var newNode;
        if (newObj.get('parentId') == null) {
          // if new node is a root, add it to the list of roots
          newNode = get(this, '_makeNode')(newObj);
          this.get('nestedTree').pushObject(newNode);
        } else {
          // if new node is not a root, add it to the list of children of its parent
          newNode = get(this, '_makeNode')(newObj);
          let children = parentNode.get('children');
          parentNode.set('hasChildren', true);
            if (children.get('length') > 0 ) {
              children.pushObject(newNode);
            } else {
              parentNode.set('children', [newNode]);
            }
          // if new node is not a root and its parent is not open, then open it
          if (!parentNode.get('isOpen')) {
            parentNode.set('isOpen', true);
            get(this, 'isOpenNodes').pushObject(parentNode);
            // send open nodes array via user hook if defined
            if (get(this, 'getOpenNodes')) {
              get(this, 'getOpenNodes')(get(this, 'isOpenNodes'));
            }
          }
        }
        // this.incrementProperty('nodeCount');
        if (get(this, 'onCreateNode')) {
          get(this, 'onCreateNode')(newNode, get(this, 'nodeCount'));
        }
      });
    },

    nodeClicked(node) {
      let nodeAlreadySelected = get(this, 'currentNode') === node;
      if (nodeAlreadySelected) {
        this.set('currentNode', null);
        this.set('currentNodeHasChildren', null);
        this.set('currentNodeIsOpen', null);
      } else {
        this.set('currentNode', node);
        this.set('currentNodeHasChildren', node.get('hasChildren'));
        this.set('currentNodeIsOpen', node.get('isOpen'));
      }
      // node click hook for user
      if (get(this, 'onNodeClick')) {
        get(this, 'onNodeClick')(node, !nodeAlreadySelected);
      }
    },

    toggleEditMode() {
      this.toggleProperty('editMode');
      if (get(this, 'editMode') === true) {
        if (get(this, 'onStartEditMode')) {
          get(this, 'onStartEditMode')();
        }
      } else {
        if (get(this, 'onStopEditMode')) {
          get(this, 'onStopEditMode')();
        }
        let checked = get(this, 'isCheckedNodes');
        get(this, '_toggleThemAll')(checked, 'isChecked', false)
        this.set('checkedNodes', []);
        if (get(this, 'getCheckedNodes')) {
          get(this, 'getCheckedNodes')(get(this, 'checkedNodes'));
        }
      }
    },

    toggleOpen(node) {
      let open = node.get('isOpen');
      if (open) {
        // close all children of this node if it's going to be closed
        // need to do this before closing the top node
        // params = this, tree, property, new property value, removeFromStack?
        get(this, '_recursiveToggle')(this, node.get('children'), 'isOpen', false, true);
      }
      node.set('isOpen', !open);
      // after the toggle, if it's now open
      if (node.isOpen) {
        this.get('isOpenNodes').pushObject(node);

        // api hook for user
        if (get(this, 'onNodeOpen')) {
          get(this, 'onNodeOpen')(node);
        }
      } else {
        // if it's now closed
        this.get('isOpenNodes').removeObject(node);

        // api hook for user
        if (get(this, 'onNodeClose')) {
          get(this, 'onNodeClose')(node);
        }
      }

      if (get(this, 'getOpenNodes')) {
        get(this, 'getOpenNodes')(get(this, 'isOpenNodes'));
      }
    },

    toggleChecked(node) {
      let checked = node.get('isChecked');
      node.set('isChecked', !checked)
      // api hook for user
      if (get(this, 'onToggleCheck')) {
        get(this, 'onToggleCheck')(node, checked);
      }
      if (node.isChecked) {
        // if on turn it off
        this.get('isCheckedNodes').pushObject(node);
      } else {
        // if off turn it on
        this.get('isCheckedNodes').removeObject(node);
      }
      // api hook for user to get checked nodes
      if (get(this, 'getCheckedNodes')) {
        get(this, 'getCheckedNodes')(get(this, 'isCheckedNodes'));
      }
    },

    clearCheckedNodes() {
      let checkedNodes = get(this, 'isCheckedNodes');
      checkedNodes.forEach(function(node){
        node.set('isChecked', false);
      });
      this.set('isCheckedNodes', []);
      if (get(this, 'getCheckedNodes')) {
        get(this, 'getCheckedNodes')(get(this, 'isCheckedNodes'));
      }
    },

    closeAllNodes() {
      let openNodes = get(this, 'isOpenNodes');
      openNodes.forEach(function(node){
        node.set('isOpen', false);
      })
      this.set('isOpenNodes', []);
      // send newly empty arrays to user
      if (get(this, 'getOpenNodes')) {
        get(this, 'getOpenNodes')(get(this, 'isOpenNodes'));
      }
    }
  }

});
