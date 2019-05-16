<template>
    <div class="selectionStaffList flex flex-direction-column">  
        <div class="flex-1 overflowYScroll selectionStaffContainer">
            <div class="list-wrap ">
                <div class="vux-1px-t"></div>
                <div
                    class="list"
                    v-for="(item , index) in memberList" :key="index">
                    <div class="scan-empower-list flex">
                        <div class="select-left flex flex-align-items" 
                            @click="changeSelect(index)" 
                            v-if="muliteChoice != 2">
                            <i class="weui-icon weui_icon_circle weui-icon-circle" :class="{ 'weui_icon_success weui-icon-success' : item.selected , ' weui_icon_circle weui-icon-circle' : !item.selected}" style="" ></i>
                        </div>
                        <div class="flex flex-1 flex-align-items">
                            <div class="left flex flex-align-items">
                                <!-- <img src="~selector/assets/img/headmr.png" class="icon" > -->
                                <img src="~selector/assets/img/headmr.png" class="icon" v-if="item.headImgUrl == null || item.headImgUrl == ''">
                                <img :src="HostSource + item.headImgUrl" class="icon" v-if="!(item.headImgUrl == null || item.headImgUrl == '')">
                            </div> 
                            <div class="name flex-1 textLineClamb1">{{item.userName}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bus from 'selector/assets/js/bus.js'
import { XHeader , Group , Cell ,InlineLoading } from 'vux'
import noDataTip from 'selector/components/NoDataTip/NoDataTip.vue'
export default {
    name: 'app',
     data(){
        return {
            memberList : [],
            muliteChoice : '',
            withUser : '',
            HostSource : constGlobal.HostSource
        }
    },
    components: {
        Cell,
        Group,
        XHeader,
        noDataTip,
        InlineLoading,
    },
    mounted:function () {
        this.selectionStaffCondition = common.sessionGet("selectionStaff");
        this.withUser = this.selectionStaffCondition.withUser;
        this.muliteChoice = this.selectionStaffCondition.muliteChoice;

        this.params = this.$route.params;
        window.eventHub.$emit("changeTitle", this.params.title);
        this.queryGroupInfo();
    },
    methods:{
       /**
         * 获取群组信息
        */
        queryGroupInfo(){
            var url = constGlobal.HostStaffOrg + 'groupInfoAndUserList/search?groupId=' + this.params.id;
            http.apiGet(url).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.memberList = res.data.memberList;
                        for(var i = 0 ; i < this.memberList.length ; i++){
                            this.memberList[i].selected = false;
                        }
                        this.judgeSelect();
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 判断人员是否被选择
        */
        judgeSelect(){
            var list = common.sessionGet("selectionStaffUserListEdit");
            if(!list){
                list = this.$parent.$refs.resultRef.userList;
            }
            for(var i = 0 ; i < this.memberList.length ; i++){
                var flag = false;
                for(var j = 0 ; j < list.length ; j++){
                    if(this.memberList[i].userId == list[j].id){
                        flag = true;
                        break;
                    }
                }
                if(j < list.length && flag){
                    this.memberList[i].selected = true;
                }
            }
        },
        /**
         * 修改选择状态 
        */
        changeSelect(index){
            this.memberList[index].selected = !this.memberList[index].selected;
            this.memberList.push();
            var memberList = [];
            var param = {
                name : this.memberList[index].userName,
                id : this.memberList[index].userId
            }
            memberList.push(param);
            var param = {
                userList : memberList,
                type : this.memberList[index].selected
            }
            bus.$emit('operaStaff' , param) 
        }
    },
}
</script>
<style lang="scss">
    @import "~selector/assets/css/selection.scss";
</style>


