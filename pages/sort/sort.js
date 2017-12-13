// pages/sort/sort.js
const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,//当前选中的分类index
    sortList: [],//显示的分类内容
    sortsData: []
  },
  sortClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var self = this;
    this.setData({
      currentIndex: index,
      sortList: self.data.sortsData[index].List
    });

  },
  loadData() {
    var cate = wx.getStorageSync('cate_id') || "";
    wx.setStorageSync("cate_id", "");
    api.getGroupedGoodsCategories({}, res => {
      var self = this;
      if (cate.length > 0) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].Name == cate) {
            self.setData({ currentIndex: i });
            break;
          }
        }
      }
      self.setData({
        sortsData: res,
        sortList: res[self.data.currentIndex].List
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
    this.loadData();
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