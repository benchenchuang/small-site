// pages/confirm_order/confirm_order.js
const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    thisTime: ''
  },
  bindTimeChange: function (e) {
    this.setData({ time: e.detail.value });
  },

  getDouble: function (value) {
    return value < 10 ? '0' + value : value;
  },

  // 提交订单
  formSubmit: function (e) {
    var that = this;
    wx.showLoading({ title: '正在提交订单', mask: true })
    var now = new Date();
    var deliverTime = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + this.data.time;
    var params = {
      Id: this.data.details.Id,
      DeliveryTime: deliverTime,
      Contents: e.detail.value.Contents,
    };
    api.confirmOrder(params, pay => {
      wx.hideLoading();
      wx.requestPayment({
        'timeStamp': pay.timeStamp,
        'nonceStr': pay.nonceStr,
        'package': pay.package,
        'signType': 'MD5',
        'paySign': pay.paySign,
        'success': function (res) {
          wx.redirectTo({
            url: '../paysuccess/paysuccess',
            complete: function (res) {
              that.setData({ disabled: false });
            }
          });
        },
        'fail': function (failRes) {
          if (failRes.errMsg.indexOf('cancel') >= 0) {
            wx.showToast({
              title: "用户取消支付", duration: 2000, success: function () {                
                wx.redirectTo({ url: '../orders/orders' });
              }
            });
          }
          else {
            wx.showToast({
              title: failRes.errMsg, duration: 2000, success: function () {
                wx.redirectTo({ url: '../orders/orders' });
              }
            });
          }
          //  that.setData({ disabled: false })
        }
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisDate = new Date();
    console.log(thisDate)
    this.setData({
      time: this.getDouble(thisDate.getHours() + 1) + ':' + this.getDouble(thisDate.getMinutes()),
      thisTime: this.getDouble(thisDate.getHours() + 1) + ':00'
    })

    api.getOrder({ id: options.id, addressid: options.addressid }, res => {
      var _submitOrderDisable = (res.LinkMan.length <= 0) || (res.LinkMan.length <= 0) || (res.Address.length <= 0);
      this.setData({ details: res, submitOrderDisable: _submitOrderDisable });
    })
    api.logVisit(this.route + api.jsonToPath(options), app.globalData.userInfo)
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