var marknote = require('../libs/mksql');

module.exports = async ctx => {
  ctx.body = {
    noteID: ctx.request.query.noteID,
    noteContext: ctx.request.query.noteContext
  };

  // if (ctx.body.openID) {
    await marknote('userData').update({ noteContext: ctx.body.noteContext }).where({ noteID: ctx.body.noteID });

    ctx.body = {
      context: decodeURIComponent(ctx.body.noteContext)
    };
  // } else {  // 如果没有这些参数，那么有可能是直接调用了接口，不允许
  //   ctx.body = {
  //     context: "缺少参数"
  //   };
  // }
}