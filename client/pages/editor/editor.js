// pages/editor/editor.js
var marked = require("../../utils/marked.js"),
  WxParse = require('../../wxParse/wxParse.js');

var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var host = 'https://rt1rggjo.qcloud.la';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    options: null,
    isEditor: true,
    context: "",

    changeNoteTitle: false,
    newNoteTitle: null,

    titleLen: 24,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      options: options,
    });

    wx.showLoading({
      title: '加载中',
    });

    var that = this;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* 请求后台获取本note的内容 */
    wx.request({
      url: `${host}/weapp/getNoteContext`,
      data: {
        openID: options.openID,
        noteID: options.noteID,
        noteTitle: options.noteTitle,
        noteDate: options.noteDate,
        hasThisNote: options.hasThisNote
      },
      success: function (response) {
        console.log(response.data.context);
        var context = decodeURIComponent(response.data.context);
        that.setData({
          context: context,
        });

        // 如果文章内容不是默认的则渲染
        if (context !== "# " + options.noteTitle){  
          that.changeModel();
        }

        // 关闭加载中提示
        wx.hideLoading();
      },
      fail: function (err) {
        console.log(err);
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    var context = encodeURIComponent(this.data.context);
    var noteID = this.data.options.noteID;
    console.log("noteID: " + noteID + " context: " + context);
    var that = this;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* 更新数据库 */
    wx.request({
      url: `${host}/weapp/updateNoteContext`,
      data: {
        noteID: noteID,
        noteContext: context
      },
      success: function (response) {
        console.log(response.data.context);
      },
      fail: function (err) {
        console.log(err);
      }
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
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

  loadNotes: function () {
    wx.showLoading({
      title: '加载中',
    });

    var that = this;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* 请求后台获取notes列表 */
    var notesNum,
      notes;
    console.log(this.data.userInfo.openId);
    wx.request({
      url: `${host}/weapp/getNotesList`,
      data: {
        openID: that.data.userInfo.openId
      },
      success: function (response) {
        console.log(response.data.context);
        notes = response.data.context;
        notesNum = notes.length;

        // 初始化notes数据
        that.setData({
          notes: notes,
          notesNum: notesNum
        });
        app.globalData.notes = notes;
        app.globalData.notesNum = notesNum;

        // 关闭加载中提示
        wx.hideLoading();
      },
      fail: function (err) {
        console.log(err);
      }
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'Markdown便笺',
      path: 'pages/index/index'
    }
  },

  // 用户输入时
  getValue: function(event){
    this.setData({
      context: event.detail.value
    });
  },

  // 更改为预览/编辑页面
  changeModel: function(event){
    wx.showLoading({
      title: "加载中",
      mask: true
    });

    if(this.data.isEditor){
      var article = marked(this.data.context);
      
      var that = this;
      WxParse.wxParse('article', 'html', article, that, 5);
    }

    this.setData({
      isEditor: !this.data.isEditor
    });

    wx.hideLoading();
  },

  // 关闭更改便笺标题的面板
  hiddenChange: function () {
    this.setData({
      changeNoteTitle: false,
      titleLen: 24,
      newNoteTitle: null
    });
  },

  // 当在“更改便笺标题”中输入标题时
  titleInput: function (event) {
    this.setData({
      newNoteTitle: event.detail.value,
      titleLen: 24 - event.detail.value.length
    });
  },

  // 确定修改标题
  change: function(){
    // 如果填写了标题则修改标题，否则提示未填写
    if (this.data.newNoteTitle) {
      // 如果第一个字符不是空格
      if (this.data.newNoteTitle[0] != " ") {
        var that = this;
        var i, id = that.data.options.noteID;
        for (i = 0; i < app.globalData.notes.length; i++){
          console.log(app.globalData.notes[i].id, id);
          if (app.globalData.notes[i].id === id){
            app.globalData.notes[i].title = this.data.newNoteTitle;
            break;
          }
        }

        /* 请求后台更改标题 */
        wx.request({
          url: `${host}/weapp/changeNoteTitle`,
          data: {
            noteID: that.data.options.noteID,
            noteTitle: that.data.newNoteTitle
          },
          success: function (response) {
            console.log(response.data.context);
          },
          fail: function (err) {
            console.log(err);
          }
        });

        // 给出成功的提示
        wx.showToast({
          title: '已更改',
          icon: 'success',
          duration: 1200
        })

        this.setData({
          changeNoteTitle: false
        });
      } else {
        this.setData({
          titleLen: 24,
          newNoteTitle: null
        });

        wx.showToast({
          title: "标题第一个字符不能为空格",
          mask: true,
          icon: "none",
          duration: 1400
        })
      }
    } else {
      wx.showToast({
        title: "标题不能为空",
        mask: true,
        icon: "none",
        duration: 1000
      })
    }
  },

  moreMenu: function(event){
    var that = this;
    wx.showActionSheet({
      itemList: ["更改标题", "删除便笺"],
      success: function (res) {
        if(res.tapIndex == 0){
          that.setData({
            changeNoteTitle: !that.data.changeNoteTitle
          });
        }
        if(res.tapIndex == 1){
          wx.navigateBack({
            data: 1
          });
          app.globalData.deleteID = that.data.options.noteID;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})