<template>
    <div>
        <div style="width:100px;height:100px" v-if="imgid !==''">
            <img :src="imgUrl + imgid " alt="" style="width:100%">
        </div>
        <upload-img 
            :num=1 
            :aspectRatio=1
            :minCropBoxWidth=100
            :is-crop="true"
            v-on:uploadChange ="uploadChangeEvent" 
            v-on:uploadName ="uploadNameEvent"
            >
            <div slot="content" style=" width: 100px;height: 100px; border: 1px dashed #ccc;display:flex;justify-content:center;align-items:center">
                <Icon type="camera" style="font-size:18px;"></Icon>
            </div>
        </upload-img>
    </div>
</template>
<script>
/**
 * num : 图片上传张数
 * aspectRatio ： 图片宽高比
 * minCropBoxWidth ： 图片最小宽度
 * isCrop ： 是否需要裁剪
 */
import uploadImg from 'components/uploadImg/uploadImg.vue'
export default {
    data(){
        return{
            imgUrl:constGlobal.HostSource,
            imgid:'',
            imgName:''
        }
    },
    components:{uploadImg},
    mounted(){},
    methods:{
        //获取图片
        uploadChangeEvent(imgobj){
           this.imgid = imgobj[0];
        },
        //获取图片名称
        uploadNameEvent(imgName){
            this.imgName = imgName[0]
        }
    }
}
</script>

