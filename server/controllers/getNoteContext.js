const { mysql } = require('../qcloud')

module.exports = async ctx => { 
  // 分割出各个参数
  var originalUrl = ctx.originalUrl,
  optionsStr = originalUrl.slice(originalUrl.indexOf('?') + 1, originalUrl.length).split("&"),
  optionsArr = [];

  optionsStr.forEach(function(value){
    var tmp1 = value.slice(0, value.indexOf('='));
    var tmp2 = value.slice(value.indexOf('=') + 1, value.length);
    optionsArr.push([tmp1, tmp2]);
  });

  // 如果存在此文章，则返回内容
  if (optionsArr[4][1] === "true"){
    var { noteContext } = await mysql("userData").where({ noteID: optionsArr[1][1] }).select("noteContext").first();

    ctx.state.data = {
      context: noteContext
    }
  } else {  // 如果id不存在，证明是篇新文章，新建之
    await mysql('userData').insert({
      openID: optionsArr[0][1],
      noteID: optionsArr[1][1],
      noteTitle: optionsArr[2][1],
      noteDate: decodeURI(optionsArr[3][1]),
      noteContext: "# Hello world"
    });
    ctx.state.data = {
      context: "# Hello world"
    }
  }
}