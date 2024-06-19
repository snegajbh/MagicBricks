module.exports = {
    'Demo Test for Saucedemo': function (browser) {
      browser
        .url('https://www.saucedemo.com/v1/')
        .waitForElementVisible('body', 1000)
        .setValue('#user-name', 'standard_user')
        .setValue('#password', 'secret_sauce')
        .click('#login-button')
        .waitForElementVisible('.inventory_list', 5000)
        .assert.containsText('.title', 'Products')
        .end();
    }
  };
  