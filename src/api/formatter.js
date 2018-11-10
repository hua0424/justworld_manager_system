export function formatOperator(operatorId) {
    switch(operatorId){
        case "1": return "移动";
        case "2": return "联通";
        case "3": return "电信";
        default: return "未知";
    }

}

export function formatAiSmsJobStatus(code) {
    switch(code){
        case "1": return "初始";
        case "2": return "待发送";
        case "3": return "已发送";
        case "4": return "已送达";
        case "9": return "处理异常";
        default: return "未知";
    }
}

export function formatShortUrlHandleStatus(code) {
    switch(code){
        case "1": return "未生成";
        case "2": return "已生成";
        default: return "未知";
    }
}

export function formatPhoneHandleStatus(code) {
    switch(code){
        case "1": return "未识别";
        case "2": return "已识别";
        default: return "未知";
    }
}
