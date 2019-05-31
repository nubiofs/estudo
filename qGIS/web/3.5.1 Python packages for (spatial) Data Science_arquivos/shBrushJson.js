;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var keywords =	'false true null';

		this.regexList = [
			{ regex: /"([^\\"\n]|\\.)*"(?=:)/g,		                    css: 'string' },	 // strings
			{ regex: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/g,          css: 'number' },     // number
			{ regex: /"([^\\"\n]|\\.)*"/g,		                        css: 'value' },      // value
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }     // keyword
			];
		
		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['json'];

	SyntaxHighlighter.brushes.Json = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
