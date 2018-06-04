var marknote = require('../libs/mksql');

module.exports = async ctx => { 
  ctx.body = {
    openID: ctx.request.query.openID,
    noteID: ctx.request.query.noteID,
    noteTitle: ctx.request.query.noteTitle,
    noteDate: ctx.request.query.noteDate,
    hasThisNote: ctx.request.query.hasThisNote
  };

  if (ctx.body.openID && ctx.body.noteID && ctx.body.noteTitle && ctx.body.noteDate && ctx.body.hasThisNote){
    // 如果存在此文章，则返回内容
    if (ctx.body.hasThisNote === "true") {
      var { noteContext } = await marknote("userData").where({ noteID: ctx.body.noteID }).select("noteContext").first();

      ctx.body = {
        context: noteContext
      };
    } else {  // 如果id不存在，证明是篇新文章，新建之
      await marknote('userData').insert({
        openID: ctx.body.openID,
        noteID: ctx.body.noteID,
        noteTitle: ctx.body.noteTitle,
        noteDate: decodeURI(ctx.body.noteDate),
        noteContext: "# " + ctx.body.noteTitle
      });
      ctx.body = {
        context: "# " + ctx.body.noteTitle
      };
    }
  } else {  // 如果没有这些参数，那么有可能是直接调用了接口，不允许
    ctx.body = {
      context: "缺少参数"
    };
  }
}