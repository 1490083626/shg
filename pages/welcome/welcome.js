const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultText: '欢迎使用',
    defaultButton: '开始使用'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 是否授权
  getUserInfoTap(event) {
    // 点击同意
    if (event.detail.userInfo) {
      app.globalData.userInfo = event.detail.userInfo
      let userInfo = app.globalData.userInfo
      let memberid = app.globalData.memberid
      this.goRegistPage()
      wx.reLaunch({
        url: '../shg/shg',
      })
    } else {
      this.setData({
        defaultText: '为保证您的正常使用,请进行授权!',
        defaultButton: '重新授权'
      })
    }
  },

  // 注册
  goRegistPage: function () {
    var that = this
    wx.login({
      success: loginRes => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(loginRes)
        wx.getUserInfo({
          success: res => {
            res.code = loginRes.code
            console.log('userinfo', res.rawData)
            // 保存用户信息
            wx.setStorageSync('userinfo', res.rawData)
            // 可以将 res 发送给后台解码出 unionId
            wx.request({
              url: app.serverUrl + 'wechat/login/save',
              method: "POST",
              data: res,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log("requestRes", res);
                console.log(res.header);
                wx.removeStorageSync('sessionid') //必须先清除，否则res.header['Set-Cookie']会报错
                wx.removeStorageSync('openid')
                // 登录成功，获取第一次的sessionid,存储起来
                // 注意：Set-Cookie（开发者工具中调试全部小写）（远程调试和线上首字母大写）
                wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
                wx.setStorageSync("openid", res.data.openId);
                if (res.data.status == 200) {
                  // 登录成功跳转 
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000
                  });
                  // app.userInfo = res.data.data;
                  // fixme 修改原有的全局对象为本地缓存
                  // app.setGlobalUserInfo(res.data.data);
                  // 页面跳转

                } else if (res.data.status == 500) {
                  // 失败弹出框
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                  })
                }
              }
            })
            // console.log(app.globalData)
            // this.globalData.userInfo = res.userInfo

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})