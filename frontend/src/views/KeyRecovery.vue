<template>
  <div class='key-recovery'>
    <form @submit='recoverPublicKey($event)' class='add-form'>
      <div class='input-fields'>
        <div class='form-control'>
          <label for='message'>
            <input type='text' v-model='formData.message' name='message' placeholder='input message' default />
          </label>
        </div>
        <div class='form-control'>
          <label for='signature'>
            <input type='text' v-model='formData.signature' name='signature' placeholder='input signature' default />
          </label>
        </div>
        <div class='form-control result'>
          <p>{{formData.recoveredPublicKey}}</p>
        </div>
      </div>
      <input type='submit' value='recover' class='btn btn-block' />
    </form>
  </div>
</template>

<script>
import axios from '../config/index.ts';

export default {
  name: 'KeyRecovery',
  data() {
    return {
      formData: {
        message: 'asdfghjk',
        signature: '',
        recoveredPublicKey: 'recovered public key',
      },
    };
  },
  methods: {
    async recoverPublicKey(e) {
      e.preventDefault();
      let data;
      try {
        data = await axios.post(
          'http://localhost:3000/recover-publickey',
          {
            message: this.formData.message,
            signature: this.formData.signature,
          },
        );

        this.formData.recoveredPublicKey = data.data.data.publicKey;
      } catch (error) {
        alert(`Request failed \n${error.response.data.message}`);
      }
    },
  },
};
</script>
