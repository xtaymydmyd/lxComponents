<template>
    <div class="roleContentWrap overflowYAuto" :style="{height : height}">
       <div  v-for="(list , i ) in groupList" :key="list.id + '' + i" class="flex flex-align-items"  @click="changeCheck(i , 3)">
            <label class="checkboxLabel flex flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default">
                <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : list.check}">
                    <span class="ivu-checkbox-inner"></span> 
                </span> 
                <i class="ivu-icon ivu-icon-md-person"></i> 
                <span>{{list.name}}</span>
            </label>
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
            groupList : []
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

            this.groupLoading = true;
            this.getGroupList();
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
        changeCheck(index){ 
            this.$emit("group-check-change", this.groupList[index] , this.groupList[index].check , 3)
        },
        /**
         * 设置选中
        */
        setCheckStatus(result){
            this.result = result;
            if(this.config.muliteChoice == 1){
                for(var i = 0 ; i < this.groupList.length ; i++){
                    this.groupList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.groupList.length ; j++){
                        if(this.result[i].id == this.groupList[j].id){
                            this.groupList[j].check = true;
                        }
                    }
                }
                this.groupList.push()
            }else if(this.config.muliteChoice == 2) {
                for(var i = 0 ; i < this.groupList.length ; i++){
                    this.groupList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.groupList.length ; j++){
                        if(this.result[i].id == this.groupList[j].id){
                            this.groupList[j].check = true;
                        }
                    }
                }
               this.groupList.push()
            }
            
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
    @import "../assets/group.scss"
</style>
