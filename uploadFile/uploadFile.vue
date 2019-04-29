
<template>
    <div class="image-editor" style="line-height: initial;">
        <div class="imgDiv">
            <input 
                type="file" 
                ref="avatarInput" 
                @change="fileChange($event)" 
                :id="'fileinput1'+cageID" 
                class="fileinput" />
            <label class="fileImgLabel" :for="'fileinput1' + cageID">
                <slot name="content"><Icon type="camera" size="20"></Icon></slot>
            </label>
        </div>
    </div>
</template>

<script>
import Cropper from 'cropperjs';
import './cropper.min.css';
export default {
    name: 'image-editor',
    data () {
        return {
            title : '',
            fileInfo:[],
            fileName:'',
            imgUrl:constGlobal.HostSource,
            file:{},                //存储上传文件信息
            imgInfo:{               //图片信息
                fileName:'',
                fileSiza:''
            },
            cageID: this.generateGUID(),     //用于组件中id动态变量
        };
    },
    props:{
        uploadKey : {
            type : String,
            default : ''
        },
        accept : {
            type : Array,
            default : ()=>[]
        },
        uploadUrl : {
            type : String,
            default : constGlobal.HostDefaultImgUpload
        },
        size : {
            type : Number,
            default : 5242880
        }
    },
    methods: {
        //组件通信
        uploadChange(){
            this.imgName = '';
            this.$emit( 'uploadChange' , this.fileInfo);
        },
        fileChange(el) {
            this.imgIds = [];
            var _this = this;
            if (!el.target.files[0].size) return;
            this.file = el.target.files[0];
            this.fileName = _this.file.name;
            //验证文件格式
            var fileNameList = this.fileName.split('.');
            var flag = false;
            for(var i = 0 ; i < this.accept.length ; i++){
                if(this.accept[i] == fileNameList[fileNameList.length - 1]){
                    flag = true;
                }
            }
            if(!flag){
                common.toastMsg("文件格式错误，请重新选择文件上传");
                return;
            }
            if(el.target.files[0].size >= this.size){
                common.toastMsg("上传文件大于"+ this.size/1024/1024 +"M，请重新选择文件");
                return;
            }
            var file = new FormData()
            file.append('avatar', this.$refs.avatarInput.files[0])
            var url = this.uploadUrl;

            this.$emit('startUpload', this.fileInfo);
            
            http.apiPost(url, file, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then( res =>{
                if( res.status == 0 ){
                    this.fileInfo.push({
                        info : res.data , 
                        fileName : _this.fileName,
                    });
                    this.uploadChange()
                }else{
                    common.toastMsg( res.message );
                }               
            });
            el.target.value = "";
        },
        //移除
        handleRemove(index){
            this.imgIds.splice(index,1);
        },
        //生成GUID
        generateGUID() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var guid = s.join("");
            return guid;
        },
    },
    
};
</script>
<style lang="scss">
    .imgDiv{
        border-radius: 3px;
        text-align: center;
        .fileinput{
            position:absolute;
            top:0px;
            left : 0px;
            right : 0px;
            bottom : 0px;
            width : 100%;
            height: 100%;
            opacity : 0;
        }
    }
    .cropper-crop-box{
        
    }
</style>

