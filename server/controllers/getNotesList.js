var marknote = require('../libs/mksql');

module.exports = async ctx => {
  ctx.body = {
    openID: ctx.request.query.openID
  };

  if (ctx.body.openID) {
    var count = await marknote('userData').where({ openID: ctx.body.openID }).select("noteID", "noteTitle", "noteDate").orderBy('noteDate', 'desc');

    var notesList = [];
    count.forEach(function (value) {
      notesList.push({
        id: value.noteID,
        title: decodeURI(value.noteTitle),
        date: value.noteDate
      });
    });

    ctx.body = {
      context: notesList
    };
  } else {  // 如果没有这些参数，那么有可能是直接调用了接口，不允许
    ctx.body = {
      context: "缺少参数"
    };
  }
}