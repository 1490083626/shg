// var tool = require('../../utils/commonUtil.js');
// import tool from "../../utils/commonUtil.js";
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //登录
  doLogin: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

    wx.login({
      success: function (res) {
        console.log(res)
        //获取登录的临时凭证
        var code = res.code;
        //调用后端，获取微信的session_key,secret
        wx.request({
          url: 'http://192.168.0.15:8090/wxLogin?code=' + code,
          method: "POST",
          success: function (result) {
            console.log(result);
            app.setGlobalUserInfo(e.detail.userInfo);
            wx.redirectTo({
              url: '../index/index'
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(tool)
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
  onPullDownRefresh: function (e) {
    
    // tool
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('d', arguments)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // onPageScroll: function aa(e) {
  //   console.log(arguments)
  //   console.log(aa)
  // },
  // onPageScroll: tool.throttle(function(e){
  //   console.log(e)
  // }, 1000)
  // onPageScroll: tool.throttle(function (msg) {
  //   this.setData({
  //     win_scrollTop: msg[0].scrollTop
  //   });
  // }),
})