<template>
    <div class="result" >
        <div class="userWrap vux-1px-b">
            <!-- 人员列表 -->
            <div class="userWrapBlock" v-if="withUser == 1">
                <scroller lock-y :scrollbar-x=false>
                    <div :style="{width : 55 * userList.length + 'px'}">
                        <div 
                            class="block"
                            v-for="(item , index) in userList" 
                            :key="index"
                            style="width:55px;!important"
                            @click="deleteMem(item , index)">
                            <div class="flex flex-direction-column flex-align-items">
                                <!-- <img src="~selector/assets/img/headmr.png" class="headImg" v-if="item.headImgUrl == null || item.headImgUrl == ''"> 
                                <img :src="HostSource + item.headImgUrl" class="headImg" v-if="!(item.headImgUrl == null || item.headImgUrl == '')"> -->
                                <div class="headerWrap flex flex-align-items flex-justify-content">{{getShortName(item.name)}}</div>
                                <span class="name textLineClamb1" style="font-size:12px; color:#333;">{{item.name}}</span>
                            </div>
                        </div>
                    </div>
                </scroller>
                <div class="flex flex-align-items flex-justify-content" v-show="userList.length == 0" style="height:50px;color:#eaeaea;font-size:12px;width:100%;">请选择人员</div>
            </div>
            <!-- 部门列表 -->
            <div class="userWrapBlock flex" v-if="withUser == 2">
                <scroller lock-y :scrollbar-x=false>
                    <div :style="{width : 55 * deptList.length + 'px'}">
                        <div 
                            class="block"
                            v-for="(item , index) in deptList" 
                            :key="index"
                            style="width:55px;!important"
                            @click="deleteDept(item , index)">
                            <div class="flex flex-direction-column flex-align-items">
                                <span class="resultDeptIcon">
                                    <i class="fa fa-folder-open"></i>
                                </span>
                                <span class="name textLineClamb1" style="font-size:12px; color:#333;">{{item.name}}</span>
                            </div>
                        </div> 
                    </div>
                </scroller>
                <div class="flex flex-align-items flex-justify-content" v-show="deptList.length == 0" style="height:50px;color:#eaeaea;font-size:12px;width:100%;">请选择部门</div>
            </div>
        </div>
        <div class="flex operaBtns">
            <div class="upLevel" @click="upLevel()" v-show="show">上一级</div>
            <div class="confirmBtn flex-1" @click="saveUserList()">
                确定 <span v-if="userList.length > 0">({{userList.length}})</span>
            </div>
        </div>
    </div>
</template>

<script>
import { Scroller} from 'vux'
import bus from 'selector/assets/js/bus.js'
export default {
    name: 'app',
     data(){
        return {
            sourceUrl : constGlobal.HostSource,
            width : document.body.clientWidth,
            swiperOption: {
                slidesPerView: 6,
                spaceBetween: 15,
                freeMode: true,
            },
            userList : [],
            deptList : [],
            withUser : '',
            show : false,
            HostSource : constGlobal.HostSource
        }
    },
    components: {
        Scroller
    },
    mounted:function () {
        this.swiperOption.slidesPerView = this.width % 35;

        bus.$on('operaStaff', function(param) {
            this.updateStaffList(param)
        }.bind(this))

        bus.$on('operaStaffDepart', function(param) {
            this.updateStaffDepartList(param)
        }.bind(this)) 

        this.init();
    },
    methods:{
        /**
         * 初始化
        */
        init(){
            var _this = this;
            this.query = this.$route.query;
            this.withUser = this.query.withUser;
            this.muliteChoice = this.query.muliteChoice;
            this.userList = this.query.userList ? this.query.userList : [];
            this.initSelectList();
        },
        /**
         * 初始化已选人员
        */
        initSelectList(){
            var userList = common.sessionGet("selectionStaffUserListEdit");
            if(userList){
                this.userList = userList;
            }
        },
        /**
         * 点击人员，删除人员
        */
        deleteMem(item , index){
            this.userList.splice( index , 1);
            common.sessionSet("selectionStaffUserListEdit" , this.userList);
            bus.$emit('changeSelectInfo' , item) 
        },
        /**
         * 更新人员列表
        */
        updateStaffList(param){
            if(this.muliteChoice == 1 || !param.type){
                for(var i = 0 ; i < param.userList.length ; i++){
                    for(var j = 0 ; j < this.userList.length ; j++){
                        if(param.userList[i].id == this.userList[j].id){
                            this.userList.splice(j , 1);
                            j--;
                        }
                    }
                }
            }else{
                this.userList = [];
            }
            if(param.type){
                for(var i = 0 ; i < param.userList.length ; i++){
                    this.userList.push(param.userList[i]);
                }
            }
            common.sessionSet("selectionStaffUserListEdit" , this.userList);
        },
        /**
         * 保存人员列表
        */
        saveUserList(){
            common.sessionSet("selectionStaffFlag" , 1);
            common.sessionSet("withUser" , this.withUser);
            if(this.withUser == 1){ 
                var userListEdit = common.sessionGet("selectionStaffUserListEdit");
                common.sessionSet("selectionStaffUserList" , userListEdit);
                sessionStorage.removeItem("selectionStaffUserListEdit");
                this.$router.back(-1);
            }else{
                var deptListEdit = common.sessionGet("selectionStaffDeptListEdit");
                common.sessionSet("selectionStaffDeptList" , deptListEdit);
                sessionStorage.removeItem("selectionStaffUserListEdit");
                this.$router.back(-1);
            }
        },
        /**
         * 更新选择部门信息
        */
        updateStaffDepartList(param){
            if(this.muliteChoice == 1 || !param.type){
                for(var i = 0 ; i < param.deptList.length ; i++){
                    for(var j = 0 ; j < this.deptList.length ; j++){
                        if(param.deptList[i].id == this.deptList[j].id){
                            this.deptList.splice(j , 1);
                            j--;
                        }
                    }
                }
            }else{
                this.deptList = [];
            }
            if(param.type){
                for(var i = 0 ; i < param.deptList.length ; i++){
                    this.deptList.push(param.deptList[i]);
                }
            }
            common.sessionSet("selectionStaffDeptListEdit" , this.deptList);
        },
        /**
         * 点击人员，删除人员
        */
        deleteDept(item , index){
            this.deptList.splice( index , 1);
            common.sessionSet("selectionStaffDeptListEdit" , this.deptList);
            bus.$emit('changeDeptSelectInfo' , item) 
        },
        /**
         * 返回上一级
        */
        upLevel(){
            this.$parent.changeLevel('delete');
        },
        /**
         * 显示与隐藏返回上一级
        */
        changeLevel(length){
            this.show = length > 1 ? true : false;
        },
         getShortName(name){
            return name.slice(name.length - 2 , name.length)
        },
    },
}
</script>
