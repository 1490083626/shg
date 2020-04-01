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
      // ajax.request({
      //   method: "POST",
      //   url: "member",
      //   data: {
      //     id: memberid,
      //     nickname: userInfo.nickName,
      //     headimgurl: userInfo.avatarUrl,
      //     city: userInfo.city,
      //     country: userInfo.country,
      //     sex: userInfo.gender
      //   },
      //   success: (res) => {
      //     console.log(res)
      //   }
      // })
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