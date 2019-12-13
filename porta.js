; (function () {
    var portalHeaderExternLinkComponent =
    `<template>
    <div class="portalHeader  flex flex-justify-content-between flex-align-items" style="height:44px;">
        <div class="todayInfo" style="height:30px;">
            <img src="http://jy-admin.jieyundata.com:18026/group1/M00/00/37/wKhkP13fXkaAdw5yAAUHXO3vUrQ770.png" alt="" style="height:100%">
        </div>
        <div class="headLeft">
            <img src="https://xtaymydmyd.github.io/pictureLibrary/scan_icon1.png" @click="useScan" class="scan-grey-icon" style="height:18px;">
        </div>
    </div>
</template>

<script>
export default{
    name: 'portalHeader',
    data () {
        return {
            headType: '1',
            searchState: false,
            date: '',
            week: ''
        }
    },
    props: {
        link:String
    },
    mounted:function () {
        if(constGlobal.isWeChat()){
            this.querySignature();
        }
        this.date = moment().format('YYYY年MM月DD日 dddd')
    },
    methods: {
        querySignature(){
            var url = constGlobal.HostJSAPISignature +  "signature";
            http.apiPost(url, {url: window.location.href}).then(res =>{
                if(res.status == 0){
                    var signatureParams = res.data;
                    signatureParams.jsApiList = ['scanQRCode'];
                    this.useJsApi(signatureParams);
                }
            });
        },
        useJsApi(configParams){
            parent.wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: configParams.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: configParams.timestamp, // 必填，生成签名的时间戳
                nonceStr: configParams.nonceStr, // 必填，生成签名的随机串
                signature: configParams.signature,// 必填，签名，见附录1
                jsApiList:  configParams.jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            parent.wx.error(function(res){
            //    console.log(res);
            });
            parent.wx.ready(function(){
                parent.wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function(res) {
                        var location = {
                            latitude: res.latitude,
                            longitude: res.longitude
                        }
                        sessionStorage.setItem("deviceLocationInfo", JSON.stringify(location));
                    }
                })
            });
            
        },
        useScan(){
            var _this = this;
            if(constGlobal.isWeChat()){
                parent.wx.scanQRCode({
                    desc: 'scanQRCode desc',
                    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        // console.log(res);
                    },
                    error: function(res){
                        if(res.errMsg.indexOf('function_not_exist') > 0){
                            alert('版本过低请升级')
                        }
                    }
                });
            }else{
                // cordova调用扫一扫
               
            }
        },
    }
}
</script>
<style lang="css">
.portalHeader {
    background: #fff;
    padding: 0px 15px;
    height: 44px;
}
.portalHeader .todayInfo img {
    height: 26px;
}
.portalHeader .headLeft img {
    height: 18px;
}

.fixPortalHeader1 .scan-white-icon {
    display: inline-block;
}
.fixPortalHeader1 .scan-grey-icon {
    display: none;
}
.fixPortalHeader1 .vux-1px:before {
    border: 0px solid #e6e6e6;
    border-radius: 30px;
}

.fixPortalHeader2 .scan-white-icon {
    display: none;
}
.fixPortalHeader2 .scan-grey-icon {
    display: inline-block;
}
.fixPortalHeader2 .vux-1px:before {
    border: 1px solid #e6e6e6;
    border-radius: 30px;
}
</style>`
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = portalHeaderExternLinkComponent;
    } else {
        window.portalHeaderExternLinkComponent = portalHeaderExternLinkComponent;
    }
})();
; (function () {
    var portalActiveExternLinkComponent =
    `<template>
    <div class="portalActive portalWrap">
        <div class="title flex flex-align-items flex-justify-content-between myActiveTitle">
           <div class="left">
               <span class="text">校园活动</span>
           </div>
           <div class="right"  @click="toModule()" v-if="jumpUrl != ''">
               <span>更多</span>
           </div>
        </div>
        <div class="container" style="min-height: 70px;box-sizing:border-box;">
            <div class="active-list" 
                @click="toAppointmentInfo('appointment.html/appointment/appointmentInfo/1')" 
                v-show="activeFlag && active.name.length > 0">
                <div class="active-content">
                    <div style="border-radius:4px;min-height:160px;width: 100%;position: relative;">
                        <img 
                            :src="sourceUrl + 'ueditor/imgPrefix/' + active.coverImgId + '/0'" 
                            style="width:100%;border-radius:5px;"
                            v-if="!(active.coverImgId == null || active.coverImgId == '')">
                        <img src="https://xtaymydmyd.github.io/pictureLibrary/huodong.png" 
                            style="width:100%;border-radius:5px;"
                            v-if="active.coverImgId == null || active.coverImgId == ''">
                    </div>
                    <div class="active-content-title flex flex-justify-content-between flex-align-items">
                        <div class="active-title" style="width:100%;">{{active.name}}</div>
                    </div>
                </div>
            </div>  
            <div class="noActivityList flex flex-justify-content flex-align-items" v-show="activeFlag && active.name.length == 0">
                <img src="https://xtaymydmyd.github.io/pictureLibrary/huodong.png" alt="">
                无相关活动
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'portalActive',
    data () {
        return {
            active : {name:''},
            sourceUrl : constGlobal.HostBooking,
            activeFlag : false,
            jumpUrl:'',
        }
    },
    components: {},
    mounted:function () {
        var _this = this;
        this.queryActive();
    },
    methods: {
        /**
         * 获取我的活动预约
        */
        queryActive:function(){
            var param = {};
            var url = constGlobal.HostBooking + 'getHotBooking';
            http.apiPost(url, param).then(res => {
                if (res.status == 0) {
                    this.activeFlag = true;
                    if(res.data){
                        this.active = res.data;
                    }
                } else {
                    common.toastMsg(res.message)
                }
            });
        },
        /**
         * 跳转到预约列表
        */
        toModule : function(link){
            sessionStorage.setItem('appointmentState', JSON.stringify(1));
            if( constGlobal.isWeChat() ){
                window.location.href = 'appointment.html#/appointment/appointmentList'
            }else{
                common.openApp(this.jumpUrl + "/appointmentList")
            }
        },
        /**
         * 跳转到预约详情
        */
        toAppointmentInfo:function(link){
             if(this.active.isSel == 0){
                if( constGlobal.isWeChat()){
                    window.location.href = "appointment.html#/appointment/appointmentInfo/1?id=" + this.active.bookingId + '&isCanBooking=' + this.active.isCanBooking + '&isExp=' + this.active.isExp; 
                }else{
                    if( this.jumpUrl != ''){
                        common.openApp(  this.jumpUrl + "/appointmentInfo/1?id=" + this.active.bookingId + '&isCanBooking=' + this.active.isCanBooking + '&isExp=' + this.active.isExp )
                    }
                }
            }else{
                if(constGlobal.isWeChat()){
                    window.location.href = 'appointment.html#/appointment/apponitmentQX?id=' + this.active.bookingId + '&timeStampId=' + this.active.timeStampId+ '&isExp=' + this.active.isExp;
                }else{
                    if( this.jumpUrl != ''){
                        common.openApp( window.location.href = this.jumpUrl + '/apponitmentQX?id=' + this.active.bookingId + '&timeStampId=' + this.active.timeStampId+ '&isExp=' + this.active.isExp )
                    }
                }
            }
        }
    }
}
</script>

<style lang="css">
.portalWrap {
  background: white;
}
.portalWrap .title {
  padding: 3px 15px 3px 15px;
  overflow: hidden;
}
.portalWrap .title .left {
  display: inline-block;
  overflow: hidden;
  color: #222;
  height: 100%;
  position: relative;
}
.portalWrap .title .left span.text {
  font-size: 20px;
  font-weight: 700;
}
.portalWrap .title .right {
  overflow: hidden;
  color: #ccc;
}
.portalWrap .title .right > span {
  display: inline-block;
  float: left;
  line-height: 33px;
  font-size: 14px;
  color: #505050;
}
.portalWrap .title .right > span + img {
  float: right;
  height: 10px;
  width: 8px;
  margin-left: 4px;
  margin-top: 12px;
}

.portalActive {
  margin-bottom: 10px;
}
.portalActive .container {
  padding: 10px 15px 10px 15px;
}
.portalActive .container .active-list .active-wrap {
  width: 100%;
  position: relative;
}
.portalActive .container .active-list .active-wrap > img {
  width: 100%;
}
.portalActive .container .active-list .active-top {
  margin: 0px 0px 10px 0px;
}
.portalActive .container .active-list .active-top .active-top-left .active-top-head {
  width: 50px;
}
.portalActive .container .active-list .active-top .active-top-left .active-top-left-info {
  margin-left: 10px;
}
.portalActive .container .active-list .active-top .active-top-left .active-top-left-info .active-top-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 5px;
}
.portalActive .container .active-list .active-top .active-top-left .active-top-left-info .active-top-time {
  color: #888;
}
.portalActive .container .active-list .active-top .active-top-right {
  text-align: right;
}
.portalActive .container .active-list .active-top .active-top-right .active-top-statu span {
  padding: 2px 10px;
  border-radius: 20px;
  margin-bottom: 5px;
  display: inline-block;
}
.portalActive .container .active-list .active-top .active-top-right .active-top-statu .active0 {
  background: #299bf0;
  color: white;
}
.portalActive .container .active-list .active-content .active-content-img {
  width: 100%;
  border-radius: 5px;
}
.portalActive .container .active-list .active-content .active-content-title .active-title {
  font-size: 15px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #222;
}
.portalActive .container .active-list .active-content .active-content-text {
  color: #888;
  font-size: 15px;
  line-height: 26px;
}
.portalActive .container .active-list .active-bottom {
  color: #888;
  font-size: 14px;
}
.portalActive .container .active-list .active-bottom img {
  height: 12px;
  margin-right: 5px;
}
.portalActive .container .active-list .active-top-right,
.portalActive .container .active-list .active-price {
  color: #f95f70;
}
.portalActive .container .activeContainer {
  overflow: hidden;
}
.portalActive .container .activeContainer .left {
  float: left;
  width: 64px;
  height: 90px;
  border: 1px solid white;
}
.portalActive .container .activeContainer .left img {
  width: 100%;
  height: 100%;
}
.portalActive .container .activeContainer .right {
  width: calc(100% - 66px);
  padding-left: 10px;
  box-sizing: border-box;
  height: 90px;
  float: left;
}
.portalActive .container .activeContainer .right .active-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  height: 22px;
  max-width: 100%;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #333333;
  font-size: 16px;
  font-weight: 700;
}
.portalActive .container .activeContainer .right .active-time {
  height: 22px;
  line-height: 22px;
  margin-top: 2px;
}
.portalActive .container .activeContainer .right .active-place {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  height: 24px;
  max-width: 90%;
}
.portalActive .container .activeContainer .right .tag {
  float: left;
  margin-right: 5px;
  border-radius: 3px;
  height: auto;
  text-align: center;
  line-height: initial !important;
  display: inline-block;
  padding: 0px 1px;
  font-size: 10px !important;
}
.portalActive .container .activeContainer .right .tag img {
  width: 100%;
}
.portalActive .container .activeContainer .right .over {
  color: #999;
  border: 1px solid #999;
}
.portalActive .container .activeContainer .right .not-start {
  color: #00b94d;
  border: 1px solid #00b94d;
}
.portalActive .container .activeContainer .right .appointment-tag {
  color: #f6911d;
  border: 1px solid #f6911d;
}
.portalActive .container .activeContainer .right .manytimes {
  color: #299bf0;
  border: 1px solid #299bf0;
}
.portalActive .container .activeContainer .right .reserved {
  color: #f12f44;
  border: 1px solid #f12f44;
}
.portalActive .container .activeContainer .right .praise {
  height: 25px;
  max-width: 80px;
  padding: 5px;
  padding-top: 0px;
  position: absolute;
  bottom: 2px;
  right: 15px;
}
.portalActive .container .activeContainer .right .praise img {
  width: 15px;
  height: 15px;
  margin-bottom: -2px;
}
.portalActive .container .activeContainer .right .noPraise {
  color: #666666;
  font-size: 12px;
}
.portalActive .container .activeContainer .right .Praise {
  color: #2d9df0;
  font-size: 12px;
}
.portalActive .container .activeContainer .right .right-wrap {
  overflow: hidden;
}
.portalActive .container .activeContainer .right .right-wrap .right-wrap-left {
  float: left;
}
.portalActive .container .activeContainer .right .right-wrap .right-wrap-right {
  float: right;
}
.portalActive .container .activeContainer .right .right-wrap-right img {
  width: 15px;
  height: 15px;
  margin-bottom: -2px;
}
.portalActive .container .noActivityList {
  height: 60px;
  border-radius: 5px;
  border: 1px dashed #e6e6e6;
  position: relative;
  box-sizing: border-box;
  background: #f8f9fb;
  color: #505050;
  font-size: 15px;
}
.portalActive .container .noActivityList img {
  width: 16px;
  margin-right: 4px;
}
</style>`
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = portalActiveExternLinkComponent;
    } else {
        window.portalActiveExternLinkComponent = portalActiveExternLinkComponent;
    }
})();


// ; (function () {
//     var portalActiveExternLinkComponent =
//     ``
//     if (typeof module !== 'undefined' && typeof exports === 'object') {
//         module.exports = portalActiveExternLinkComponent;
//     } else {
//         window.portalActiveExternLinkComponent = portalActiveExternLinkComponent;
//     }
// })();