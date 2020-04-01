const app = getApp()

Page({
  data: {
  },

  onLoad: function (params) {
    var me = this;
    var redirectUrl = params.redirectUrl;
    // debugger;
    if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '')     {
      redirectUrl = redirectUrl.replace(/#/g, "?");
      redirectUrl = redirectUrl.replace(/@/g, "=");

      me.redirectUrl = redirectUrl;
    }
  },

  // 登录  
  doLogin: function (e) {
    var me = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    // 简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      console.log('app',app)
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待...',
      });
      // 调用后端
      wx.request({
        url: serverUrl + '/login',
        method: "POST",
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          if (res.data.status == 200) {
            // 登录成功跳转 
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
            // app.userInfo = res.data.data;
            // fixme 修改原有的全局对象为本地缓存
            app.setGlobalUserInfo(res.data.data);
            // 页面跳转

            var redirectUrl = me.redirectUrl;
            if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
              wx.redirectTo({
                url: redirectUrl,
              })
            } else {
              wx.redirectTo({
                url: '../mine/mine',
              })
            }
            
          } else if (res.data.status == 500) {
            // 失败弹出框
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
  //注册
  goRegistPage:function() {
    // wx.redirectTo({
    //   url: '../userRegist/regist',
    // })
    var that = this
    wx.login({
      success: loginRes => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(loginRes)
        wx.getUserInfo({
          success: res => {
            res.code = loginRes.code
            console.log('userinfo', res.rawData)
            //保存用户信息
            wx.setStorageSync('userinfo', res.rawData)
            // 可以将 res 发送给后台解码出 unionId
            wx.request({
              url: 'http://localhost:8080/shg/wechat/login/save',
              method: "POST",
              data: res,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log("requestRes", res);
                console.log(res.header);
                wx.removeStorageSync('sessionid') //必须先清除，否则res.header['Set-Cookie']会报错
                wx.removeStorageSync('openid')
                // 登录成功，获取第一次的sessionid,存储起来
                // 注意：Set-Cookie（开发者工具中调试全部小写）（远程调试和线上首字母大写）
                wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
                wx.setStorageSync("openid", res.data.openId);
                if (res.data.status == 200) {
                  // 登录成功跳转 
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000
                  });
                  // app.userInfo = res.data.data;
                  // fixme 修改原有的全局对象为本地缓存
                  // app.setGlobalUserInfo(res.data.data);
                  // 页面跳转

                } else if (res.data.status == 500) {
                  // 失败弹出框
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                  })
                }
              }
            })
            // console.log(app.globalData)
            // this.globalData.userInfo = res.userInfo

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    })

  }
})