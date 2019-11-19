<template>
  <div>
    <!-- <div class="card text-center m-3">Hello Dropin Homepage</div> -->
    <div class="card">
      <a href="/users">User management</a>
    </div>
    <div class="card">
      <input v-model="amount.currency">
      <input v-model="amount.value">
    </div>
    <div id="dropin"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    configuration: {},
    amount: {
      currency: "EUR",
      value: 10
    }
  }),
  created() {
    this.initConfiguration();
  },
  mounted() {
    // `this` points to the vm instance
  },
  methods: {
    initConfiguration() {
      const myVM = this;
      axios({
        method: "post",
        url: "/api/paymentMethods"
      }).then(function({ data }) {
        myVM.configuration = {
          locale: "en-US",
          environment: "test",
          originKey: data.originKey,
          paymentMethodsResponse: data
        };
        myVM.loadCheckoutConfig();
      });
    },

    loadCheckoutConfig(config) {
      const checkout = new AdyenCheckout(this.configuration);

      const userData = {
        amount: {
          amount: 0,
          currency: "EUR"
        }
      };

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
            this.makePayment(state, dropin);
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
    },
    makePayment(state, dropin) {
      const myVM = this;
      axios({
        method: "post",
        url: "/api/payments",
        data: { ...state.data, amount: myVM.amount }
      })
        .then(({ data }) => {
          dropin.handleAction(data.action);
        })
        .catch(error => {
          throw Error(error);
        });
    }
  }
};
</script>