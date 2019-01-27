<template>
  <div class="app-name">
    <h1 class="name-font">{{ dappname }}</h1>
    <input type = "text"  v-model = "address" placeholder = "type in your address"> 
  </div>
</template>
<script>
export default {
  name: 'appname',
  data () {
    return {
      dappname :'Unknown Dapp Project'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
input {
  width: 45vw;
  height: 5.2vh;
  border-color: black;
  border-radius: 2vh;
  font-size: 3.8vh;
}

.name-font {
  margin: 0.5vh 0.5vh 0.5vh;
  font-size :7vh;
}

</style>
