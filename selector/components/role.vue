<template>
    <div class="roleContentWrap overflowYAuto" :style="{height : height}">
       <div  v-for="(list , i ) in roleList" :key="list.id + '' + i" class="flex flex-align-items"  @click="changeCheck(i , 4)">
            <label class="checkboxLabel flex flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default">
                <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : list.check}">
                    <span class="ivu-checkbox-inner"></span> 
                </span> 
                <i class="ivu-icon ivu-icon-md-person"></i> 
                <span>{{list.name}}</span>
            </label>
        </div>
        <div v-show="(roleList.length == 0 && !roleLoading)" style="text-align: center;color: #999;padding: 10px;">
            暂无数据
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
     data(){
        return {
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
            roleLoading : true,
            checkAllGroup : [],
            config : {},
            condition : {},
            result : [],
            fuzzy : '',
            roleList : []
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

            this.roleLoading = true;

            this.getRoleList();
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
        /**
         * 获取角色列表
        */
        getRoleList(){
            var url = constGlobal.HostPrivilege + 'roleList/search';
            var param = {
                fuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        for(var i = 0 ; i < res.data.length ; i++) {
                            res.data[i].check = false;
                            res.data[i].type = 4;
                        }
                        this.roleList = res.data;
                        this.roleLoading = false;
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
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
                            res.data[i].id = res.data[i].groupId;
                            res.data[i].check = false;
                        }
                        this.completeOrgTree[1].children = res.data;
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
                for(var k = 0 ; k < this.roleList.length ; k++){
                    if(this.result[i].id == this.roleList[k].id){
                        this.roleList[k].check = true;
                    }
                }
            }
            this.roleList.push()
        },
        changeCheck(index){ 
            this.$emit("role-check-change", this.roleList[index] , this.roleList[index].check , 4)
        },
        /**
         * 设置选中
        */
        setCheckStatus(result , id){
            this.result = result;
            if(this.config.muliteChoice == 1){
                for(var i = 0 ; i < this.roleList.length ; i++){
                    this.roleList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.roleList.length ; j++){
                        if(this.result[i].id == this.roleList[j].id){
                            this.roleList[j].check = true;
                        }
                    }
                }
                this.roleList.push()
            }else if(this.config.muliteChoice == 2) {
                for(var i = 0 ; i < this.roleList.length ; i++){
                    this.roleList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.roleList.length ; j++){
                        if(this.result[i].id == this.roleList[j].id){
                            this.roleList[j].check = true;
                        }
                    }
                }
               this.roleList.push()
            }
            
        },
        getShortName(name){
            return name.slice(name.length - 2 , name.length)
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/role.scss';
</style>
