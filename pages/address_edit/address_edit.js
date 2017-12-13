// pages/address_edit/address_edit.js
const app = getApp()
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Id: 0,
    Address: '',
    isDefault: false
  },
  getAddress: function () {
    var self = this;
    wx.chooseLocation({
      success: function (res) {
        self.setData({
          Address: res.address,
          lng: res.longitude,
          lat: res.latitude
        });
      },
      fail: function () { },
      complete: function (res) { }
    })
  },
  switchChange: function (e) {
    this.setData({
      isDefault: e.detail.value
    })
  },
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  formSubmit: function (e) {
    var formData = e.detail.value;
    var userName = formData.LinkMan;
    var userPhone = formData.LinkPhone;
    var userLocation = this.data.Address;
    var userDetail = formData.HouseNumber;
    var isDefault = this.data.isDefault;
    if (!this.trim(userName)) {
      wx.showModal({
        title: '信息提示',
        content: '请填写收货人姓名',
      })
      return false;
    }
    if (this.trim(userPhone).length != 11) {
      wx.showModal({
        title: '信息提示',
        content: '手机号不正确！',
      })
      return false;
    }
    if (userLocation.length < 1) {
      wx.showModal({
        title: '信息提示',
        content: '地址信息不能为空',
      })
      return false;
    }
    wx.showLoading({ title: '正在保存地址', mask: true })
    var params = {
      Id: this.data.Id,
      LinkMan: userName,
      LinkPhone: userPhone,
      Address: userLocation,
      HouseNumber: userDetail,
      IsDefault: isDefault,
      Lng: this.data.lng,
      Lat: this.data.lat
    };
    api.editAddress(params, res => {
      wx.hideLoading();
      if (this.data.orderid) {
        wx.redirectTo({ url: '../address/address?orderid=' + this.data.orderid })
      }
      else {
        wx.redirectTo({ url: '../address/address' })
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id != undefined && options.id > 0) {
      api.getAddressInfo({ id: options.id }, res => {
        this.setData({
          Id: options.id,
          orderid: options.orderid,
          LinkMan: res.LinkMan,
          LinkPhone: res.LinkPhone,
          Address: res.Address,
          HouseNumber: res.HouseNumber,
          isDefault: res.IsDefault,
          lng: res.Lng,
          lat: res.Lat
        });
      });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})