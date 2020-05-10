//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: false, //false：发布状态 ， true：收藏状态
    listProduct: [],
    imgUrl: app.imgUrl,
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.getMyProducts(1)
  },

  // 删除
  deleteProduct: function (e) {
    console.log('deleteProduct:', e)
    var that = this
    var productId = e.currentTarget.dataset.productid //获取当前长按商品id
    // console.log('deleteProduct:', productId)
    var openId = app.getUserId()
    var content = ''
    var url = ''
    var contentType = ''

    if (!that.data.flag) {
      content = '确定要删除此商品吗？'
      url = 'useradmin/updateProductEnableStatus'
      contentType = 'application/x-www-form-urlencoded'
    } else {
      content = '确定要移除此商品吗？'
      url = 'useradmin/addCollect'
      contentType = 'application/json'
    }
    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            method: 'POST',
            url: app.serverUrl + url,
            data: {
              openId: openId,
              productId: productId,
              deleteProduct: true
            },
            header: {
              'content-type': contentType
            },
            success: function (res) {
              if (res.data.success) {
                if(!that.data.flag) {
                  that.getMyProducts(1)
                } else {
                  that.getMyCollects()
                }
              }
            }
          })
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          // imgArr,
          // isCanAddFile: true
        })
      }
    })
  },

  /**
   * 上下架
   */
  sell: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.currentproduct.productId)
    var openId = app.getUserId()

    wx.request({
      method: 'POST',
      url: app.serverUrl + 'useradmin/updateProductEnableStatus',
      data: {
        openId: openId,
        productId: e.currentTarget.dataset.currentproduct.productId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.success) {
          that.getMyProducts(1)
        }
      }
    })
  },

  /**
   * 编辑商品
   */
  editProduct: function (e) {
    console.log("data-currentProductId", e.currentTarget.dataset.currentproduct.productId)
    var editProductId = wx.getStorageSync('editProductId')
    var currentEditProductId = e.currentTarget.dataset.currentproduct.productId
    if (editProductId != null && editProductId != '' && editProductId === currentEditProductId) {
      wx.setStorageSync('isSameEditProductId', true)
    } else {
      wx.setStorageSync('isSameEditProductId', false)
    }
    wx.setStorageSync('editProductId', currentEditProductId)

    wx.switchTab({
      url: '../release/release',
      fail: function (e) {
        console.log(e)
      }
    })
  },

  /**
   * 我发布的商品
   */
  getMyProducts: function (pageIndex) {
    var that = this
    var openId = wx.getStorageSync('openid')
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      method: "GET",
      url: app.serverUrl + 'useradmin/getproductlist?pageIndex=' + pageIndex + '&pageSize=99',
      data: {
        openId: openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.productList)
        var productList = res.data.productList
        wx.hideLoading();
        if (res.statusCode == 200) {
          that.setData({
            listProduct: productList,
          })
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },

  /**
   * 我的收藏
   */
  getMyCollects: function () {
    var that = this
    var openId = wx.getStorageSync('openid')
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      method: "GET",
      url: app.serverUrl + 'useradmin/getproductlistByCollect?pageIndex=' + 1 + '&pageSize=99',
      data: {
        openId: openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.productList)
        var productList = res.data.productList
        wx.hideLoading();
        if (res.statusCode == 200) {
          that.setData({
            listProduct: productList,
          })
        } else {
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 我的发布
   */
  mySale: function(e) {
    this.setData({
      flag: false
    })
    this.getMyProducts(1)
  },
  myCollect:function (e) {
    this.setData({
      flag: true
    })
    this.getMyCollects()
  },

  /**
 * 跳转商品详情页
 */
  toProductDetail: function (e) {
    wx.setStorageSync('currentProduct', e.currentTarget.dataset.currentproduct)
    wx.navigateTo({
      url: '../productDetails/productDetails?currentProductId=' + e.currentTarget.dataset.currentproduct.productId,
    })
  }
})
