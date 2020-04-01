// pages/sumit/sumit.js
Page({

  data: {
    img_arr: [],
    formdata: '',
  },
  formSubmit: function (e) {
    var id = e.target.id
    // var adds = e.detail.value;
    var adds = {};
    adds.productName = "加油！！！";
    // adds.program_id = app.jtappid
    // adds.openid = app._openid
    // adds.zx_info_id = this.data.zx_info_id
    console.log("adds",adds);
    this.upload(adds)
  },

  upload: function (adds) {
    var productStr = JSON.stringify(adds);
    console.log(productStr);
    var that = this
    for (var i = 0; i < this.data.img_arr.length; i++) {
      wx.uploadFile({
        url: 'http://localhost:8080/shg/useradmin/uploadImage',
        filePath: that.data.img_arr[i],
        name: 'productImg' + i,
        formData: { 'productStr': productStr},
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log('uploadFile', res)
          if (res.data.success) {
            wx.showToast({
              title: '已提交发布！',
              duration: 3000
            });
          } else {
            wx.showToast({
              title: '上传失败！',
              duration: 3000
            });
          }
        }
      })
    }
    this.setData({
      formdata: ''
    })
  },
  upimg: function () {
    var that = this;
    if (this.data.img_arr.length < 3) {
      wx.chooseImage({
        count: 3,  //最多可以选择的图片总数  
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res.tempFilePaths);
          console.log(that.data.img_arr);
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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