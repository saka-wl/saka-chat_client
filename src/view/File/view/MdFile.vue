<template>
    <div class="md-file-container">
        <div class="left-banner">
            <NormalItem word="新建你的文档" type="icon-right" v-memo="[]" @click="createNewMdFile" />
            <NormalItem word="我的文档" type="icon-left" v-memo="[]"
                @click="isMineMdFilesListShow = !isMineMdFilesListShow" />
            <div class="mine-mdFile-list" :style="{ height: isMineMdFilesListShow ? '60%' : '0' }">
                <div class="mdFile-item" v-for="item in mineMdFileList" :key="item.id" @click="handleClickMdFile(item)">
                    《{{ item.fileTitle }}》
                </div>
            </div>
            <NormalItem word="协作文档" type="icon-left" v-memo="[]" @click="isMdFilesListShow = !isMdFilesListShow" />
            <div class="mine-mdFile-list" :style="{ height: isMdFilesListShow ? '60%' : '0' }">
                <div class="mdFile-item" v-for="item in collaborateFileList" :key="item.id"
                    @click="handleClickMdFile(item)">
                    《{{ item.fileTitle }}》
                </div>
            </div>
        </div>
        <div class="right-content">
            <router-view></router-view>

        </div>

    </div>
</template>

<script setup lang="ts">
// 控制台运行：  PORT=3005 npx y-websocket
import { ref } from 'vue';
import NormalItem from "../../../component/Card/NormalItem.vue";
import { getMdFilesListApi, IMdFileInfo } from "../../../api/markdown";
import { useUserInfoStore } from "../../../store/userInfo.pinia";
import { useRouter } from 'vue-router';

const isMineMdFilesListShow = ref(false);
const isMdFilesListShow = ref(false);
const { userInfo } = useUserInfoStore();
const router = useRouter();

const mineMdFileList = ref<IMdFileInfo[]>([]);
const collaborateFileList = ref<IMdFileInfo[]>([]);

async function init() {
    mineMdFileList.value = [];
    collaborateFileList.value = [];
    const { code, data, msg } = await getMdFilesListApi({
        userId: userInfo?.id!.toString()!
    });
    if (code !== 200) {
        window.$message.warning(msg || '获取数据失败！');
        return;
    }
    for (const item of data) {
        if (item.ownUserId == userInfo?.id) {
            mineMdFileList.value?.push(item);
        } else {
            collaborateFileList.value?.push(item);
        }
    }
}
init();

const createNewMdFile = () => {
    router.push({
        name: 'md-file-add'
    })
}

const handleClickMdFile = (item: IMdFileInfo) => {
    if (!item.id) return;
    router.push({
        name: 'md-file-add'
    })
    setTimeout(() => {
        router.push({
            name: 'md-file-edit',
            query: {
                id: item.id
            },
            params: {
                id: item.id
            }
        })
    }, 500)
}

</script>

<style scoped lang="scss">
@import "src/assets/style/common.scss";

.md-file-container {
    display: flex;
    height: 100%;

    .left-banner {
        flex: 0 0 px2vw(250);
        height: 100%;

        // background-color: rgb(32, 67, 97);
        .mine-mdFile-list {
            background-color: rgb(228, 255, 255);
            transition: all .1s;
            overflow-y: scroll;
        }

        .mdFile-item {
            height: 30px;
            background-color: rgb(228, 255, 255);
            display: flex;
            align-items: center;
            padding: 5px;
            border-bottom: 1px solid rgb(236, 237, 237);
        }
    }

    .right-content {
        flex: 1 1;
        height: 100%;
        margin: 10px;
    }
}
</style>