const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    listProduct:[],
    count: 0,
    // imgUrl:'https://wudiling.cn/pic.png'
    imgUrl: '../../images/',
    // imgUrl2:'upload/item/user/1/2019092415204080282.jpg',
    imgUrl3: '../../images/upload/item/user/1/2019092415204080282.jpg',
    realtimeSearchText: [],
    searchPlaceHolder: '搜索',
    productCategoryId: -1
  },
  /**
   * 搜索
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    })
  },
  inputTyping: function (e) {
    var that = this
    console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value
    })
    wx.request({
      url: 'http://suggest.taobao.com/sug?area=etao&code=utf-8&callback=KISSY.Suggest.callback&q=' + e.detail.value,
      // url: 'http://suggest.taobao.com/sug?area=etao&code=utf-8&callback=KISSY.Suggest.callback&q=设计',
      dataType: 'jsonp',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        // wx.hideLoading()

        var arr = (res.data).match(/\{(.*)\}/g)
        if (arr != null && Array.isArray(arr) && arr.length > 0) {
          var realtimeSearchText = JSON.parse(arr)
          console.log(realtimeSearchText.result)
          that.setData({
            realtimeSearchText: realtimeSearchText.result
          })
        }
        
      }
    })
    
  },
  search:function(e){
    var that = this
    if (e.detail){
      if (e.detail.value) {
        var productName = e.detail.value
      } else if (e.detail.productCategoryId) {
        var productCategoryId = e.detail.productCategoryId
      }
      console.log("search-text", e)
      that.setData({
        realtimeSearchText: []
      })
      wx.showLoading({
        title: '搜索中...',
      })
      wx.request({
        method: "GET",
        // url: app.serverUrl + "frontend/listproducts?pageIndex=1&pageSize=10&productName=" + e.detail.value,
        url: app.serverUrl + "frontend/listproducts?pageIndex=1&pageSize=10",
        data: {
          productName: productName,
          productCategoryId: productCategoryId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          wx.hideLoading()
          // wx.showToast({
          //   title: '请求成功',
          //   duration: 2000
          // })
          that.setData({
            listProduct: res.data.productList,
            count: res.data.count
          })

        }
      })
    }
  },

  changeSearch: function (e) {
    // console.log("changeSearch", e.currentTarget.dataset.text)
    this.setData({
      inputVal: e.currentTarget.dataset.text
    })
    var obj = {
      detail : {
        value: e.currentTarget.dataset.text
      }
    }
    // obj.detail.value = e.currentTarget.dataset.text

    this.search(obj)

  },

  byHot:function(e){
    console.log(this.data.inputVal)
    var that = this
    if (this.data.inputVal == '' || this.data.inputVal || this.data.productCategoryId > 0) {
      console.log(e.detail.value)
      wx.request({
        method: "GET",
        url: app.serverUrl + "frontend/listproductsbyhot?pageIndex=1&pageSize=10&productName=" + this.data.inputVal,
        data: {
          productCategoryId: this.data.productCategoryId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)

          that.setData({
            listProduct: res.data.productList,
            count: re.data.count
          })

        }
      })
    }
  },
  
  byTime: function (e) {
    console.log(e)
    console.log(this.data.inputVal)
    var that = this
    if (this.data.inputVal == '' || this.data.inputVal || this.data.productCategoryId > 0) {
      console.log(e.detail.value)
      wx.request({
        method: "GET",
        url: app.serverUrl + "frontend/listproductsbytime?pageIndex=1&pageSize=10&productName=" + this.data.inputVal,
        data: {
          productCategoryId: this.data.productCategoryId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)

          that.setData({
            listProduct: res.data.productList,
            count: res.data.count
          })

        }
      })
    }

  },  

  byComment: function (e) {
    console.log(e)
    console.log(this.data.inputVal)
    var that = this
    if (this.data.inputVal == '' || this.data.inputVal || this.data.productCategoryId > 0) {
      console.log(e.detail.value)
      wx.request({
        method: "GET",
        url: app.serverUrl + "frontend/listproductsbycomment?pageIndex=1&pageSize=10&productName=" + this.data.inputVal,
        data: {
          productCategoryId: this.data.productCategoryId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          // wx.showToast({
          //   title: '请求成功',
          //   duration: 2000
          // })
          that.setData({
            listProduct: res.data.productList,
            count: res.data.count
          })

        }
      })
    }

  }, 

  /**
 * 跳转商品详情页
 */
  toProductDetail: function (e) {
    console.log("data-currentProduct", e.currentTarget.dataset.currentproduct.productId);
    wx.setStorageSync('currentProduct', e.currentTarget.dataset.currentproduct)
    wx.navigateTo({
      url: '../productDetails/productDetails?currentProductId=' + e.currentTarget.dataset.currentproduct.productId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cn)
    var obj = {
      detail: {
        category: options.cn,
        productCategoryId: options.ci
      }
    }
    this.setData({
      searchPlaceHolder: options.cn,
      productCategoryId: options.ci
    })
    this.search(obj)
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