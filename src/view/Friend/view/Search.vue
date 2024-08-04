<script lang="ts" setup>
import { NButton, NForm, NFormItem, NInput } from 'naive-ui';
import { ref } from 'vue';
import { Ilogin, searchUserApi } from '../../../api/user/user';
import SearchFriendCard from "../component/SearchFriendCard.vue"

const formRef = ref(null);

interface IformData {
    id: string | null;
    nickname: string | null;
    account: string | null;
}

const formData = ref<IformData>({
    id: null,
    nickname: null,
    account: null
})

const searchFriendsRes = ref<Ilogin[]>([])

const searchFriend = async () => {
    if(!formData.value.id?.trim() && !formData.value.nickname?.trim() && !formData.value.account?.trim()) {
        window.$message.warning("请填写至少一个搜索信息~", { closable: true })
        return
    }
    const { code, data } = await searchUserApi({
        id: formData.value.id,
        nickname: formData.value.nickname,
        account: formData.value.account
    })

    if(code === 200 && data.rows?.length > 0) {
        searchFriendsRes.value = data.rows
        window.$message.success('查询成功！共有' + data.count + '个结果', { closable: true });
    }else{
        window.$message.warning("未找到该情况的朋友~", { closable: true })
    }
}

</script>

<template>
    <div class="search-container">
        <n-form ref="formRef" inline :label-width="80" :model="formData" size="medium">
            <n-form-item label="ta的id" path="id">
                <n-input v-model:value="formData.id" placeholder="输入ta的id" />
            </n-form-item>
            <n-form-item label="ta的昵称" path="nickname">
                <n-input v-model:value="formData.nickname" placeholder="输入ta的昵称" />
            </n-form-item>
            <n-form-item label="ta的账号" path="account">
                <n-input v-model:value="formData.account" placeholder="输入ta的账号" />
            </n-form-item>
        </n-form>
        <n-button attr-type="button" @click="searchFriend">
            Search Now!
        </n-button>
        <SearchFriendCard v-for="item in searchFriendsRes" :id="item.id" :avatar="item.avatar" :account="item.account" :nickname="item.nickname" />
    </div>
</template>

<style scoped lang="scss">
@import "src/assets/style/common.scss";
</style>