const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentsList: {},
    commentsListRead: {},
    imgUrl: '../../images/',
    read: false
  },

  /**
 * 跳转商品详情页
 */
  toProductDetail: function (e) {
    var that = this
    console.log("toProductId", e.currentTarget.dataset.productid)
    
    console.log("commentId", e.currentTarget.dataset.commentid)

    wx.request({
      url: app.serverUrl + 'useradmin/upadteUnreadComment?commentId=' + e.currentTarget.dataset.commentid,
      method: "POST",
      success: function (res) {
        console.log('......', res.data)
      }
    })
    wx.navigateTo({
      url: '../productDetails/productDetails?currentProductId=' + e.currentTarget.dataset.productid,
    })

    setTimeout(that.getUnreadCommnets, 1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUnreadCommnets()
  },

  getUnreadCommnets:function () {
    this.setData({
      read: false
    })
    var that = this
    var openId = wx.getStorageSync('openid')

    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: app.serverUrl + 'useradmin/getUnreadComments?openId=' + openId,
      method: "GET",
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        var commentsList = res.data.commentsList
        that.setData({
          commentsList: commentsList
        })
      }
    })

  },

  getReadCommnets: function () {
    this.setData({
      read: true
    })
    var that = this
    var openId = wx.getStorageSync('openid')

    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: app.serverUrl + 'useradmin/getReadComments?openId=' + openId,
      method: "GET",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        var commentsList = res.data.commentsList
        that.setData({
          commentsListRead: commentsList
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
    // this.getUnreadCommnets()
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