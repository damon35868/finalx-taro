import { toast, useSystemInfo, useUserState } from '@finalx/common'
import '@finalx/components/dist/style.css'
import {
  getAccountInfoSync,
  hideLoading,
  login as miniProgramLogin,
  showLoading,
} from '@tarojs/taro'
import { useEffect } from 'react'
import { login } from './api/user'
import './app.scss'
// import { WSEvent } from './common/enums'
import '../global.config'

export default function App({ children }) {
  useSystemInfo()
  const { setUserState } = useUserState()

  useEffect(() => {
    ;(async function () {
      try {
        showLoading({ title: '数据加载中' })

        const res = await miniProgramLogin()
        if (!res.code) throw new Error()

        const { miniProgram } = getAccountInfoSync()
        const { appId } = miniProgram || {}

        const resp = await login({ appId, code: res.code })
        const { data: loginData } = resp || ({} as any)

        const { user: userInfo, token } = loginData || {}
        setUserState({ token, userInfo })

        // 订阅事件
        // wsClient.subscribe(WSEvent.User, {
        //   UserId: userInfo.id,
        // })
      } catch (e) {
        toast('登录失败，请重试')
      } finally {
        hideLoading()
      }
    })()
  }, [])

  return children
}
