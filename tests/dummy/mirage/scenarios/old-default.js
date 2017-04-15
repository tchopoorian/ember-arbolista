import Ember from 'ember';

export default function(server) {
  // server.create('collection', 'withChildren');
    let roots = server.createList('collection', 10);

    var maxLevels = 3;

    var childCount = function() {
      let countRa = [1,2,3];
      return countRa[Math.floor(Math.random() * countRa.length)];
    };

    function makeTree(rootList) {
      console.log('roots: ', rootList);
      rootList.forEach(function(node){
        node.children = server.createList('collection', 3, {parentId: node.id});
        makeLevel(node.children, 0);
      });
    }

    function makeLevel(list, levelCount) {
      levelCount += 1;
      console.log('level: ', levelCount);
      console.log('list type: ', typeof list);
      console.log('list: ', list);
      console.log('list length: ', list.length);
      list.models.forEach(function(node) {
        let kidCount = childCount();
        // node.children = makeChildren(kidCount, node);
        node.children = server.createList('collection', kidCount, {parentId: node.id})
        if (levelCount < maxLevels) {
          makeLevel(node.children, levelCount);
        }
      });
      return;
    }

    function makeChildren(kidCount, parent) {
      let damnKids = Ember.A([]);
      var count;
      for (count = 0; count <= kidCount; count ++) {
        let thisKid = server.create('collection', {parentId: parent.id});
        damnKids.push(thisKid);
      }
      console.log('kid count: ', kidCount);
      return damnKids;
    }

    makeTree(roots);

    return collections.all();

}
