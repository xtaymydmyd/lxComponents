<template>
    <div class="roleContentWrap overflowYAuto flex flex-direction-column" :style="{height : height}">
        <div class="cursorText" @click="removeLevel" v-if="activeIndex >= 0 ">上一级</div>
        <div class="flex-1 checkboxGroupWrap overflowYAuto"
            v-infinite-scroll="getUserList"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <div v-if="activeIndex == -1">
                <div v-if="config.type == 1 || config.type == 3">
                    <div  
                        v-for="(list , i ) in groupList" 
                        :key="list.id + '' + i" 
                        class="flex flex-align-items checkboxList">
                        <label class="flex-1 checkboxLabel flex flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default"
                            @click="changeCheck(i , 3)">
                            <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : list.check}">
                                <span class="ivu-checkbox-inner"></span> 
                            </span> 
                            <i class="ivu-icon ivu-icon-ios-folder"></i> 
                            <span>{{list.name}}</span>
                        </label>
                        <span class="checkText" @click="checkIndexInfo(i)">查看</span>
                    </div>
                </div>
                <div v-if="config.type == 2">
                    <div  
                        v-for="(list , i ) in groupList" 
                        :key="list.id + '' + i" 
                        class="flex flex-align-items checkboxList">
                        <label class="flex-1 checkboxLabel flex flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default"
                            @click="changeCheck(i , 3)">
                            <i class="ivu-icon ivu-icon-ios-folder"></i> 
                            <span>{{list.name}}</span>
                        </label>
                        <span class="checkText" @click="checkIndexInfo(i)">查看</span>
                    </div>
                </div>
            </div>
            <!-- 可选择人员 -->
            <div v-if="activeIndex >= 0">
                <div 
                    v-for="(info , index) in memList" 
                    :key="info.id" 
                    class="checkboxWrap" 
                    @click="changeCheck(index , 1)"> 
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
        <div v-show="(groupList.length == 0 && !groupLoading)" style="text-align: center;color: #999;padding: 10px;">
            暂无数据
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
     data(){
        return {
            loading : true,
            showLoadingMore : true,
            total : 0,
            config : {
                parentDetpIdList : [],
                condition : []
            },
            condition : {
                org : false,
                role : false,
                charge : false
            },
            height:"329px",
            collapseVal : '1',
            groupLoading : true,
            checkAllGroup : [],
            config : {},
            condition : {},
            result : [],
            fuzzy : '',
            groupList : [],
            pager : {
                pageSize : 2,
                pageNum : 1
            },
            memList : [],
            activeIndex : -1
        }
    },
    methods : {
        /**
         * 初始化
        */
        init(config , condition , fuzzy , result){
            this.config = config;
            this.condition = condition;
            this.height = this.showTab() ? "329px" : '370px';
            this.result = result;
            this.fuzzy = fuzzy;

            this.activeIndex = -1;

            this.groupLoading = true;
            this.getGroupList();
        },
        removeLevel(){
            this.activeIndex = -1;
            this.loading = true;
        },
        showTab(){
            var num = 0
            if(this.condition.org){
                num ++;
            }
            if(this.condition.role){
                num ++;
            }
            if(this.condition.group){
                num ++;
            }
            if(this.condition.post){
                num ++;
            }
            if(this.condition.charge){
                num ++;
            }
            return num > 1 ? true : false
        },
        checkIndexInfo(i){
            this.activeIndex = i;

            this.memList = [];
            this.showLoadingMore = true;
            this.pager = {
                pageSize : 200,
                pageNum : 1
            }
            this.getUserList()
        },
        /**
         * 获取人员列表数据
        */
        getUserList(){
            this.loading = true;
            var url = constGlobal.HostContact + 'deptUserInfoById/search';
            var param = {
                groupIdList : [this.groupList[this.activeIndex].groupId],
                pager : this.pager
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
         * 获取群组列表
        */
        getGroupList(){
            var url = constGlobal.HostContact + 'groupList/searchByVisable';
            var param = {
                groupFuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        for(var i = 0 ; i < res.data.length ; i++){
                            res.data[i].type = 3;
                            res.data[i].check = false;
                            res.data[i].id = res.data[i].groupId;
                        }
                        this.groupList = res.data;
                        this.initCheck();
                        this.groupLoading = false;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        initCheck(){
            for(var i = 0 ; i < this.result.length ; i++){
                for(var k = 0 ; k < this.groupList.length ; k++){
                    if(this.result[i].id == this.groupList[k].id){
                        this.groupList[k].check = true;
                    }
                }
            }
            this.groupList.push()
        },
        changeCheck(index , type){ 
            if(type == 3){
                this.$emit("group-check-change", this.groupList[index] , this.groupList[index].check , 3)
            }else if(type == 1){
                this.$emit("group-check-change", this.memList[index] , this.memList[index].check , 1)
            }
        },
        /**
         * 设置选中
        */
        setCheckStatus(result , type){
            this.result = result;
            
            for(var i = 0 ; i < this.groupList.length ; i++){
                this.groupList[i].check = false;
            }
            for(var i = 0 ; i < this.memList.length ; i++){
                this.memList[i].check = false;
            }
            for(var i = 0 ; i < this.result.length ; i++){
                for(var j = 0 ; j < this.groupList.length ; j++){
                    if(this.result[i].id == this.groupList[j].id){
                        this.groupList[j].check = true;
                    }
                }
            }
            this.groupList.push()
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
        submit(){

        },
        cancel(){

        }
    }
}
</script>

<style lang="scss">
    @import "../assets/group.scss";
</style>
