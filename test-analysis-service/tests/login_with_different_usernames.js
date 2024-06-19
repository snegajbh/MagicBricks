module.exports = {
    'Login with standard user': function (browser) {
      browser
        .url('https://www.saucedemo.com/v1/')
        .waitForElementVisible('body', 1000)
        .setValue('#user-name', 'standard_user')
        .setValue('#password', 'secret_sauce')
        .click('#login-button')
        .waitForElementVisible('.inventory_list', 5000)
        .assert.containsText('.title', 'Products')
        .end();
    },
  
    'Login with locked out user': function (browser) {
      browser
        .url('https://www.saucedemo.com/v1/')
        .waitForElementVisible('body', 1000)
        .setValue('#user-name', 'locked_out_user')
        .setValue('#password', 'secret_sauce')
        .click('#login-button')
        .waitForElementVisible('.error-message-container', 5000)
        .assert.containsText('.error-message-container', 'Epic sadface: Sorry, this user has been locked out.')
        .end();
    },

  };
  