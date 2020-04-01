//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.reLaunch({
            url: './pages/welcome/welcome',
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },

  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userinfo", user);
  },

  getGlobalUserInfo: function () {
    return wx.getStorageSync("userinfo");
  },
  getUserId: function () {
    let openId = wx.getStorageSync('openid')
    if (openId === undefined) {
      console.log('Error, OpenId is undefined')
      return
    }
    return openId
  },
  // serverUrl: 'https://wudiling.cn'
  serverUrl: 'http://localhost:8080/shg/'
})