// pages/person/person.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconMore:'../../image/more.png',
    userInfo: {
      avatarUrl:'',
      nickName:''
    },
    listBox:[
      {
        url: '../orders/orders',
        icon: '../../image/icon-order.png',
        name: '订单中心',
        lists: [
          {
            url: '../orders/orders?cur=1&id=s1',
            icon: '../../image/stay_pay.png',
            name: '待付款'
          },
          {
            url: '../orders/orders?cur=2&id=s2',
            icon: '../../image/stay_send.png',
            name: '待发货'
          },
          {
            url: '../orders/orders?cur=3&id=s3',
            icon: '../../image/stay_get.png',
            name: '待收货'
          },
          {
            url: '../orders/orders?cur=5&id=s5',
            icon: '../../image/stay_praise.png',
            name: '已完成'
          },
        ]
      },
      {
        url: '../address/address',
        icon: '../../image/icon-addr.png',
        name: '我的地址'
      },
      {
        url: '../my_praise/my_praise',
        icon: '../../image/icon-praise.png',
        name: '我的评价'
      },
      // {
      //   url: '../to_pay/to_pay',
      //   icon: '../../image/icon-pay.png',
      //   name: '当面付'
      // },
      // {
      //   url: '../my_praise/my_praise',
      //   icon: '../../image/icon-money.png',
      //   name: '储值金'
      // },
      {
        url: '../about/about',
        icon: '../../image/icon-about.png',
        name: '关于我们'
      },
      {
        url: '',
        icon: '../../image/icon-contact.png',
        name: '联系我们',
        content: app.globalData.contactPhone,
        active:'tapPhone'
      }
    ]
  },
  tapPhone: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.contactPhone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();//当前页面取消转发
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  
  }
})