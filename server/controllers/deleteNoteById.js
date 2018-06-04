var marknote = require('../libs/mksql');

module.exports = async ctx => {
  ctx.body = {
    noteID: ctx.request.query.noteID
  };

  if (ctx.body.noteID) {
    await marknote('userData').del().where({ noteID: ctx.body.noteID });

    ctx.body = {
      context: "id: " + ctx.body.noteID + " 已删除"
    };
  } else {  // 如果没有这些参数，那么有可能是直接调用了接口，不允许
    ctx.body = {
      context: "缺少参数"
    };
  }
}