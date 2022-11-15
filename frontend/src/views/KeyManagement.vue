<template>
  <div class='key-management'>
    <form @submit='fetchPublicKeys($event)' class='add-form'>
      <div class='form-control'>
        <label for='pincode'>
          <input type='text' v-model='formData.pin' name='pincode' placeholder='pin code for encryption' default />
        </label>
      </div>
      <div class='form-control'>
        <p>generated pub keys</p>
        <p v-for='key in generatedPublicKeys' :value='key' :key='key'>{{ key }}</p>
      </div>
      <input type='submit' value='generate & encrypt' class='btn btn-block' />
    </form>
  </div>
</template>

<script>
import axios from '../config/index.ts';

export default {
  name: 'KeyManagement',
  data() {
    return {
      formData: {
        pin: 'messageemessagee',
        day: '',
        reminder: '',
      },
      generatedPublicKeys: [],
    };
  },
  methods: {
    async fetchPublicKeys(e) {
      e.preventDefault();
      let data;
      try {
        data = await axios.post(
          'http://localhost:3000/generate-keys',
          {
            pinCode: this.formData.pin,
          },
        );

        this.generatedPublicKeys = data.data.data.keys;
        localStorage.setItem('generatedPublicKeys', JSON.stringify(data.data.data.keys));
      } catch (error) {
        alert(`Request failed \n${error.response.data.message}`);
      }
      return data;
    },
  },
};
</script>
