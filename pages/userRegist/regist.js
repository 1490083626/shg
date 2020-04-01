const app = getApp()

Page({
    data: {

    },

    doRegist: function(e) {
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
        var serverUrl = app.serverUrl;
        wx.showLoading({
          title: '请等待...',
        });
        wx.request({
          url: serverUrl + '/regist',
          method: "POST",
          data: {
            username: username,
            password: password
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log(res.data);
            wx.hideLoading();
            var status = res.data.status;
            if (status == 200) {
              wx.showToast({
                title: "用户注册成功~！！！",
                icon: 'none',
                duration: 3000
              }),
              // app.userInfo = res.data.data;
              // fixme 修改原有的全局对象为本地缓存
              app.setGlobalUserInfo(res.data.data);
              // 页面跳转
                wx.redirectTo({
                  url: '../mine/mine',
                })
            } else if (status == 500) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000
              })
            }
          },
          fail:function(res){
            wx.hideLoading();
            wx.showToast({
              title: "请求失败",
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    },

    goLoginPage:function() {
      wx.navigateTo({
        url: '../userLogin/login',
      })
    },
    onLoad:function(){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res);
        }
      })
    }
})