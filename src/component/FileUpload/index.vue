
<script setup lang="ts">

const handleUploadFile = async (e: Event) => {
    console.log(e);
}
</script>

<template>
    <div class="file-upload-container">
        <input type="file" @change="handleUploadFile">
    </div>
</template>

<style scoped lang="scss">

</style>