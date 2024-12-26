import { onMounted, onUnmounted, Ref, ref } from "vue";
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
// 粘贴图片上传
import { ImageExtend } from 'quill-image-paste-module'
import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-module'
import { normalImageUrl, yMdFileSocketUrl } from "../../../constant/request";
// 协同编辑算法库
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'

export interface IMdFileInfoEdit {
    id: string | null;
    collaborateUserIds: string[] | null;
    ownUserId: string | null;
    fileTitle: string | null;
}

export const useMdFile = () => {
    let quill: any = null;
    let wsProvider: any = null;
    let binding: any = null;
    let ytext: any = null;
    let ydoc: any = null;
    const mdEditorRef = ref<HTMLElement | null>();
    const imageUploadRef = ref<HTMLElement | null>();

    onMounted(() => {
        if(!quill) initMdFile();
        connectSocket(null);
        // 当工具栏中的图片图标被单击的时候
        quill.getModule('toolbar').addHandler('image', (state: boolean) => {
            if (state) {
                document.querySelector('#md-image-upload input')?.click();
            }
        });
    })

    onUnmounted(() => {
        quill = null;
        mdEditorRef.value = null;
        imageUploadRef.value = null;
        destorySocket();
    })

    Quill.register('modules/cursors', QuillCursors)
    Quill.register('modules/imageDrop', ImageDrop)
    // Quill.register('modules/imageResize', ImageResize)
    Quill.register('modules/ImageExtend', ImageExtend)
    const initMdFile = () => {
        quill = new Quill(mdEditorRef.value as HTMLElement, {
            modules: {
                cursors: true,
                toolbar: [
                    { header: [1, 2, 3, 4, false] },
                    'bold',
                    'italic',
                    'underline',
                    'color',
                    'code',
                    'underline',
                    'code-block',
                    'image',
                    'strike',           // 删除线
                    { list: 'bullet' }, // 无序列表
                    { list: 'ordered' }, // 有序列表
                ],
                // 拖拽上传和调整图片大小
                imageDrop: true,
                // imageResize: {
                //     displayStyles: {
                //         backgroundColor: 'black',
                //         border: 'none',
                //         color: 'white'
                //     },
                //     modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                // },
                history: {
                    userOnly: true,
                },
                ImageExtend: {
                    loading: true, // 可选参数 是否显示上传进度和提示语
                    name: 'file', // 图片参数名
                    size: 1,
                    action: normalImageUrl, // 服务器地址, 如果action为空，则采用base64插入图片
                    response: ({ data }: { data: string }) => {
                        return normalImageUrl + data;
                    },
                },
            },
            placeholder: '',
            theme: 'snow',
        })

        // Yjs文档，保存共享数据shared data
        ydoc = new Y.Doc()
        // 在文档上定义共享文本类型
        ytext = ydoc.getText('quill-demo')
        quill.on('text-change', (delta, oldDelta, source) => {
            // console.log(source);
            // console.log(delta);
            // console.log(oldDelta);
            // console.log('-----');
        });
    }

    const handleImageUploadFinish = ({ file, event }: { file: File, event: any }) => {
        let resp = JSON.parse((event?.target as XMLHttpRequest).response);
        imageUploadRef.value?.clear();
        let length = quill.getSelection() ? quill.getSelection().index : 0;
        quill.insertEmbed(length, 'image', normalImageUrl + resp.data);
        // 调整光标到最后
        quill.setSelection(length + 1);
    }

    const destorySocket = () => {
        if (wsProvider) wsProvider.destroy();
        if (binding) binding.destroy();
    }

    const connectSocket = (id: string | null) => {
        if (!id) return;
        const roomName = 'md_' + id
        // 连接到 websocket 服务端 yjs提供的体验服务器
        wsProvider = new WebsocketProvider(yMdFileSocketUrl, roomName, ydoc);
        // 绑定
        binding = new QuillBinding(ytext, quill, wsProvider.awareness);
    }

    const getQuillValue = () => {
        return quill;
    }

    const getBinding = () => {
        return binding;
    }

    const setQuillValue = (val: Object) => {
        quill.setContents(val);
    }

    return {
        quill,
        mdEditorRef,
        imageUploadRef,
        initMdFile,
        handleImageUploadFinish,
        getQuillValue,
        setQuillValue,
        connectSocket,
        destorySocket,
        getBinding,
    }
}