module.exports = {
    'Add products to cart and proceed to checkout': function (browser) {
      browser
        .url('https://www.saucedemo.com/v1/')
        .waitForElementVisible('body', 1000)
        .setValue('#user-name', 'standard_user')
        .setValue('#password', 'secret_sauce')
        .click('#login-button')
        .waitForElementVisible('.inventory_list', 5000)
        .click('button.btn_primary.btn_inventory')
        .pause(1000) // Adjust as necessary
        .click('button.shopping_cart_link')
        .pause(1000) // Adjust as necessary
        .click('button.btn_action.checkout_button')
        .waitForElementVisible('.checkout_info', 5000)
        .assert.containsText('.summary_info .summary_total_label', 'Total')
        .end();
    },
  };
  