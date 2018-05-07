// pages/editor/editor.js
var marked = require("../../utils/marked.js"),
  WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEditor: false,
    context: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isEditor: true,
      context: "# 此处为一级标题"
    });
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
  
  },


  getValue: function(event){
    this.setData({
      context: event.detail.value
    });
  },

  changeModel: function(event){
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    if(this.data.isEditor){
      var article = marked(this.data.context);
      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
      var that = this;
      WxParse.wxParse('article', 'html', article, that, 5);
    }

    this.setData({
      isEditor: !this.data.isEditor
    });

    wx.hideLoading();
  },

  moreMenu: function(event){
    wx.showActionSheet({
      itemList: ["更改标题", "删除"],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})