var marknote = require('../libs/mksql');

module.exports = async ctx => {
  ctx.body = {
    noteID: ctx.request.query.noteID,
    noteTitle: ctx.request.query.noteTitle,
  };

  // if (ctx.body.openID) {
    await marknote('userData').update({ noteTitle: ctx.body.noteTitle }).where({ noteID: ctx.body.noteID });

    ctx.body = {
      context: "id: " + ctx.body.noteID + "更改标题为" + ctx.body.noteTitle
    };
  // } else {  // 如果没有这些参数，那么有可能是直接调用了接口，不允许
  //   ctx.body = {
  //     context: "缺少参数"
  //   };
  // }
}