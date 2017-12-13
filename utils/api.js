const base = "https://wxapi.glavesoft.com/niaoqiedianpu/wxa";

const getOpenId = () => {
  var openid = wx.getStorageSync('openid')
  return openid;
};

const wxGet = (url, params, callback) => {
  params.token = 'wxa';
  params.openid = getOpenId();
  wx.request({
    url: `${base}/${url}`,
    data: params,
    success: res => {
      if (typeof callback == 'function') {
        if (params.rawData) {
          callback(res.data);
        } else {
          callback(res.data.data);
        }
      }
    }
  })
}
const wxPost = (url, params, callback) => {
  params.token = 'wxa';
  params.openid = getOpenId();
  wx.request({
    url: `${base}/${url}`,
    data: params,
    method: "POST",
    success: res => {
      if (typeof callback == 'function') {
        callback(res.data.data);
      }
    }
  })
}

//获取首页数据
const getInexModel = (params, callback) => { wxGet('GetIndexModel', params, callback); }
//获取按类别分组的分类信息
const getGroupedGoodsCategories = (params, callback) => { wxGet('GetGroupedGoodsCategories', params, callback); }
//获取商品列表
const getGoodsList = (params, callback) => { wxGet('GetGoodsList', params, callback); }
//获取商品列表
const getGoodsInfo = (params, callback) => { wxGet('getGoodsInfo', params, callback); }
//加入购物车
const addToCart = (params, callback) => { wxPost('AddToShoppingCart', params, callback); }
//预提交订单
const buy = (params, callback) => { wxPost('Buy', params, callback); }
//获取订单列表
const getOrderList = (params, callback) => { wxGet('GetOrderList', params, callback); }
//发起当面付
const faceToFaceOrder = (params, callback) => { wxPost('FaceToFaceOrder', params, callback); }
//发起支付
const payOrder = (params, callback) => { wxPost('PayOrder', params, callback); }
//获取订单信息
const getOrder = (params, callback) => { wxGet('GetOrderInfo', params, callback); }
//确认订单信息
const confirmOrder = (params, callback) => { wxPost('ConfirmOrder', params, callback); }
//取消订单
const cancelOrder = (params, callback) => { wxPost('CancelOrder', params, callback); }
//获取评价列表
const getOrderEvaluationList = (params, callback) => { wxGet('GetOrderEvaluationList', params, callback); }
//评价订单
const appraiseOrder = (params, callback) => { wxPost('AppraiseOrder', params, callback); }
//用户确认收货
const userConfirmOrder = (params, callback) => { wxPost('UserConfirmOrder', params, callback); }
//获取收货地址
const getAddressList = (params, callback) => { wxGet('GetAddressList', params, callback); }
//获取收货地址信息
const getAddressInfo = (params, callback) => { wxGet('GetAddressInfo', params, callback); }
//编辑收货地址信息
const editAddress = (params, callback) => { wxPost('EditAddressInfo', params, callback); }
//设置默认地址
const setDefaultAddress = (params, callback) => { wxPost('SetDefaultAddress', params, callback); }
//删除地址
const deleteAddress = (params, callback) => { wxPost('DeleteAddress', params, callback); }
//获取购物车
const getMyShoppingCart = (params, callback) => { wxGet('GetMyShoppingCart', params, callback); }
//删除购物车中的一个商品
const deleteShoppingCartItem = (params, callback) => { wxPost('deleteShoppingCartItem', params, callback); }
//获取发票
const getInvoiceList = (params, callback) => { wxGet('GetInvoiceList', params, callback); }
//获取新开票信息
const getNewInvoiceInfo = (params, callback) => { wxGet('GetNewInvoiceInfo', params, callback); }
//获取新开票信息
const updateInvoiceInfo = (params, callback) => { wxPost('UpdateInvoiceInfo', params, callback); }
//获取资讯详情
const getNewsInfo = (params, callback) => { wxGet('GetNewsInfo', params, callback); }


//记录访问记录
const logVisit = (path, userinfo) => {
  var usr = wx.getStorageSync('usr') || {}
  var params = { source: usr.scene, rid: usr.rid, path: path, userinfo: userinfo };
  wxPost('LogViewHistory', params);
}

// 将一个对象转换成url
function jsonToPath(element) {
  if (typeof (element) == undefined)
    return "";
  var result = ""
  for (var prop in element) {
    var url = prop + "=" + element[prop];
    if (result.length > 0)
      result += "&";
    result += url;
  }
  if (result.length > 0)
    return "?" + result;
  return result
}

module.exports = {
  getInexModel: getInexModel,
  getGroupedGoodsCategories: getGroupedGoodsCategories,
  getGoodsList: getGoodsList,
  getGoodsInfo: getGoodsInfo,
  getMyShoppingCart: getMyShoppingCart,
  deleteShoppingCartItem: deleteShoppingCartItem,
  addToCart: addToCart,
  buy: buy,
  getOrderList: getOrderList,
  faceToFaceOrder: faceToFaceOrder,
  payOrder: payOrder,
  getOrder: getOrder,
  confirmOrder: confirmOrder,
  cancelOrder: cancelOrder,
  getOrderEvaluationList: getOrderEvaluationList,
  appraiseOrder: appraiseOrder,
  userConfirmOrder: userConfirmOrder,
  getAddressList: getAddressList,
  getAddressInfo: getAddressInfo,
  editAddress: editAddress,
  setDefaultAddress: setDefaultAddress,
  deleteAddress: deleteAddress,
  getInvoiceList: getInvoiceList,
  getNewInvoiceInfo: getNewInvoiceInfo,
  updateInvoiceInfo: updateInvoiceInfo,
  getNewsInfo: getNewsInfo,
  logVisit: logVisit,
  jsonToPath: jsonToPath
}

