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

      // console.log(article);

      // this.setData({
      //   nodes: article
      // });
      
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
      itemList: ["分享给好友","更改标题", "删除便笺"],
      success: function (res) {
        if(res.tapIndex == 0){

        }
        if(res.tapIndex == 1){

        }
        if(res.tapIndex == 2){
          
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})