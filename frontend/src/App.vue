<template>
  <nav>
    <router-link to="/">key management</router-link> /
    <router-link to="/message-signing">message signing</router-link> /
    <router-link to="/key-recovery">key recovery</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #000000;
  background-color: #a273b6;
}

nav {
  padding: 30px;
  font-size: larger;
}

nav a {
  font-weight: bold;
  color: #0000006c;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #000000;
  text-decoration: underline;
}

form{
  padding: 50px 10%;
  display: flex;
  justify-content: space-around;
}
form input, form select {
  width: 100% !important;
  height: 54px !important;
  margin-top: 10px;
  box-sizing: border-box;
}
form input:focus, form select:focus {
  outline: none;
}
form input {
  font-size: xx-large;
}
form select {
  font-size: larger;
}

.input-fields{
  flex: 3;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}
input[type='submit']{
  flex: 1;
  align-self: flex-end;
  cursor: pointer;
}

.result {
  background-color: #1ed1e9;
  width: 100%;
  margin-top: 10px;
  font-size: larger;
  word-break: break-all;
}
.result p {
  text-align: left;
  margin-left: 5px;
  color:rgb(104, 104, 28);
  box-sizing: border-box;

}
</style>
