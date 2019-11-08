<template>
  <div>
    <!-- <div class="card text-center m-3">Hello Dropin Homepage</div> -->
    <!-- <div class="card">
      <a class="card" href="https://lkog6-8081.sse.codesandbox.io">Dropin Page Components</a>
      <a class="card" href="https://lkog6-8081.sse.codesandbox.io/api/payments">API - api/payments</a>
      <a
        class="card"
        href="https://lkog6-8081.sse.codesandbox.io/api/paymentMethods"
      >API - api/paymentMethods</a>
    </div>-->
    <div class="card">
      <input v-model="amount">
      <input v-model="currency">
    </div>
    <div id="dropin"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    amount: 0,
    currency: "EUR"
  }),
  mounted: function() {
    const userData = {
      amount: {
        amount: this.amount,
        currency: this.currency
      }
    };
    axios({
      method: "get",
      url: "/api/paymentMethods",
      data: userData
    }).then(function({ data }) {
      console.log(data.originKey);
      const configuration = {
        locale: "en-US",
        environment: "test",
        originKey: data.originKey,
        paymentMethodsResponse: data
      };
      const checkout = new AdyenCheckout(configuration);

      const dropin = checkout
        .create("dropin", {
          paymentMethodsConfiguration: {
            card: {
              hasHolderName: true,
              holderNameRequired: true,
              enableStoreDetails: true,
              name: "Credit or debit card"
            }
          },
          onSubmit: (state, dropin) => {
            console.log(state.data, this.amount, this.currency);

            console.log("Amount and Currency:");
            axios({
              method: "post",
              url: "/api/payments",
              data: state.data
            })
              .then(({ data }) => {
                console.log({ data });
                dropin.handleAction(data.action);
              })
              .catch(error => {
                throw Error(error);
              });
          },
          onAdditionalDetails: (state, dropin) => {
            makeDetailsCall(state.data)
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
        .mount("#dropin");
    });
    // `this` points to the vm instance
  }
};
</script>

