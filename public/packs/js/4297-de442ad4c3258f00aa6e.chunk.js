(self.webpackChunkprsdigg=self.webpackChunkprsdigg||[]).push([[4297],{64297:function(){var a,e,n,t,s,i;a=Prism,e={pattern:/\\[\\(){}[\]^$+*?|.]/,alias:"escape"},t="(?:[^\\\\-]|"+(n=/\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|c[a-zA-Z]|0[0-7]{0,2}|[123][0-7]{2}|.)/).source+")",s=RegExp(t+"-"+t),i={pattern:/(<|')[^<>']+(?=[>']$)/,lookbehind:!0,alias:"variable"},a.languages.regex={charset:{pattern:/((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,lookbehind:!0,inside:{"charset-negation":{pattern:/(^\[)\^/,lookbehind:!0,alias:"operator"},"charset-punctuation":{pattern:/^\[|\]$/,alias:"punctuation"},range:{pattern:s,inside:{escape:n,"range-punctuation":{pattern:/-/,alias:"operator"}}},"special-escape":e,charclass:{pattern:/\\[wsd]|\\p{[^{}]+}/i,alias:"class-name"},escape:n}},"special-escape":e,charclass:{pattern:/\.|\\[wsd]|\\p{[^{}]+}/i,alias:"class-name"},backreference:[{pattern:/\\(?![123][0-7]{2})[1-9]/,alias:"keyword"},{pattern:/\\k<[^<>']+>/,alias:"keyword",inside:{"group-name":i}}],anchor:{pattern:/[$^]|\\[ABbGZz]/,alias:"function"},escape:n,group:[{pattern:/\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,alias:"punctuation",inside:{"group-name":i}},{pattern:/\)/,alias:"punctuation"}],quantifier:{pattern:/(?:[+*?]|\{(?:\d+,?\d*)\})[?+]?/,alias:"number"},alternation:{pattern:/\|/,alias:"keyword"}}}}]);
//# sourceMappingURL=4297-de442ad4c3258f00aa6e.chunk.js.map