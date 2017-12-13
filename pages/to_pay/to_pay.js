// pages/to_pay/to_pay.js
const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payMoney: 0
  },
  bindKeyInput: function (e) {
    this.setData({
      payMoney: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    var amount = e.detail.value.pay_money * 1;
    var contents = e.detail.value.pay_text;    
    if (isNaN(amount) || amount <= 0) {
      wx.showModal({
        title: '信息提示',
        content: '请输入消费金额',
      })
      return false;
    }
    wx.showToast({ title: '生成支付信息……', icon: 'loading', duration: 5000 })
    api.faceToFaceOrder({ Amount: amount, Contents: contents }, pay => {
      wx.hideToast();
      wx.requestPayment({
        'timeStamp': pay.timeStamp,
        'nonceStr': pay.nonceStr,
        'package': pay.package,
        'signType': 'MD5',
        'paySign': pay.paySign,
        'success': function (res) {
          wx.navigateTo({ url: '../paysuccess/paysuccess' });
        },
        'fail': function (failRes) {
          if (failRes.errMsg.indexOf('cancel') >= 0)
            wx.showToast({ title: "用户取消支付", duration: 2000 });
          else
            wx.showToast({ title: failRes.errMsg, duration: 2000 });
        }
      });

    });
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