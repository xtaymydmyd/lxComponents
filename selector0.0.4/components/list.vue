<template>
    <div class="contentOrgWrap flex flex-direction-column" :style="{height : height}">
        <div class="orgSelectorNavbar" v-show="levelList.length > 1">
            <div 
                v-for="(list , i) in levelList" :key="i" 
                class="orgNav flex flex-align-items" 
                v-show="levelList.length > 1" 
                :class="{ 'active' : i == ( levelList.length - 1 ) , 'arrow ivu-icon' : i < (levelList.length - 1 )}" 
                @click="changeLevelItem(i)">
                <div class="orgSelectorNavBarName">{{list.name}}</div> 
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
            <!-- 可选择人员 -->
            <div v-for="(info , index) in memList" :key="info.id" class="checkboxWrap" @click="changeCheck(index , 1)"> 
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
                pageSize : 15,
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
            this.height = '370px';
            this.result = result;
            this.fuzzy = fuzzy;
            this.allStatus = false;
            this.getUserList();
        },
        /**
         * 获取人员列表数据
        */
        getUserList(){
            this.loading = true;
            var url = constGlobal.HostContact + 'userList/search';
            var param = {
                // deptIdList : this.config.deptId,
                roleIdList : this.config.roleList,
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
        
        changeCheckAllStatus(){
            this.allStatus = !this.allStatus;
            if(this.config.type == 1){
                for(let j = 0 ; j < this.memList.length ; j++){
                    this.memList[j].check = !this.allStatus;
                    this.changeCheck(j , 1)
                }
            }
            if(this.config.type == 2){
                for(var k = 0 ; k < this.memList.length ; k++){
                    this.memList[k].check = !this.allStatus;
                    this.changeCheck(k , 1)
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
            this.$emit("list-check-change", this.memList[index] , this.memList[index].check , 1)
        },
        /**
         * 改变状态
        */
        setCheckStatus(result , type){
            this.result = result;
            for(var i = 0 ; i < this.memList.length ; i++){
                this.memList[i].check = false;
            }
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.memList.length ; j++){
                    if(this.result[i].id == this.memList[j].id){
                        this.memList[j].check = true;
                    }
                }
            }
            this.memList.push()
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
    @import '../assets/org.scss'
</style>
