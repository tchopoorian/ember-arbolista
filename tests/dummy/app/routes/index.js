import Ember from 'ember';
import { faker } from 'ember-cli-mirage';

export default Ember.Route.extend({

  model() {
    console.log('model hook');
    return this.get('store').findAll('collection');

    // attempt at creating my own response
    // var store = this.get('store');
    // var count;
    //
    // for (count = 10; count < 10; count ++) {
    //   store.createRecord('collection', {
    //     name: `root-${count}`,
    //     parentId: null,
    //     children: []
    //   });
    // }
    //
    // let roots = store.peekAll('collection');
    // console.log('roots: ', roots);
    //
    // var maxLevels = 5;
    //
    // var childCount = function() {
    //   let countRa = [0,1,2,3,4];
    //   return countRa[Math.floor(Math.random() * countRa.length)];
    // };
    //
    // function makeTree(rootList) {
    //   rootList.forEach(function(node){
    //     node.children = makeChildren(3, node);
    //     makeLevel(node.children, 0);
    //   });
    // }
    //
    // function makeLevel(list, levelCount) {
    //   levelCount += 1;
    //   console.log('list: ', list);
    //   console.log('typeof: ', typeof list);
    //   console.log('levelCount: ', levelCount);
    //   Ember.forEach(function(node) {
    //     let kidCount = childCount();
    //     node.children = makeChildren(kidCount, node);
    //     if (levelCount < maxLevels) {
    //       makeLevel(node.children, levelCount);
    //     }
    //     console.log('this node: ', node);
    //   });
    //   return;
    // }
    //
    // function makeChildren(kidCount, parent) {
    //   let damnKids = Ember.A([]);
    //   for (let count = kidCount; count > 0; count -= 1) {
    //     let thisKid = store.createRecord('collection', {
    //       name: faker.name.findName(),
    //       parentId: parent.id
    //     })
    //     damnKids.push(thisKid);
    //   }
    //   return damnKids;
    // }
    //
    // return makeTree(roots);
  }

});
