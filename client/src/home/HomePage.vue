<template>
  <div>
    <div class="card text-center m-3">Hello Dropin Homepage</div>
    <div id="dropin"></div>
  </div>  
</template>

<script>
import axios from 'axios';

export default {
   mounted: function () {
     axios({
        method: 'get',
        url: '/api/paymentMethods'
      })
      .then(function ({ data }) {
        const configuration = {
          locale: "en-US",
          environment: "test",
          originKey: "pub.v2.8115607642724866.aHR0cHM6Ly9sa29nNi04MDgxLnNzZS5jb2Rlc2FuZGJveC5pbw.a9zWMXsvzRlLO7nkb5U4VfrnQ9fVYFBP8lgvI7FNNIg",
          paymentMethodsResponse: data
        };
      const checkout = new AdyenCheckout(configuration);

      const dropin = checkout
      .create('dropin', {
          paymentMethodsConfiguration: {
          card: { // Example optional configuration for Cards
              hasHolderName: true,
              holderNameRequired: true,
              enableStoreDetails: true,
              name: 'Credit or debit card'
          }
        },
        onSubmit: (state, dropin) => {
          makePayment(state.data)
          // Your function calling your server to make the /payments request
          .then(action => {
              dropin.handleAction(action);
            // Drop-in handles the action object from the /payments response
              })
          .catch(error => {
            throw Error(error);
          });
        },
        onAdditionalDetails: (state, dropin) => {
            makeDetailsCall(state.data)
        // Your function calling your server to make a /payments/details request
            .then(action => {
              dropin.handleAction(action);
      // Drop-in handles the action object from the /payments/details response
              })
        .catch(error => {
            throw Error(error);
            });
        },
        // Required for Apple Pay. Event called when the payment sheet is displayed.
        // For more information, see Apple Pay documentation https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession/1778021-onvalidatemerchant
        onValidateMerchant: (resolve, reject, validationURL) => {
        // Call the validation endpoint with validationURL.
        // Call resolve(MERCHANTSESSION) or reject() to complete merchant validation.
        }
      })
      .mount('#dropin');
    });
    // `this` points to the vm instance
  }
};
</script>

