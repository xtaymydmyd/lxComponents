
import common from 'assets/js/global.js'
const selectMethod = {
    /**
     * 设置参数并跳转到
    */
    toSelect(param) {
        var queryStr = ''
        for (var key in param) {
            if (key == 'userList') {
                common.sessionSet('selectionStaffUserListEdit', param[key])
            } else if (key == 'deptIdList') {
                common.sessionSet('selectionStaffDeptIdList', param[key])
            } else {
                if (typeof (param[key]) != 'object') {
                    queryStr += key + '=' + param[key] + '&'
                } else if (typeof (param[key]) == 'object') {
                    for (var i = 0; i < param[key].length; i++) {
                        queryStr += key + '=' + param[key][i] + '&'
                    }
                }
            }
        }
        window.location.href = 'selector.html#/index?' + queryStr
    },
    setUserList(list) {
        common.sessionSet('selectionStaffUserListEdit', list)
    },
    /**
     * 判断是否从选择人员页面
    */
    isFromSelectStaff() {
        var flag = common.sessionGet('selectionStaffFlag')
        sessionStorage.removeItem('selectionStaffFlag')
        return flag
    },
    /**
     * 获取结果
    */
    getResult() {
        var withUser = common.sessionGet('withUser')
        var result
        if (withUser == '1') {
            result = common.sessionGet('selectionStaffUserList')
            sessionStorage.removeItem('selectionStaffUserList')
            return result
        } else {
            result = common.sessionGet('selectionStaffDeptList')
            sessionStorage.removeItem('selectionStaffDeptList')
            return result
        }
    }
}

export default selectMethod