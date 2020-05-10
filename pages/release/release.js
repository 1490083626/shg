var MCAP = require('../../utils/mcaptcha.js');
const app = getApp()
Page({
  data: {
    product: {},
    formdata: '',
    codeStr: '', //生成的验证码
    code: '', //输入的验证码
    files: [], //图片
    inputValue: '',
    indexArea: 0,
    indexCategory: 0,
    imgUrl: app.imgUrl,

    //表单placeholder
    productName: '',
    listArea: {},
    listProductCategory: {},
    normalPrice: '',
    promotionPrice: '',
    linkman: '',
    contactPhone: '',
    contactWechat: '',
    productDesc: '',
    imgArr: [],

    //是否是编辑状态，不然是新发布
    isEdit: false,
    editProductId: 0
  },

  linkTo: function() {
    wx.navigateTo({
      url: '../shg/shg',
    })
  },

  toReleaseNewProduct: function() {
    var productId = wx.getStorageSync('editProductId')
    if (productId != null && productId != '') {
      wx.removeStorageSync('editProductId')
      wx.setStorageSync('isSameEditProductId', false)
    }
    this.setData({
      // 重置编辑商品id
      editProductId: 0,

      isEdit: false,
      productName: '',
      // listArea: {},
      // listProductCategory: {},
      normalPrice: '',
      promotionPrice: '',
      linkman: '',
      contactPhone: '',
      contactWechat: '',
      productDesc: '',
      imgArr: [],
    })

  },

  bindPickerChangeArea: function(e) {
    console.log('AreaPicker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexArea: e.detail.value
    })
  },
  bindPickerChangeCategory: function(e) {
    console.log('CategoryPicker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexCategory: e.detail.value
    })
  },
  // 获取区域列表
  getArea: function(e) {
    var that = this;
    // console.log(e.detail)
    wx.request({
      method: "GET",
      url: app.serverUrl + "superadmin/listarea",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // console.log(res.data.rows);
        that.setData({
          listArea: res.data.rows
        })
      }
    })
  },
  // 获取分类列表
  getProductCategory: function(e) {
    var that = this;
    // console.log(e.detail)
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      method: "GET",
      url: app.serverUrl + "useradmin/getproductcategorylist",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data)
        wx.hideLoading()
        that.setData({
          listProductCategory: res.data.data
        })

      }
    })
  },
  //提交表单
  formSubmit: function(e) {
    var that = this;
    console.log('输入的验证码为：' + this.data.code.toUpperCase());
    console.log('实际的验证码为：' + this.data.codeStr.toUpperCase());
    console.log(e.detail.value.productName)
    if (e.detail.value.productName == '') {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (e.detail.value.promotionPrice == '') {
      wx.showToast({
        title: '请输入商品价格',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (e.detail.value.linkman == '') {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (e.detail.value.contactPhone == '' && e.detail.value.contactPhone == '') {
      wx.showToast({
        title: '联系电话、微信至少填一个哦',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.code.toUpperCase() == this.data.codeStr.toUpperCase() && e.detail.value.productName != '') {
      console.log("true");
      console.log(e.detail.value);

      // var product = e.detail.value;
      var product = {};
      product.productName = e.detail.value.productName;
      product.productDesc = e.detail.value.productDesc;
      product.normalPrice = e.detail.value.normalPrice;
      product.promotionPrice = e.detail.value.promotionPrice;
      product.linkman = e.detail.value.linkman;
      product.contactPhone = e.detail.value.contactPhone;
      product.contactWechat = e.detail.value.contactWechat;
      product.productCategory = {
        productCategoryId: e.detail.value.productCategoryId
      };
      product.area = {
        areaId: e.detail.value.areaId
      };

      // 编辑状态上传productId
      var productId = wx.getStorageSync('editProductId')
      if (productId != null && productId != '') {
        product.productId = productId
      }

      console.log("productStr", productStr)
      var productStr = JSON.stringify(product)

      console.log("productStr", productStr)

      //开始上传
      this.upload(productStr)
    } else {
      wx.showToast({
        title: '验证码有误！',
        icon: 'none',
        duration: 2000
      })
      that.initDraw()
      console.log(false);
    }

  },

  /**
   * 表单上传,向后台提交
   */
  upload: function(productStrParam) {
    var productStr = productStrParam;
    console.log(productStr);
    var that = this;
    var imgLength = this.data.imgArr.length;

    if (imgLength <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请至少选择一张图片！',
      })
      return
    }
    var openId = wx.getStorageSync('openid')
    if (openId == undefined) {
      console.log('Error, openId id undefined')
    }
    wx.showLoading({
      title: '上传中',
    })

    var realUrl = '';
    if (this.data.isEdit) {
      realUrl = 'useradmin/modifyProduction'
    } else {
      realUrl = 'useradmin/uploadProduction'
    }
    for (var i = 0; i < imgLength; i++) {
      wx.uploadFile({
        url: app.serverUrl + realUrl,
        filePath: that.data.imgArr[i],
        name: 'productImg' + i,
        formData: {
          'productStr': productStr,
          'imgLength': imgLength,
          'openId': openId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': wx.getStorageSync("sessionid")
          //读取sessionid,当作cookie传入后台做session_id使用
        },
        success: function(res) {
          console.log('uploadResponse', res)
          if (res.statusCode === 200) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '已提交发布',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setData({
                    formdata: ''
                  })
                  that.initDraw()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  that.setData({
                    formdata: ''
                  })
                  that.initDraw()
                }
              }
            })

            //更新状态
            that.toReleaseNewProduct()
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '发布失败',
              icon: 'none'
            })
          }
        }
      })
    }

  },

  //图片上传
  upimg: function() {
    var that = this;
    if (this.data.imgArr.length < 5) {
      wx.chooseImage({
        count: 5, //最多可以选择的图片总数  
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log(res.tempFilePaths);
          console.log(that.data.imgArr);
          that.setData({
            imgArr: that.data.imgArr.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传五张图片',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**预览图片*/
  previewImage: function(e) {
    console.log('previewImage', e)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imgArr // 需要预览的图片http链接列表
    })
  },
  /**图片删除*/
  deleteImage: function(e) {
    var that = this;
    var imgArr = that.data.imgArr;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    console.log('deleteImage', e)
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          imgArr.splice(index, 1);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          imgArr,
          // isCanAddFile: true
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log('release-options', options)

    // 如果是编辑商品则返回该商品数据
    // this.getEditProduct()

    // 生成验证码
    that.initDraw();
    that.getArea();
    that.getProductCategory();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow start...')
    // onShow函数会在页面显示时调用，上传图片也会触发该事件，因此，上传图片时记录上一次 editProductId 
    // editProductId相同则则不return， 不同则刷新
    var editProductId = wx.getStorageSync('editProductId')
    if (editProductId === this.data.editProductId) return
    this.setData({
      editProductId: editProductId
    })
    var isSameEditProductId = wx.getStorageSync('isSameEditProductId')
    if (isSameEditProductId) {
      return
    } else {
      this.getEditProduct()
    }

    console.log('onShow end...')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // this.setData({
    //   isEdit: false
    // })
    // wx.removeStorageSync('editProductId')
    // console.log(this.data.isEdit)
  },

  getEditProduct: function() {
    var that = this
    var editProductId = wx.getStorageSync('editProductId')
    if (editProductId != null && editProductId != '') {
      console.log("edit is true", editProductId)
      //获取商品信息
      wx.showLoading({
        title: '请求中...',
      })
      wx.request({
        method: "GET",
        url: app.serverUrl + 'useradmin/getproductbyid',
        data: {
          productId: editProductId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res.data.product)
          var product = res.data.product
          wx.hideLoading();
          if (res.statusCode == 200) {
            //图片转换
            var editImgArr = []
            var productImgList = product.productImgList
            for (var item of productImgList) {

              editImgArr.push(that.data.imgUrl + item.imgAddr)
            }
            console.log(product.areaId)
            that.setData({
              product: product,
              productName: product.productName,
              indexArea: product.area.areaId,
              indexCategory: product.productCategory.productCategoryId,
              normalPrice: product.normalPrice,
              promotionPrice: product.promotionPrice,
              linkman: product.linkman,
              contactPhone: product.contactPhone,
              contactWechat: product.contactWechat,
              productDesc: product.productDesc,
              imgArr: editImgArr
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
      this.setData({
        isEdit: true
      })
      // wx.removeStorageSync('editProductId')
    } else {
      return
    }
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
  changeImg: function() {
    this.initDraw();
  },
  /**
   * 图片验证码绑定变量 
   */
  bindCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 获取随机数
   */
  getRanNum: function() {
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
   * 手机号验证
   */
  blurPhone: function(e) {
    var phone = e.detail.value
    let that = this
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      console.log('验证成功')
    }
  }
})