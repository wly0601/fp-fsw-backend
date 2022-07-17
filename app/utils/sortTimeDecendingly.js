function sortTimeDecendingly(items){
  if (items.length <= 1) {
    return items;
  }

  var pivot = items[0].realTimeFormat;

  var left = []; 
  var right = [];

  for (var i = 1; i < items.length; i++) {
    items[i].realTimeFormat > pivot ? left.push(items[i]) : right.push(items[i]);
  }

  return sortTimeDecendingly(left).concat(
    items[0], 
    sortTimeDecendingly(right)
  );    
};

module.exports = sortTimeDecendingly;