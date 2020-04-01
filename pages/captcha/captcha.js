var MCAP = require('../../utils/mcaptcha.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeStr: '', //生成的验证码
    code: '', //输入的验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.initDraw(); //生成验证码

  },
  /**
   * 制作验证码
   */
  initDraw() {
    var that = this;
    var codes = that.getRanNum();
    that.setData({
      codeStr: codes //生成的验证码
    })
    new MCAP({
      el: 'canvas',
      width: 120,
      height: 40,
      code: codes
    });
  },
  /**
  * 更换验证码
  */
  changeImg: function () {
    this.initDraw();
  },
  /**
  * 图片验证码绑定变量 
  */
  bindCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 点击提交触发
   */
  saves: function () {
    console.log('输入的验证码为：' + this.data.code)
    console.log('实际的验证码为：' + this.data.codeStr)
    if (this.data.code == this.data.codeStr){
      console.log("true");
    }else{
      wx.showToast({
        title: '你棒棒哒！！！',
      })
      console.log(false);
    }
  },
  /**
   * 获取随机数
   */
  getRanNum: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var pwd = '';
    for (var i = 0; i < 4; i++) {
      if (Math.random() < 48) {
        pwd += chars.charAt(Math.random() * 48 - 1);
      }
    }
    return pwd;
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