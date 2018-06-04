//index.js
//获取应用实例
const app = getApp()

var host = 'https://rt1rggjo.qcloud.la';
var util = require('../../utils/util.js'),
  qcloud = require('../../vendor/wafer2-client-sdk/index'),
  config = require('../../config')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    notes: [],

    notesNum: 0,
    newNoteTitle: null,
    titleLen: 24,

    addPanel: false
  },

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

  onLoad: function () {
    // 显示转发按钮
    wx.showShareMenu({
      withShareTicket: true
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } 

    var that = this;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* 登录 */
    qcloud.setLoginUrl(host + '/weapp/login');
    qcloud.login({
      success: function (userInfo) {
        console.log('登录成功', userInfo);
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true,
        });
        that.loadNotes();
      },
      fail: function (err) {
        console.log('登录失败', err);
      }
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },

  loadNotes: function(){
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

  onShow: function(){
    // 当已有用户信息的情况下onshow被激活才执行
    if (this.data.userInfo.openID){
      this.loadNotes();
    }
    // 如果有需要删除的id，则在页面显示的时候删除对应的note
    if (app.globalData.deleteID){
      this.deleteNoteByID(app.globalData.deleteID);
      app.globalData.deleteID = null;
    }

    // 更新notes标题，如果在编辑页面更改了标题，此时会进行更新
    this.setData({
      notes: app.globalData.notes
    });
  },

  getUserInfo: function(e) {
    wx.showLoading({
      title: '加载中',
    });

    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 点击了添加文章按钮
  add: function(){
    this.setData({
      addPanel: true,
    });
  },

  // 关闭添加文章的面板
  hiddenAdd: function(){
    this.setData({
      addPanel: false,
      titleLen: 24,
      newNoteTitle: null
    });
  },

  // 当在“新建文章”中输入标题时
  titleInput: function(event){
    this.setData({
      newNoteTitle: event.detail.value,
      titleLen: 24 - event.detail.value.length
    });
  },

  guid: function() {
    function S4() {
      return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },

  // 在“新建文章”中点击“确认”
  new: function(event){
    // 文章总数增1
    app.globalData.notesNum += 1;
    this.data.notesNum += 1;
    // 如果填写了标题则新建文章，否则提示未填写
    if (this.data.newNoteTitle){
      // 如果第一个字符不是空格
      if (this.data.newNoteTitle[0] != " "){
        // 显示“加载中”的提示
        wx.showLoading({
          title: "加载中",
          mask: true
        });

        var that = this;
        // 建立note对象
        var note = {
          id: that.guid(),  // 给本note生成一个GUID，用作本note的ID
          title: that.data.newNoteTitle,
          date: util.formatTime(new Date)
        }

        // app全局变量notes增加一篇文章
        app.globalData.notes.unshift(note);
        // page全局变量notes增加一篇文章
        this.setData({
          notes: app.globalData.notes,
          notesNum: app.globalData.notesNum,
          newNoteTitle: "",
          titleLen: 24,

          addPanel: false
        });
        // 跳转到编辑页面
        wx.navigateTo({
          url: `../editor/editor?openID=${that.data.userInfo.openId}&noteID=${note.id}&noteTitle=${note.title}&noteDate=${note.date}&hasThisNote=false`,
        });
        // 关闭“加载中”的提示
        wx.hideLoading();
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

  deleteNoteByID: function(id){
    // app全局变量notes减少一篇note
    app.globalData.notes = app.globalData.notes.filter(function (value, index) {
      return value.id != id;
    });

    app.globalData.notesNum--;

    // page全局变量notes减少一篇note
    this.setData({
      notes: app.globalData.notes,
      notesNum: app.globalData.notesNum
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* 请求后台从数据库中删除这个note */
    wx.request({
      url: `${host}/weapp/deleteNoteById`,
      data: {
        noteID: id
      },
      success: function (response) {
        console.log(response.data.context);
      },
      fail: function (err) {
        console.log(err);
      }
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },

  // 长按post
  conf: function(event){
    var that = this;
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        if(res.tapIndex == 0){
          that.deleteNoteByID(event.target.dataset.id);
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})
