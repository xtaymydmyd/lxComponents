import Vue from 'vue'

export default (function() {
    Vue.filter('fileLink', function(value) {
        const link = window.imgUrl + value
        return link
    })

    Vue.filter('numToString', function(value) {
        const string = value.toString()
        return string
    })

    Vue.filter('time', function(value) {
        moment.locale('ch')
        let day = moment.unix(value)
        let date = moment(day).format('YYYY/MM/DD H:mm')
        return date
    })
    Vue.filter('date', function(value) {
        let day = moment(value)
        let date = moment(day).format('YYYY/MM/DD')
        return date
    })
    Vue.filter('week', function(value) {
        let day = moment(value)
        let date = moment(day).format('ddd')
        return date
    })
    Vue.filter('day', function(value) {
        let day = moment(value)
        let date = moment(day).format('D')
        return date
    })
    Vue.filter('month', function(value) {
        let day = moment(value)
        let date = moment(day).format('M')
        return date
    })
    Vue.filter('dateM', function(value) {
        let day = moment(value)
        let date = moment(day).format('YYYY-MM-DD HH:mm:SS')
        return date
    })
    Vue.filter('dateYM', function(value) {
        let day = moment(value)
        let date = moment(day).format('YYYY年MM月DD')
        return date
    })
    Vue.filter('relativeTime', function(value) {
        let day = moment(value)
        let date = moment(day).format('YYYY-MM-DD HH:mm:SS')
        var relativeTime = moment(date, 'YYYY-MM-DD HH:mm:SS').fromNow()
        return relativeTime
    })
    Vue.filter('abstract', function(value) {
        let abstract = ''
        if (value.length > 70) {
            abstract = value.substr(0, 70) + '...'
        } else {
            abstract = value
        }
        return abstract
    })

    /**
     * 一卡通有效期
     */
    Vue.filter('card_yxq_time', function(value) {
        let day = moment(value)
        let date = moment(day).format('YYYY/MM/DD')
        return date
    })
        /**
         * 时间格式转化YYYY-MM-DD
         */
    Vue.filter('date_format', function(value) {
        let day = moment(value)
        let date = moment(day).format('YYYY-MM-DD')
        return date
    })
    Vue.filter('dateTime_format', function(value) {
        let day = moment(value)
        let date = moment(day).format('YYYY-MM-DD HH:mm')
        return date
    })
        /**
         * 一卡通卡号
         */
    Vue.filter('onecard_no', function(value) {
        var str = ''
        var trimStr = ''
        if (!value || value == '' || value == undefined) {
            return str
        }
        if (value.length >= 4) {
            str += value.substring(0, 4) + ' '
            trimStr += value.substring(0, 4)
        } else {
            str += value.substring(trimStr.length, value.length)
            return str
        }
        if (value.length >= 8) {
            str += value.substring(4, 8) + ' '
            trimStr += value.substring(4, 8)
        } else {
            str += value.substring(trimStr.length, value.length)
            return str
        }
        if (value.length >= 12) {
            str += value.substring(8, 12) + ' '
            trimStr += value.substring(8, 12)
        } else {
            str += value.substring(trimStr.length, value.length)
            return str
        }
        if (value.length >= 16) {
            str += value.substring(12, 16) + ' '
        } else {
            str += value.substring(trimStr.length, value.length)
            return str
        }
        return str
    })
        /**
         * 图片显示，http格式 和 id格式
         */
    Vue.filter('format_img', function(str) {
        if (str == null || str == '') {
            return null
        }
        var s = ''
        var indexOf = str.indexOf('http', 0)
        if (indexOf == -1) {
            s = constGlobal.HostSelfRepair + 'source/file?fileId=' + str
        } else {
            s = str
        }
        return s
    })
        /**
         *时间戳转换为时间
         */
    Vue.filter('time_stamp_conversion', (time, num) => {
        let unixTimestamp = new Date(time)
        let normalTime
        if (num == 1) {
            normalTime = (unixTimestamp.getHours() < 10 ? '0' + unixTimestamp.getHours() : unixTimestamp.getHours()) + ':' + (unixTimestamp.getMinutes() < 10 ? '0' + unixTimestamp.getMinutes() : unixTimestamp.getMinutes()) + ':00'
        } else if (num == 2) {
            normalTime = unixTimestamp.getFullYear() + '-' + (Number(unixTimestamp.getMonth()) + 1) + '-' + unixTimestamp.getDate() + '  ' +
                (unixTimestamp.getHours() < 10 ? '0' + unixTimestamp.getHours() : unixTimestamp.getHours()) + ':' + (unixTimestamp.getMinutes() < 10 ? '0' + unixTimestamp.getMinutes() : unixTimestamp.getMinutes())
        }
        return normalTime
    })
})()