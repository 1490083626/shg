const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentProduct: {},
    timeAgo: '',
    imgUrl: app.imgUrl,

    commentsList: [],
    placeholder: "说点什么...",

    commentsPage: 1,
    commentsTotalPage: 0,
    // 输入框是否获得焦点
    commentFocus: false,

    replyFatherCommentId: 1,
    replyToUserId: '',

    // 是否已收藏
    isCollect: false,

    // 富文本
    nodes: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    var that = this
    console.log('pD-data-currentProduct', params.currentProductId)
    wx.showLoading({
      title: '请求中...',
    })
    wx.request({
      url: app.serverUrl + 'useradmin/getproductbyid?productId=' + params.currentProductId,
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        console.log("currentProduct", res.data.product)
        wx.hideLoading()
        that.setData({
          currentProduct: res.data.product,
          timeAgo: res.data.timeAgo,
          nodes: res.data.product.productDesc
        })

        try {
          var currentProduct = wx.setStorageSync('currentProduct', res.data.product)
        } catch (e) {
          console.log('Error', e.toString())
        }

        that.getCommentsList(1)
        that.enteringIsCollect()
      }
    })

    wx.request({
      url: app.serverUrl + 'useradmin/updateProductPageView?productId=' + params.currentProductId,
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        console.log('updateProductPageView', res.data)
      }
    })

  },

  getWechat: function() {
    var data = wx.getStorageSync('currentProduct').contactWechat
    if(data != undefined && data != null) {
      wx.setClipboardData({
        data: data,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data) // data
            }
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '微信不存在哦！',
      })
    }
  },

  getPhone: function () {
    var phone = wx.getStorageSync('currentProduct').contactPhone
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '电话还没有哦！',
      })
    }

  },

  /**
   * 输入框失去焦点
   */
  inputBlur: function() {
    this.setData({
      commentFocus: false,
      placeholder: '说点什么...',
      replyFatherCommentId: 1,
      replyToUserId: '',
    })
  },

  /**
   * 收藏
   */
  enteringIsCollect: function() {
    var that = this
    var productId = this.data.currentProduct.productId
    var openId = wx.getStorageSync('openid')
    wx.request({
      url: app.serverUrl + 'useradmin/isCollect',
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      data: {
        openId: openId,
        productId: productId
      },
      success: function(res) {
        console.log("isCollect", res.data.isCollect)
        that.setData({
          isCollect: res.data.isCollect
        })
      }
    })
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
    var that = this
    var currentPage = that.data.commentsPage
    var totalPage = that.data.commentsTotalPage
    if (currentPage === totalPage) {
      return
    }
    var page = currentPage + 1
    that.getCommentsList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  leaveComment: function() {
    this.setData({
      commentFocus: true
    })
  },

  /**
   * 收藏
   */
  collect: function() {
    var that = this
    // console.log(this.data.currentProduct)
    // console.log(this.data.currentProduct.productId, this.data.currentProduct.owner.openId)
    var productId = this.data.currentProduct.productId
    var openId = wx.getStorageSync('openid')
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: app.serverUrl + 'useradmin/addCollect',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        // 'headerUserId': user.id,
        // 'headerUserToken': user.userToken
      },
      data: {
        openId: openId,
        productId: productId
      },
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        that.setData({
          isCollect: res.data.isCollect
        })
        wx.showToast({
          icon: 'none',
          title: '操作成功',
        })
      }
    })
  },

  /**
   * 回复时focus
   */
  replyFocus: function(e) {
    var fatherCommentId = e.currentTarget.dataset.fathercommentid
    var toUserId = e.currentTarget.dataset.touserid
    var toNickname = e.currentTarget.dataset.tonickname

    this.setData({
      placeholder: "回复  " + toNickname,
      replyFatherCommentId: fatherCommentId,
      replyToUserId: toUserId,
      commentFocus: true
    })
  },

  saveComment: function(e) {
    var that = this
    var content = e.detail.value

    // 获取评论回复的fatherCommentId和toUserId
    var fatherCommentId = e.currentTarget.dataset.replyfathercommentid
    var toUserId = e.currentTarget.dataset.replytouserid

    if (toUserId == '' || toUserId == undefined) {
      toUserId = this.data.currentProduct.owner.openId
    }

    //当前用户openId
    var openId = wx.getStorageSync('openid')
    console.log('openId', openId)
    // 商品
    var product = wx.getStorageSync('currentProduct')
    console.log(product)
    // var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo

    if (openId == null || openId == undefined || openId == '') {
      console.log('openId inexist')
      // wx.navigateTo({
      //   url: '../userLogin/login?redirectUrl=' + realUrl,
      // })
    } else {
      wx.showLoading({
        title: '请稍后...',
      })
      wx.request({
        url: app.serverUrl + 'useradmin/addComment?fatherCommentId=' + fatherCommentId + "&toUserId=" + toUserId,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值 
          // 'content-type': 'application/x-www-form-urlencoded', 
          // 'headerUserId': user.id,
          // 'headerUserToken': user.userToken
        },
        data: {
          fromUserId: openId,
          productId: product.productId,
          comment: content
        },
        success: function(res) {
          console.log(res.data)
          wx.hideLoading()

          that.setData({
            contentValue: "",
            commentsList: [],
            commentFocus: false
          })
          // 刷新
          that.getCommentsList(1)
        }
      })
    }
  },

  getCommentsList: function(pageIndex) {
    var that = this

    var currentProduct = wx.getStorageSync('currentProduct')
    var productId = currentProduct.productId
    console.log(productId)

    wx.request({
      url: app.serverUrl + 'useradmin/getCommentList?productId=' + productId + "&pageIndex=" + pageIndex + "&pageSize=5",
      method: "GET",
      success: function(res) {
        console.log(res.data)

        var commentsList = res.data.commentsList
        var newCommentsList = that.data.commentsList

        // 选取可用评论
        // commentsList = commentsList.filter((item, i) => {
        //   console.log('item', i)
        //   return item.enableStatus === 1
        // })
        commentsList.forEach(item => {
          if (item.enableStatus === 0) {
            item.comment = "<该留言已被屏蔽>"
          }
        })

        console.log('commentsList::', commentsList)

        //用户自己的留言不用回复自己
        for (var item of commentsList) {
          if (item.fromUserId == item.toUserId) {
            item.fromUserId = null
            item.toNickname = null
          }
        }
        that.setData({
          commentsList: newCommentsList.concat(commentsList),
          commentsPage: pageIndex,
          commentsTotalPage: res.data.count
        })
      }
    })
  },

  /**预览图片*/
  previewImage: function(e) {
    // console.log('previewImage', e)
    // wx.previewImage({
    //   current: e.currentTarget.id, // 当前显示图片的http链接
    //   urls: this.data.commentsList.productImgList // 需要预览的图片http链接列表
    // })
  }
})