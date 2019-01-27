<template>
  <div id="app">
    <appname/>
    <gallery/>
    <appbutton/>
  </div>
</template>

<script>
import appname from './components/appname'
import gallery from './components/gallery'
import appbutton from './components/appbutton'

export default {
  name: 'App',
  components: {
    appname,
    gallery,
    appbutton,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
