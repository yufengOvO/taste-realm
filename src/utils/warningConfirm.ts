/**
 * 现代化确认提示框
 */
import { ElMessageBox } from 'element-plus'

export default function warningConfirm(text: string) {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(text, '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'custom-message-box',
            confirmButtonClass: 'custom-confirm-btn',
            cancelButtonClass: 'custom-cancel-btn',
            distinguishCancelAndClose: true,
        }
        ).then(() => {
            resolve(true)
        }).catch(() => {
            reject(false)
        })
    }).catch(() => {
        return false;
    })
}
