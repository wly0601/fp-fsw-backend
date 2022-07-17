function priceFormat(data) {
  const priceStr = data.toString();
  var i = priceStr.length;
  var renderPrice = '';
  var counter = 0;

  while (i > 0) {
    renderPrice = priceStr[i - 1] + renderPrice;
    i--;
    counter++;
    if (counter == 3 && i !== 0) {
      renderPrice = '.' + renderPrice;
      counter = 0;
    }
  }

  return `Rp ${renderPrice}`;
}

module.exports = priceFormat;