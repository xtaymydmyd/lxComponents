<template>
    <div class="roleContentWrap overflowYAuto" :style="{height : height}">
       <div  v-for="(list , i ) in postList" :key="list.id + '' + i" class="flex flex-align-items"  @click="changeCheck(i , 2)">
            <label class="checkboxLabel flex flex-align-items ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default">
                <span class="ivu-checkbox" :class="{'ivu-checkbox-checked' : list.check}">
                    <span class="ivu-checkbox-inner"></span> 
                </span> 
                <i class="ivu-icon ivu-icon-md-person"></i> 
                <span>{{list.name}}</span>
            </label>
        </div>
        <div v-show="(postList.length == 0 && !postLoading)" style="text-align: center;color: #999;padding: 10px;">
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
            postLoading : true,
            checkAllGroup : [],
            config : {},
            condition : {},
            result : [],
            fuzzy : '',
            postList : []
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

            this.postLoading = true;

            this.getPostList();
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
        getPostList(){
            var url = constGlobal.HostContact + 'postList/search';
            var param = {
                fuzzy : this.fuzzy
            }
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    if(res.data){
                        for(var i = 0 ; i < res.data.length ; i++){
                            res.data[i].check = false;
                        }
                        this.postList = res.data;
                        this.initCheck();
                        this.postLoading = false
                    }
                } else {
                    common.toastMsg(res.message) 
                }
            })
        },
        initCheck(){
            for(var i = 0 ; i < this.result.length ; i++){
                for(var k = 0 ; k < this.postList.length ; k++){
                    if(this.result[i].id == this.postList[k].id){
                        this.postList[k].check = true;
                    }
                }
            }
            this.postList.push()
        },
        changeCheck(index){ 
            this.$emit("post-check-change", this.postList[index] , this.postList[index].check , 2)
        },
        /**
         * 设置选中
        */
        setCheckStatus(result , id){
            this.result = result;
            if(this.config.muliteChoice == 1){
                for(var i = 0 ; i < this.postList.length ; i++){
                    this.postList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.postList.length ; j++){
                        if(this.result[i].id == this.postList[j].id){
                            this.postList[j].check = true;
                        }
                    }
                }
                this.postList.push()
            }else if(this.config.muliteChoice == 2) {
                for(var i = 0 ; i < this.postList.length ; i++){
                    this.postList[i].check = false;
                }
                for(var i = 0 ; i < this.result.length ; i++){
                    for(var j = 0 ; j < this.postList.length ; j++){
                        if(this.result[i].id == this.postList[j].id){
                            this.postList[j].check = true;
                        }
                    }
                }
               this.postList.push()
            }
            
        },
        getShortName(name){
            return name.slice(name.length - 2 , name.length)
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/post.scss';
</style>
