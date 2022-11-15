<template>
  <div class="Message Signing">
    <h1>This is an about page</h1>
    <HelloWorld />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'MessageSigning',
  components: {
    HelloWorld,
  },
};
</script>
