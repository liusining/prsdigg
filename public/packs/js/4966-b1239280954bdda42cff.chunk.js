(self.webpackChunkprsdigg=self.webpackChunkprsdigg||[]).push([[4966],{34966:function(){!function(n){function e(n,e){return RegExp(n.replace(/<MOD>/g,(function(){return"(?:\\([^|()\n]+\\)|\\[[^\\]\n]+\\]|\\{[^}\n]+\\})"})).replace(/<PAR>/g,(function(){return"(?:\\)|\\((?![^|()\n]+\\)))"})),e||"")}var i={css:{pattern:/\{[^}]+\}/,inside:{rest:n.languages.css}},"class-id":{pattern:/(\()[^)]+(?=\))/,lookbehind:!0,alias:"attr-value"},lang:{pattern:/(\[)[^\]]+(?=\])/,lookbehind:!0,alias:"attr-value"},punctuation:/[\\\/]\d+|\S/},t=n.languages.textile=n.languages.extend("markup",{phrase:{pattern:/(^|\r|\n)\S[\s\S]*?(?=$|\r?\n\r?\n|\r\r)/,lookbehind:!0,inside:{"block-tag":{pattern:e("^[a-z]\\w*(?:<MOD>|<PAR>|[<>=])*\\."),inside:{modifier:{pattern:e("(^[a-z]\\w*)(?:<MOD>|<PAR>|[<>=])+(?=\\.)"),lookbehind:!0,inside:i},tag:/^[a-z]\w*/,punctuation:/\.$/}},list:{pattern:e("^[*#]+<MOD>*\\s+.+","m"),inside:{modifier:{pattern:e("(^[*#]+)<MOD>+"),lookbehind:!0,inside:i},punctuation:/^[*#]+/}},table:{pattern:e("^(?:(?:<MOD>|<PAR>|[<>=^~])+\\.\\s*)?(?:\\|(?:(?:<MOD>|<PAR>|[<>=^~_]|[\\\\/]\\d+)+\\.)?[^|]*)+\\|","m"),inside:{modifier:{pattern:e("(^|\\|(?:\r?\n|\r)?)(?:<MOD>|<PAR>|[<>=^~_]|[\\\\/]\\d+)+(?=\\.)"),lookbehind:!0,inside:i},punctuation:/\||^\./}},inline:{pattern:e("(^|[^a-zA-Z\\d])(\\*\\*|__|\\?\\?|[*_%@+\\-^~])<MOD>*.+?\\2(?![a-zA-Z\\d])"),lookbehind:!0,inside:{bold:{pattern:e("(^(\\*\\*?)<MOD>*).+?(?=\\2)"),lookbehind:!0},italic:{pattern:e("(^(__?)<MOD>*).+?(?=\\2)"),lookbehind:!0},cite:{pattern:e("(^\\?\\?<MOD>*).+?(?=\\?\\?)"),lookbehind:!0,alias:"string"},code:{pattern:e("(^@<MOD>*).+?(?=@)"),lookbehind:!0,alias:"keyword"},inserted:{pattern:e("(^\\+<MOD>*).+?(?=\\+)"),lookbehind:!0},deleted:{pattern:e("(^-<MOD>*).+?(?=-)"),lookbehind:!0},span:{pattern:e("(^%<MOD>*).+?(?=%)"),lookbehind:!0},modifier:{pattern:e("(^\\*\\*|__|\\?\\?|[*_%@+\\-^~])<MOD>+"),lookbehind:!0,inside:i},punctuation:/[*_%?@+\-^~]+/}},"link-ref":{pattern:/^\[[^\]]+\]\S+$/m,inside:{string:{pattern:/(\[)[^\]]+(?=\])/,lookbehind:!0},url:{pattern:/(\])\S+$/,lookbehind:!0},punctuation:/[\[\]]/}},link:{pattern:e('"<MOD>*[^"]+":.+?(?=[^\\w/]?(?:\\s|$))'),inside:{text:{pattern:e('(^"<MOD>*)[^"]+(?=")'),lookbehind:!0},modifier:{pattern:e('(^")<MOD>+'),lookbehind:!0,inside:i},url:{pattern:/(:).+/,lookbehind:!0},punctuation:/[":]/}},image:{pattern:e("!(?:<MOD>|<PAR>|[<>=])*[^!\\s()]+(?:\\([^)]+\\))?!(?::.+?(?=[^\\w/]?(?:\\s|$)))?"),inside:{source:{pattern:e("(^!(?:<MOD>|<PAR>|[<>=])*)[^!\\s()]+(?:\\([^)]+\\))?(?=!)"),lookbehind:!0,alias:"url"},modifier:{pattern:e("(^!)(?:<MOD>|<PAR>|[<>=])+"),lookbehind:!0,inside:i},url:{pattern:/(:).+/,lookbehind:!0},punctuation:/[!:]/}},footnote:{pattern:/\b\[\d+\]/,alias:"comment",inside:{punctuation:/\[|\]/}},acronym:{pattern:/\b[A-Z\d]+\([^)]+\)/,inside:{comment:{pattern:/(\()[^)]+(?=\))/,lookbehind:!0},punctuation:/[()]/}},mark:{pattern:/\b\((?:TM|R|C)\)/,alias:"comment",inside:{punctuation:/[()]/}}}}}),a=t.phrase.inside,o={inline:a.inline,link:a.link,image:a.image,footnote:a.footnote,acronym:a.acronym,mark:a.mark};t.tag.pattern=/<\/?(?!\d)[a-z0-9]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i;var r=a.inline.inside;r.bold.inside=o,r.italic.inside=o,r.inserted.inside=o,r.deleted.inside=o,r.span.inside=o;var d=a.table.inside;d.inline=o.inline,d.link=o.link,d.image=o.image,d.footnote=o.footnote,d.acronym=o.acronym,d.mark=o.mark}(Prism)}}]);
//# sourceMappingURL=4966-b1239280954bdda42cff.chunk.js.map