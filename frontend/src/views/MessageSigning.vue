<template>
  <div class='message-signing'>
    <form @submit='fetchSignature($event)' class='add-form'>
      <div class='form-control'>
        <label for='message'>
          <input type='text' v-model='formData.message' name='message' placeholder='input message to be signed'
            default />
        </label>
      </div>
      <div class='form-control'>
        <label for='public-key'>
          <select @change="changePublicKey($event)" name='public-key'>
            <option value="" selected disabled>Select a public key</option>
            <option v-for="publicKey in formData.publicKeys" :value="publicKey" :key="publicKey">{{ publicKey }}</option>
          </select>
        </label>
      </div>
      <div class='form-control'>
        <label for='pincode'>
          <input type='text' v-model='formData.pinCode' name='pincode' placeholder='pin code for encryption' default />
        </label>
      </div>
      <div class='form-control'>
        <p>{{ formData.signature }}</p>
      </div>
      <input type='submit' value='sign' class='btn btn-block' />
    </form>
  </div>
</template>

<script>
import axios from '../config/index.ts';

export default {
  name: 'MessageSigning',
  data() {
    return {
      formData: {
        message: 'asdfghjk',
        publicKeys: [],
        pinCode: 'm',
        selectedPublicKey: '',
        signature: '',
      },
    };
  },
  async created() {
    const publicKeys = JSON.parse(localStorage.getItem('generatedPublicKeys') || '[]');
    if (publicKeys.length > 0) {
      this.formData.publicKeys = publicKeys;
    } else {
      alert('No available public keys');
    }
  },
  methods: {
    changePublicKey(e) {
      if (e.target.value && e.target.value.length > 10) this.formData.selectedPublicKey = e.target.value;
    },
    async fetchSignature(e) {
      e.preventDefault();
      let data;
      try {
        data = await axios.post(
          'http://localhost:3000/sign-message',
          {
            message: this.formData.message,
            publicKey: this.formData.selectedPublicKey,
            pinCode: this.formData.pinCode,
          },
        );

        console.log(data.data.data);
        this.formData.signature = data.data.data.signature;
        return this.signature;
      } catch (error) {
        alert(`Request failed \n${error.response.data.message}`);
      }
      return data;
    },
  },
};
</script>
