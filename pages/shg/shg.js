import tool from "../../utils/commonUtil.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品列表
    listProduct: [],
    listProductStatus: 0, // 0：默认商品 1：最新商品 2：热门商品
    imgUrl: app.imgUrl,

    searchPlaceHolder: '搜索',

    //分类
    grids: [{
        productCategoryId: 1,
        categoryName: '生活用品',
      url: '../../images/l_life.png'
      },
      {
        productCategoryId: 3,
        categoryName: '体育用品',
        url: '../../images/l_play.png'
      },
      {
        productCategoryId: 4,
        categoryName: '电子数码',
        url: '../../images/l_e.png'
      },
      {
        productCategoryId: 5,
        categoryName: '书籍',
        url: '../../images/e_book.png'
      },
      {
        productCategoryId: 6,
        categoryName: '衣服饰品',
        url: '../../images/l_cloth.png'
      },
      {
        productCategoryId: 7,
        categoryName: '其它',
        url: '../../images/l_other.png'
      },
    ],
    categoryName: ['生活用品', '体育用品', '电子数码', '书籍', '衣服饰品', '其它'],
    // 轮播
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    // 分页
    productsPage: 1, //页码
    productsTotalPage: 0, //每页的商品数

    // false:最新商品, true:热门商品
    flag: false,
    // top标签显示（默认不显示）
    backTopValue: false,

    // 节流
    startTime: 0,
    scrollTop: 0,
  },

  /**
   * 监听滚动条坐标
   */
  onPageScroll: tool.throttle(function(args) {
    // console.log(args)
    var scrollTop = args[0].scrollTop
    var backTopValue = scrollTop > 1800 ? true : false
    this.setData({
      scrollTop: scrollTop,
      backTopValue: backTopValue
    })
    // console.log(this.data.backTopValue)
  }, 1000),

  /**
   * 滚动到顶部
   */
  backTop: function() {
    this.setData({
      backTopValue: false
    })
    console.log('???', this.data.backTopValue)
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })

  },

  /**
   * 前往搜索页
   */
  goToSearch: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../search/search',
    })
  },

  /**
   * 获取商品列表
   * page: 页码
   */
  getProductList: function(pageIndex) {
    var that = this
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      method: "GET",
      url: app.serverUrl + 'useradmin/getproductlist?pageIndex=' + pageIndex + '&pageSize=10',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var productList = res.data.productList
        var newproductList = that.data.listProduct
        console.log(res);
        wx.hideLoading();
        if (res.statusCode == 200) {
          that.setData({
            listProductStatus: 0,
            listProduct: newproductList.concat(productList),
            productsPage: pageIndex,
            productsTotalPage: res.data.count
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
   * 获取最新商品
   */
  byTime: function(args) {
    this.setData({
      flag: false
    })
    console.log(args)
    if (typeof(args) === "object") {
      var pageIndex = 1
    } else {
      var pageIndex = args
    }
    if (this.data.listProductStatus != 1) {
      this.setData({
        productsPage: 1
      })
    }
    var that = this
    wx.request({
      method: "GET",
      url: app.serverUrl + "frontend/listproductsbytime?pageIndex=" + pageIndex + "&pageSize=10",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // 初始化
        if (that.data.listProductStatus != 1) {
          that.setData({
            listProduct: []
          })
        }
        var productList = res.data.productList
        var newproductList = that.data.listProduct
        console.log(res);
        wx.hideLoading();
        if (res.statusCode == 200) {
          that.setData({
            listProductStatus: 1,
            listProduct: newproductList.concat(productList),
            productsPage: pageIndex,
            productsTotalPage: res.data.count
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
   * 按热度
   */
  byComment: function(args) {
    this.setData({
      flag: true
    })
    if (typeof(args) === "object") {
      var pageIndex = 1
    } else {
      var pageIndex = args
    }
    if (this.data.listProductStatus != 2) {
      this.setData({
        productsPage: 1
      })
    }

    var that = this
    wx.request({
      method: "GET",
      url: app.serverUrl + "frontend/listproductsbycomment?pageIndex=" + pageIndex + "&pageSize=10",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // 初始化
        if (that.data.listProductStatus != 2) {
          that.setData({
            listProduct: []
          })
        }
        var productList = res.data.productList
        var newproductList = that.data.listProduct
        console.log(res);
        wx.hideLoading();
        if (res.statusCode == 200) {
          that.setData({
            listProductStatus: 2,
            listProduct: newproductList.concat(productList),
            productsPage: pageIndex,
            productsTotalPage: res.data.count
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '请求中'
    })
    var that = this;
    if (options) {
      // 初始化商品列表
      that.byTime(1)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var currentPage = this.data.productsPage
    var totalPage = this.data.productsTotalPage
    if (currentPage === totalPage) {
      return
    }
    var page = currentPage + 1

    switch (this.data.listProductStatus) {
      case 1:
        this.byTime(page)
        break;
      case 2:
        this.byComment(page)
        break;
      default:
        this.getProductList(page)
    }
  },

  /**
   * 跳转商品详情页
   */
  toProductDetail: function(e) {
    console.log("data-currentProduct", e.currentTarget.dataset.currentproduct.productId);
    wx.setStorageSync('currentProduct', e.currentTarget.dataset.currentproduct)
    wx.navigateTo({
      url: '../productDetails/productDetails?currentProductId=' + e.currentTarget.dataset.currentproduct.productId,
    })
  }
})