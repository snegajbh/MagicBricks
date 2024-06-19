module.exports = {
    'Sort products by price (low to high)': function (browser) {
      browser
        .url('https://www.saucedemo.com/v1/')
        .waitForElementVisible('body', 1000)
        .setValue('#user-name', 'standard_user')
        .setValue('#password', 'secret_sauce')
        .click('#login-button')
        .waitForElementVisible('.inventory_list', 5000)
        .click('select.product_sort_container option[value="price_asc"]')
        .pause(1000) // Adjust as necessary
        .getText('.inventory_item_price', function (result) {
          // Verify that products are sorted correctly
          let prices = result.value.map(price => parseFloat(price.replace('$', '')));
          for (let i = 1; i < prices.length; i++) {
            this.assert.ok(prices[i - 1] <= prices[i], 'Products are sorted by price (low to high)');
          }
        })
        .end();
    },
  
    'Filter products by category': function (browser) {
      browser
        .url('https://www.saucedemo.com/v1/')
        .waitForElementVisible('body', 1000)
        .setValue('#user-name', 'standard_user')
        .setValue('#password', 'secret_sauce')
        .click('#login-button')
        .waitForElementVisible('.inventory_list', 5000)
        .click('select.product_sort_container option[value="az"]') // Reset sorting to default
        .pause(1000) // Adjust as necessary
        .click('input[type="checkbox"][value="sauce"]')
        .pause(1000) // Adjust as necessary
        .elements('css selector', '.inventory_item', function (result) {
          // Verify that all displayed products are in the selected category
          this.assert.strictEqual(result.value.length, 2, 'Filtered products match selected category');
        })
        .end();
    },
  };
  