// pages/address/address.js
const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    btn_text: "新增收货地址",
    url: "",
    editUrl: "",
    list: []
  },
  radioChange: function (e) {

    var cur = e.detail.value;
    api.setDefaultAddress({ id: cur }, res => {
      this.loadData();
    });
  },
  loadData() {
    var that = this;
    api.getAddressList({}, res => {
      this.setData({ list: res });
    });
  },
  deleteAddress(e) {
    var that = this;
    wx.showModal({
      title: '删除地址提醒',
      content: '确实要删除这个地址吗?',
      success: function (res) {
        if (res.confirm) {
          api.deleteAddress({ id: e.currentTarget.dataset.id }, res => {
            that.loadData();
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ orderId: options.orderid })
    if (options.orderid) { this.setData({ btn_text: "管理" }) }

    if (options.orderid > 0) {
      this.setData({
        url: "../confirm_order/confirm_order?id=" + options.orderid + "&addressid=",
        editUrl: "../address_edit/address_edit?orderid=" + options.orderid + "&id=",
      });
    } else {
      this.setData({
        url: "../address_edit/address_edit?id=",
        editUrl: "../address_edit/address_edit?id=",
      });
    }
    this.loadData();
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
    wx.stopPullDownRefresh();
    this.loadData();
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