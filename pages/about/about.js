// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopAdress: {
      latitude: 31.8281940000,
      longitude: 119.9868710000,
      content: '江苏省常州市新北区汉江东路318号',
      phone:'13548452562'
    },
  },
  showShopAddress: function () {
    var self = this;
    wx.getLocation({
      success: function () {
        wx.openLocation({
          latitude: self.data.shopAdress.latitude,
          longitude: self.data.shopAdress.longitude,
          scale: 28
        })
      }
    })
  },
  callPhone:function(){
    var self=this;
    wx.makePhoneCall({
      phoneNumber: self.data.shopAdress.phone
    })
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