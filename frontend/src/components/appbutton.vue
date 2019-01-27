<template>
    <div id ="buttons">
        <button class="main-buts"><svg xmlns="http://www.w3.org/2000/svg" width="20vh" height="20vh" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg></button>
        <button class="main-buts"><svg xmlns="http://www.w3.org/2000/svg" width="20vh" height="20vh" viewBox="0 0 24 24"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z"/><path fill="none" d="M0 0h24v24H0z"/></svg></button>
    </div>
</template>

<script>
export default {
    name : 'appbutton',
}
</script>

<style>
    #buttons .main-buts{
        width: 22vh;
        height: 22vh;
        border-radius:100%;
        display: inline-block;
        margin: 0 20px 0;
        border-radius: 15px;
    }
</style>

