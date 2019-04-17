<template>
    <div class="contentOrgWrap flex flex-direction-column" :style="{height : height}">
        <div class="flex orgSelectorNavbar" v-show="levelList.length > 1">
            <div v-for="(list , i) in levelList" :key="i" class="orgNav flex flex-align-items" v-show="levelList.length > 1" :class="{ 'active' : i == ( levelList.length - 1 ) , 'arrow ivu-icon' : i < (levelList.length - 1 )}" @click="changeLevelItem(i)">
                <span class="orgSelectorNavBarName">{{list.name}}</span> 
                <!-- <Icon type="ios-arrow-forward" v-show="i < (levelList.length - 1 )"/> -->
            </div>
        </div>
        <div class="checkboxAll" v-if="config.muliteChoice == 1" @click="changeCheckAllStatus">
            <label class="ivu-checkbox-wrapper ivu-checkbox-default" >
                <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : allStatus}">
                    <span class="ivu-checkbox-inner"></span> 
                </span> 全选
            </label>
        </div>
        <div class="flex-1 checkboxGroupWrap overflowYAuto"
            v-infinite-scroll="getUserList"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <!-- 可选择部门 -->
            <div v-if="config.type == 1" >
                <div v-for="(item , j) in orgList" :key="item.id" class="flex checkboxWrap" >
                    <label class="checkboxLabel flex-1 flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default " @click="changeCheck(j , 1)">
                        <span class="ivu-checkbox " :class="{'ivu-checkbox-checked' : item.check}">
                            <span class="ivu-checkbox-inner"></span> 
                        </span> 
                        <i class="ivu-icon ivu-icon-ios-folder"></i> 
                        <span class="name">{{item.name}}</span>
                    </label>
                    <div class="rightBtnDisabled flex flex-align-items" v-show="item.check" >
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADBElEQVR4Xu2aMYsTQRTH30sghgMhhaSxUMRgEwslciRvrxW8wi+hCIKdpYoXUUtLEdQPYaMIFurNpIgRRYPYXOEHsAiI5iLek4BCmGy4meyb21kyWyYz/33vt29m3/53EVb8wBXPHyKAWAEpBAaDwdp4PH4AAOcR8RgAlCxB7THzNwB4Wa1Wr7darZ+W83IbNrcEhsNhZTQavQeAZsaoPtfr9XONRmM3o47X6XMAlFJ3EPGW0Fm3iKgrpOVFZg6A1voTAJwWOttHIjojpOVFJg3AH4c1v19QEyI6tN+gPP9PA8BmQERkdbvUWi89Ny8IEYBJPstVzDI3VkBOBOISiEvAIKC13gMQe0hiIrJto3NZBGmd4A4inhCKZoeITgppeZFJA/AEES8Jne0xEV0R0vIikwbgMAC8Q8RTWc7IzF9qtdp6s9n8kUXH99zUDs94HD7usCcU/3HYN/HQ9K16/NCClownApCkWUQt5wrQWt8AgKvTZJn5YZIk930n7tOjdAKglLqAiM9nE2bmzSRJXviC4NujdALw7+rfNZK9SUT3fAHw7VG6AtgCgNtGsl0imv7u5fDtURYBgFePsggAlvYZbRyqCMBl4Wqt0/aANwDw2kXHHMvMu8y8vbGxoQ7aoJGogCy5m3PnNlSbMl4UgM3c0AB8J6IjswnZJBEBLCBgAy+oCmDmp0mSXDYqwKtHKQFAZBMslUr9SqXyttVq/Z4FoJTy6lFKAPDaCSqlvHqURQDg1aMMHsB0Ofj0KAsBQLLRMLUiABe6C1phr5ugS3zLjI0V4EItrwoIxhPMA0BonuCBW2LRE/T83WLwm6DWOnqC5kYt+d1iESogeFPU5U66aOwEALYR8Vqn0/m6yo5Qn4jWQwYwfTFqvhqTqID/Gr+IaC1YAEqpi4j4TDJjQ+sDEZ0NFgAzl3q93iMA2ASAo4IgJszcL5fL3Xa7/SpYT1AwYWupoDxB66gFBwblCQrmZS2llArHE7SOWnhgMJ6gcF5ByDm1wkFELBxEBCAMtHByfwG09DdfAvw+AQAAAABJRU5ErkJggg==" alt="">
                        <span>下级</span>
                    </div>
                    <div class="rightBtn flex flex-align-items" v-show="!item.check" @click="changeLevel(item)">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADEElEQVR4Xu2av4sTQRTHvy+KBwGt7Cz8gSCIFv5iF+wFAwq6i/+AIgh2lipeRC0tRVD/Ackih3CHYKGexWwkKAqHhVfYa6Uod9F9st1lNyEz2Xm3EzMpk3nffe+TN5O33yxhxl804/XDA/AdMITAsefc3LqO+2CcArCbCA0dUMzIAHwl4EV/Dtd6Z+iXTlyda0pb4OBT3rZjC3oADlVKjPHpWxMnvrRorZKOcHAJQJDwbQJuWrruvIqobUlLRKYEIOzwRxAO27gaMz6kMR2xoSWlUe6ADv/V3fPjkmLGehrT3Lh1dX5e7oCEuZiQikjr5zKsEFsXBA+gSL7Kt1gl1ndATQT8FvBboEAgSDgj2LlJYoDTiLTG6Jp2QLnQIOFVAvZZSmhVRbTfkpaIzLAz4DGAizauxoxHaUyXbWhJaZQAnFzg7X/6eEeEA1UuyoyVHxmClQv0s4qOdOzQCW/gdpiwR/dM+C9uh6WJu6avNeO7lrTNfDwAmzSnUcu4A8IOXwdwJS82IzzoRnRPunBJj9IIQPiMTyPD4kDBDbTUOVqSgiDtUZoByL99wp2BYhk3VEx3pQBIe5RmABKeB3CrUGxbRZS/L/KS9iidBxAIe5TOA6jiMunEegAmGzccfga8BvDKRKe4loE1EJbT8/R2sw0aGx1QpfZibOlA1WnjUQnoxDoFgIHvaUQ7NxakU4QHMIKADjynOgDAExXRpY31SHuUNgBYOQSzDN1sL970jlO/AEDUo7QBQHYSTFjUo3QegLRH6TyAfDtIepRTAcDmoFHU8gBM6I4YhUUPQZP8JlnrO8CEWl0d4I4nWIMj5JYnWAMA7wkKP7fo/CHoPcEKzx5u1u2w6BygU8TUGyL5I7UELPeBq72YPs+sIwSgqyIK3AUw7K8xk0lq3FrGbxVT010ACZ8FsDCujok/Z7xXMR11FgCYG0GChwS0QNg1caGFwPwMAKFLjLaK6aWznqCtgk10pJ9bNBqETBK3tTZ0yRO0VZSJjlOeoEniNtc64wnaLMoVLefPAGlQHoA0Ydf1/wG+t0dfqRrD5AAAAABJRU5ErkJggg==" alt="">
                        <span>下级</span>
                    </div>
                </div>
            </div>
            <!-- 部门列表（单选 或 下级列表） -->
            <div v-if="config.type == 2" >
                <div v-for="item  in orgList" :key="item.id" class="flex checkboxWrap uncheckboxWrap">
                    <div :label="item.id" class="checkboxLabel flex-1 flex-align-items"> 
                        <Icon type="ios-folder" />
                        <span class="name">{{item.name}}</span>
                    </div>
                    <div class="rightBtn flex flex-align-items" @click="changeLevel(item)">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADEElEQVR4Xu2av4sTQRTHvy+KBwGt7Cz8gSCIFv5iF+wFAwq6i/+AIgh2lipeRC0tRVD/Ackih3CHYKGexWwkKAqHhVfYa6Uod9F9st1lNyEz2Xm3EzMpk3nffe+TN5O33yxhxl804/XDA/AdMITAsefc3LqO+2CcArCbCA0dUMzIAHwl4EV/Dtd6Z+iXTlyda0pb4OBT3rZjC3oADlVKjPHpWxMnvrRorZKOcHAJQJDwbQJuWrruvIqobUlLRKYEIOzwRxAO27gaMz6kMR2xoSWlUe6ADv/V3fPjkmLGehrT3Lh1dX5e7oCEuZiQikjr5zKsEFsXBA+gSL7Kt1gl1ndATQT8FvBboEAgSDgj2LlJYoDTiLTG6Jp2QLnQIOFVAvZZSmhVRbTfkpaIzLAz4DGAizauxoxHaUyXbWhJaZQAnFzg7X/6eEeEA1UuyoyVHxmClQv0s4qOdOzQCW/gdpiwR/dM+C9uh6WJu6avNeO7lrTNfDwAmzSnUcu4A8IOXwdwJS82IzzoRnRPunBJj9IIQPiMTyPD4kDBDbTUOVqSgiDtUZoByL99wp2BYhk3VEx3pQBIe5RmABKeB3CrUGxbRZS/L/KS9iidBxAIe5TOA6jiMunEegAmGzccfga8BvDKRKe4loE1EJbT8/R2sw0aGx1QpfZibOlA1WnjUQnoxDoFgIHvaUQ7NxakU4QHMIKADjynOgDAExXRpY31SHuUNgBYOQSzDN1sL970jlO/AEDUo7QBQHYSTFjUo3QegLRH6TyAfDtIepRTAcDmoFHU8gBM6I4YhUUPQZP8JlnrO8CEWl0d4I4nWIMj5JYnWAMA7wkKP7fo/CHoPcEKzx5u1u2w6BygU8TUGyL5I7UELPeBq72YPs+sIwSgqyIK3AUw7K8xk0lq3FrGbxVT010ACZ8FsDCujok/Z7xXMR11FgCYG0GChwS0QNg1caGFwPwMAKFLjLaK6aWznqCtgk10pJ9bNBqETBK3tTZ0yRO0VZSJjlOeoEniNtc64wnaLMoVLefPAGlQHoA0Ydf1/wG+t0dfqRrD5AAAAABJRU5ErkJggg==" alt="">
                        <span>下级</span>
                    </div>
                </div>
            </div>
            <!-- 可选择人员 -->
            <div v-for="(info , index) in memList" :key="info.id" class="checkboxWrap" @click="changeCheck(index , 2)"> 
                <label class="checkboxLabel checkboxWrap ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default">
                    <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : info.check}">
                        <span class="ivu-checkbox-inner"></span> 
                    </span> 
                    <span class="iconWrap">{{getShortName(info.name)}}</span> 
                    <span class="name">{{info.name}}</span>
                </label>    
            </div>
            <div class="loading_tip" v-show="showLoadingMore">正在加载</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
     data(){
        return {
            levelList : [],
            height:"329px",
            checkAllGroup : [],
            checkAll : false,
            orgList:[],
            memList : [],
            config : {},
            condition : {},
            pager : {
                pageSize : 2,
                pageNum : 1
            },
            loading : true,
            showLoadingMore : true,
            total : 0,
            result : [],
            topLevelInfo : {},
            allStatus : false
        }
    },
    methods : {
        init(config , condition , fuzzy , result){
            this.config = config;
            this.condition = condition;
            this.height = ((condition.org && condition.role && !condition.charge) || (condition.org && !condition.role && condition.charge) || (!condition.org && condition.role && condition.charge) || (condition.org && condition.role && condition.charge)) ? "329px" : '370px';
            this.result = result;
            this.fuzzy = fuzzy;
            this.getDeptInfo();
        },
        changeCheckAllStatus(){
            this.allStatus = !this.allStatus;
            if(this.config.type == 1){
                for(let i = 0 ; i < this.orgList.length ; i++){
                    this.orgList[i].check = !this.allStatus;
                    this.changeCheck(i , 1)
                }
                for(let j = 0 ; j < this.memList.length ; j++){
                    this.memList[j].check = !this.allStatus;
                    this.changeCheck(j , 2)
                }
            }
            if(this.config.type == 2){
                for(var k = 0 ; k < this.memList.length ; k++){
                    this.memList[k].check = !this.allStatus;
                    this.changeCheck(k , 2)
                }
            }
        },
        /**
         * 获取当前部门信息
        */
        getDeptInfo(){
            var url = constGlobal.HostContact + 'deptList/search';
            var param = {
                deptIdList : this.config.deptId
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data && res.data.length == 1){
                        this.topLevelInfo = res.data[0]
                        this.levelList[0] = {
                            name : res.data[0].name,
                            id : res.data[0].id
                        }
                        this.getLevelData()
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        /**
         * 获取等级数据
        */
        getLevelData(){
            this.orgList = [];
            this.memList = [];

            this.showLoadingMore = true;
            
            // 获取当前节点下的子部门
            this.getDeptList()
            // 获取当前节点下的人员列表 （分页）
            this.pager = {
                pageSize : 200,
                pageNum : 1
            }
            this.getUserList();
        },
        /**
         * 修改等级数据
        */
        changeLevelItem(i){
            if(i == ( this.levelList.length - 1 )){
                return;
            }
            this.allStatus = false;
            this.levelList.splice(i, (this.levelList.length - i));
            if(this.levelList.length == 0){
                this.levelList[0] = {
                    name : this.topLevelInfo.name,
                    id : this.topLevelInfo.id
                }
                this.levelList.push()
            }
            this.getLevelData();
        },
        /**
         * 修改等级
        */
        changeLevel(info){
            this.allStatus = false;
            this.levelList.push({
                id : info.id,
                name : info.name
            })
            this.getLevelData();
        },
        /**
         * 指定部门的子部门列表（支持模糊搜索）
        */
        getDeptList(){
            var url = constGlobal.HostContact + 'deptList/search';
            var param = {
                parentDeptIdList : [this.levelList[this.levelList.length - 1].id],
                deptFuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        var list = res.data;
                        if(this.condition.org){
                            for(var i = 0 ; i < list.length ; i++){
                                list[i].check = false;
                            }
                        }
                        this.orgList = list;
                        this.initDeptCheck();
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
         /**
         * 初始化选中状态
        */
        initDeptCheck() {
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.orgList.length ; j++){
                    if(this.result[i].id == this.orgList[j].id){
                        this.orgList[j].check = true;
                    }
                }
            }
        },
        /**
         * 人员初始化选中
        */
        initMemCheck(){
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.memList.length ; j++){
                    if(this.result[i].id == this.memList[j].id){
                        this.memList[j].check = true; 
                    }
                }
            }
        },
        /**
         * 修改选中状态
        */
        changeCheck(index , type) {
            if(type == 1) { // 改变部门状态
                this.$emit("org-check-change", this.orgList[index] , this.orgList[index].check , 1)
            }else if(type == 2) {
                this.$emit("org-check-change", this.memList[index] , this.memList[index].check , 2)
            }
        },
        /**
         * 改变状态
        */
        setCheckStatus(result , type){
            this.result = result;
            for(var i = 0 ; i < this.memList.length ; i++){
                this.memList[i].check = false;
            }
            for(var i = 0 ; i < this.orgList.length ; i++){
                this.orgList[i].check = false;
            }
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.orgList.length ; j++){
                    if(this.result[i].id == this.orgList[j].id){
                        this.orgList[j].check = true;
                    }
                }
            }
            this.orgList.push()
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.memList.length ; j++){
                    if(this.result[i].id == this.memList[j].id){
                        this.memList[j].check = true;
                    }
                }
            }
            this.memList.push()
        },
        /**
         * 获取人员列表数据
        */
        getUserList(){
            this.loading = true;
            var url = constGlobal.HostContact + 'userList/search';
            var param = {
                deptIdList : [this.levelList[this.levelList.length - 1].id],
                pager : this.pager,
                fuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        this.total = res.total;
                        if(this.pager.pageNum == 1){
                            this.memList = res.data;    
                        }else{
                            for(var i = 0 ; i < res.data.length ; i++){
                                res.data[i].check = false;
                                this.memList.push(res.data[i]);
                            }
                        }
                        this.initMemCheck();
                        if(this.total > this.memList.length){
                            this.pager.pageNum ++;
                            this.loading = false;
                            this.showLoadingMore = true;
                        }else{
                            this.loading = true;
                            this.showLoadingMore = false;
                        }
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },

        getShortName(name){
            return name.slice(name.length - 2 , name.length)
        },
        checkAllGroupChange(){

        }
    }
}
</script>

<style lang="scss">
    @import '~assets/css/public.scss';
    @import '~assets/css/flex.scss';
    .contentOrgWrap{
        .loading_tip{
            font-size: 12px;
            color: #999;
            text-align: center;
            margin: 5px 0px;
        }
        .orgSelectorNavBarName{
            position:relative;
            margin-top:-1px;
        }
        .arrow{

        }
        .arrow:after{
            content: "\F11F";
        }
        .orgSelectorNavbar{
            font-size: 14px;
            margin-bottom: 10px;
            margin-left: 8px;
            .orgNav{
                margin-right:3px;
                color: #999;
                font-size:14px;
                .ivu-icon-ios-arrow-forward{
                    margin-left: -3px;
                    font-size: 16px;
                }
            }
            .orgNav:hover{
                color:#2d8cf0;
                cursor:pointer;
            }
            .active{
                color:#333;
            }
            
        }
        .checkBokList{
            .ivu-checkbox-inner{

            }
        }
        .checkboxAll{
            border-bottom: 1px solid rgb(233, 233, 233);
            padding-bottom: 10px;
            margin-bottom: 0px;
            padding-left: 8px;
            cursor:pointer;
            .ivu-checkbox{
                margin-right:8px;
            }
        }
        .checkboxLabel{
            width: 100%;
            display: inline-block;
            padding: 8px 8px 8px 10px;
            margin-right:0px;
        
            .ivu-icon{
                font-size: 18px;
                margin-left: 8px;
                margin-right: 3px;
                color: #73c8ea;
            }
            
        }
        
        .ivu-collapse-content{
            padding:0px;
            .ivu-collapse-content-box{
                padding:5px 0px;
            }
        }
        .checkboxLabel{
            width: 100%;
            display: inline-block;
            padding: 6px 5px 6px 8px;
            margin-right:0px;
            .iconWrap{
                background: #efefef;
                display: inline-block;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-radius: 50%;
                color: #44ace8;
                margin-left: 8px;
                font-size:10px;
            }
            .ivu-icon-ios-folder{
                font-size: 18px;
                margin-left: 8px;
                margin-right: 8px;
                color: #73c8ea;
            }
            
        }
        .rightBtn{
            font-size: 14px;
            color: #38adff;
            cursor: pointer;
            padding-right:8px;
            >img{
                height: 15px;
                margin-bottom: -2px;
                margin-right: 4px;
            }
        }
        .rightBtnDisabled{
            font-size: 14px;
            color: #c5c5c5;
            cursor: pointer;
            padding-right:8px;
            >img{
                height: 15px;
                margin-bottom: -2px;
                margin-right: 4px;
            }
        }
        .uncheckboxWrap{
            padding-left:0px;
            .checkboxLabel{
                padding-left:0px;
            }
        }
        .unCheckboxGroupWrap{
            .checkboxLabel{
                padding-left:0px;
            }
            .checkboxLabel:hover{
                background:#eaeaea;
            }
        }
        .checkboxWrap:hover{
            background: rgba(240,240,240,0.9);
            .iconWrap{
                background:rgba(255,255,255,0.9)
            }
        }
        
    }
</style>
