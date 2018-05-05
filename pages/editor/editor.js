// pages/editor/editor.js
var marked = require("../../utils/marked.js");

function htmltowxml(htmlString) {
  var re_matchTags = /<.+>.*<.+>/gi,
    re_matchTagAttr = /(?:<([a-z0-9]+)(?: ([a-z]+)="(.*)")*>(.*)<\/.+>)/i;  //不能有全局g标志，因为正则里的lastIndex属性
  
  var htmltags = htmlString.match(re_matchTags);
  
  var wxmlformatarr = [];
  htmltags.forEach(function(value, index, array){
    wxmlformatarr.push(re_matchTagAttr.exec(value));
  });
  return wxmlformatarr;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEditor: false,
    context: "",
    markdownFormat: []
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
      var htmlString = marked(this.data.context),
        wxmlformatarr = htmltowxml(htmlString);

      var format = [];
      wxmlformatarr.forEach(function(value, index, array){
        format.push({
          tag: value[1],
          text: value[value.length - 1],
          src: null
        })
      });

      this.setData({
        markdownFormat: format
      });
    }

    this.setData({
      isEditor: !this.data.isEditor
    });

    wx.hideLoading();
  },

  moreMenu: function(event){
    
  }
})