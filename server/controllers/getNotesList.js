const { mysql } = require('../qcloud');

module.exports = async ctx => {
  var originalUrl = ctx.originalUrl;

  var re_openID = new RegExp("openID=(\.+)", "g"),
    openID = re_openID.exec(originalUrl)[1];

  var count = await mysql('userData').where({ openID: openID }).select("noteID", "noteTitle", "noteDate").orderBy('noteDate', 'desc');

  var notesList = [];
  count.forEach(function(value){
    notesList.push({
      id: value.noteID,
      title: decodeURI(value.noteTitle),
      date: value.noteDate
    });
  });

  ctx.state.data = {
    context: notesList
  }
}