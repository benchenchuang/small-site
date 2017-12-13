
const app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryId: 0,
    showFilter: 0,
    upFilter: 0,//升序
    sort: 0,
    shopList: [],
    page: 1,
    pageSize: 10,
    totalPage: 1,
    isPull: false
  },
  showTab: function (e) {
    this.setData({ isPull: true });
    var thisIndex = e.currentTarget.dataset.index;
    var sort = e.currentTarget.dataset.sort;
    var upFilter = 0;
    if (thisIndex == 2) {
      if (this.data.upFilter == 0) {
        upFilter = 1;
        sort = 5
      } else {
        upFilter = 0;
        sort = 4
      }
    }
    this.setData({
      showFilter: thisIndex,
      upFilter: upFilter,
      page: 1,
      sort: sort
    });
    this.loadData();
  },
  // 加入购物车
  addToCart: function (e) {
    wx.showLoading({ title: '正在加入购物车', mask: true })
    var goodsId = e.currentTarget.dataset.id;
    var params = { GoodsId: goodsId, Quantity: 1 };
    api.addToCart(params, res => {
      wx.hideLoading()
      if (res) {
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  ///加载数据
  loadData() {
    var params = {
      categoryId: this.data.categoryId,
      sort: this.data.sort,
      page: this.data.page,
      rawData: true
    }
    api.getGoodsList(params, res => {
      var totalPage = Math.ceil(res.total / this.data.pageSize);
      var tmpList = this.data.shopList;
      if (this.data.isPull) {
        tmpList = [];
      }
      tmpList = tmpList.concat(res.data);
      this.setData({ shopList: tmpList, totalPage: totalPage })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ categoryId: options.cate })
    this.loadData();

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
    this.setData({ isPull: true });
    wx.stopPullDownRefresh();
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ isPull: false });
    if (this.data.page < this.data.totalPage) {
      this.setData({ page: this.data.page + 1 })
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})