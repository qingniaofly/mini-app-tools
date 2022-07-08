const lyricUtil = {
	selector: ".lyric-panel",
	lyric: '',
	lyricParseList: new Array(),
	lyricLine: 0,
	lyricClass: 'lyric-item',
	highlightClass: 'lyric-highlight',

	timeList1: [],
	lyricList1: [],
	index1: -1,
	time: new Array(),
	timeList: new Array(),
	lyricList: new Array(),
	index : 0,
	ar: '',//[ar:艺人名]
	ti: '',//[ti:曲名]
	al: '',//[al:专辑名]
	by: '',//[by:编者（指编辑LRC歌词的人）]
	offset: '',//[offset:时间补偿值] 其单位是毫秒，正值表示整体提前，负值相反。这是用于总体调整显示快慢的。（很少被使用）
	init(selector: string, lyric: string) {
		this.selector = selector
		this.update(lyric)
	},
	parse1(text: string) {
		this.timeList1 = []
		this.lyricList1 = []
		//按行分割歌词
		let lyricArr = text.split('\n');
		//console.log(lyricArr)//0: "[ti:七里香]" "[ar:周杰伦]"...
		let result = []; //新建一个数组存放最后结果
		let index = 0
		//遍历分割后的歌词数组，将格式化后的时间节点，歌词填充到result数组
		for (let i = 0; i < lyricArr.length; i++) {
			let playTimeArr: any = lyricArr[i].match(/\[\d{2}:\d{2}((\.|\:)\d{2})\]/g); //正则匹配播放时间
			let lineLyric: any = "";
			if (lyricArr[i].split(playTimeArr).length > 0) {
				lineLyric = lyricArr[i].split(playTimeArr);
			}

			if (playTimeArr != null) {
				for (let j = 0; j < playTimeArr.length; j++) {
					let time = playTimeArr[j].substring(1, playTimeArr[j].indexOf("]")).split(":");
					const timeStr: any = (parseInt(time[0]) * 60 + parseFloat(time[1])).toFixed(4)
					const content: any = String(lineLyric).substr(1)
					this.timeList1.push(timeStr)
					this.lyricList1.push(content)
					//数组填充
					result.push({
						time: timeStr,
						content
					});
					index++
				}
				this.index1 = index
			}
		}
		return result;
	},
	parseLyric: function(lyricStr: string) {
		const regex = /^[^\[]*((?:\s*\[\d+\:\d+(?:\.\d+)?\])+)([\s\S]*)$/; // 提取歌词内容行
		const regex_trim = /^\s+|\s+$/;   // 过滤两边空格
		const regex_time = /\[(\d+)\:((?:\d+)(?:\.\d+)?)\]/g;   // 提取歌词时间轴
		const list: { time: number, txt: string }[] = []

		if (typeof (lyricStr) != 'string' || lyricStr.length < 1) return list;

		let item = null, item_time = null;
		const lyricList = lyricStr.split("\n");
		for (var i = 0; i < lyricList.length; i++) {
			item = lyricList[i].replace(regex_trim, '');
			if (item.length < 1 || !(item = regex.exec(item))) continue;
			while (item_time = regex_time.exec(item[1])) {
				list.push({
					time: parseFloat(item_time[1]) * 60 + parseFloat(item_time[2]),
					txt: item[2]
				});
			}
			regex_time.lastIndex = 0;
		}
		if (list.length > 0) {
			list.sort(function (a, b) { return a.time - b.time; });
			if (list[0].time >= 0.1) {
				list.unshift({
					time: list[0].time - 0.1,
					txt: ''
				});
			}
			list.push({
				time: list[list.length - 1].time + 1,
				txt: ''
			});
		}
		return list;
	},
	parse() {
		if (this.lyric == "") return false;
		var str = this.lyric;
		this.index = 0;
		for (var i = 0; i < str.length; i++) {
			if (str.charAt(i) == "[") {
				var time = this.findTime(i);
				if (time.time) // 时间标签
				{
					// 缘分一道桥 歌词有问题
					var lyric = this.findlyric(time.index);
					if (lyric.lyric != "\n" && lyric.lyric != "") // 去掉无意义歌词
					{
						var timeArray = time.time.split("|");
						for (var j = 0; j < timeArray.length; j++) {
							if (timeArray[j]) {
								const timeArr = timeArray[j].split(':')
								const timeStr: any = (parseInt(timeArr[0]) * 60 + parseFloat(timeArr[1])).toFixed(4)
								this.time[this.index] = timeArray[j];
								this.timeList[this.index] = timeStr
								this.lyricList[this.index] = lyric.lyric;
								this.index += 1;
							}
						}
					}
					i = time.index;
				}
				else // 预定义标签
				{
					this.findID(i);
				}
			}
		}
		this.sort()
	},
	sort: function () { // 冒泡排序（从小到大）
		var third;
		for (var j = 0; j < this.index - 1; j++) {
			for (var i = 0; i < this.index - 1; i++) {
				if (this.time[i] > this.time[i + 1]) {
					third = this.time[i];
					this.time[i] = this.time[i + 1];
					this.time[i + 1] = third;
					third = this.timeList[i];
					this.timeList[i] = this.timeList[i + 1];
					this.timeList[i + 1] = third;
					third = this.lyric[i];
					this.lyricList[i] = this.lyric[i + 1];
					this.lyricList[i + 1] = third;
				}
			}
		}
	},
	findTags: function (index: number, strArray: any[], number?: number) { // 查找标签（包括任何扩展的标签）
		// 此方法能匹配所有格式的标签
		// 因为此方法是在后面写的，所以时间标签并没有使用此方法
		number = number || this.lyric.length;
		number = (number > this.lyric.length) ? this.lyric.length : number;
		var i, j, complete = 0, value:any;
		var obj: any = new Object();
		obj.booble = false;
		obj.value = "[";
		for (i = index; i < number; i++) {
			if (this.lyric.substr(i, 1) == strArray[complete].s) {
				complete += 1;
				if (complete > 1) {
					if (complete < strArray.length) {
						obj.value += '{value:"' + this.lyric.substr(value + 1, i - value - 1) + '"},';
					}
					else {
						obj.value += '{value:"' + this.lyric.substr(value + 1, i - value - 1) + '"}]';
					}
				}
				if (complete == strArray.length) {
					obj.lyric = this.lyric.substr(index, i - index + 1);
					obj.value = eval('(' + obj.value + ')');
					obj.index = i + 1;
					obj.booble = true;
					break
				}
				value = i;
			}
			else if (this.lyric.substr(i, 1) == "\n") {
				obj.booble = false;
				return obj;
			}
			else if (this.lyric.substr(i, 1) == strArray[0].s && complete > 0) // 遇到2次开始标志就退出
			{
				obj.booble = false;
				return obj;
			}
		}
		return obj;
	},
	findlyric: function (index: number) { // 查找歌词： 有则返回 歌词、继续查找的位置， 否则只返回继续查找的位置
		var obj: any = {};
		var str = this.lyric;
		var i;
		for (i = index; i < str.length; i++) {
			if (str.charAt(i) == "[") {
				var _obj: any = this.findTags(i, [{ s: "[" }, { s: ":" }, { s: "]" }]);
				if (_obj.booble) {
					obj.index = i;//i + _obj.txt.length;
					obj.lyric = str.substr(index, i - index);
					return obj;
				}
			}
			else if (str.charAt(i) == "\n") {
				obj.index = i + 1;
				obj.lyric = str.substr(index, i - index);
				return obj
			}
		}
		if (i == str.length) // 专处理最后一句歌词（最后一句歌词比较特殊）
		{
			obj.index = i + 1;
			obj.lyric = str.substr(index, i - index);
			return obj;
		}
		obj.index = i;
		return obj;
	},
	findTime: function (index: number) { // 查找时间 ： 有则返回 时间、继续查找的位置， 否则只返回继续查找的位置
		// 此功能可以用 findTags 方法实现，更简单、更强大、代码更少
		// findTags方法 是在后面写的，所以这里就不改了，具体可参考 findID方法里的使用实例
		// return this.findTags(index, [{ s: "[" }, { s: ":" }, { s: "]" }])
		var obj: any = {};
		var thisobj = this;
		var str = this.lyric;
		obj.index = index;
		function recursion() {
			var _obj = thisobj.findTime(obj.index);
			if (_obj.time) {
				obj.time += _obj.time;
				obj.index = _obj.index;
			}
		}
		// --------------- 可以在这里 扩展 其它功能 ---------------
		// lrc歌词只能精确到每句歌词，可以通过扩展lrc 精确 到 每个字
		if (/\[\d{1,2}\:\d{1,2}\.\d{1,2}\]/.test(str.substr(index, 10))) // [mm:ss.ff]
		{
			obj.time = str.substr(index + 1, 8) + "|";
			obj.index = index + 9 + 1;
			recursion();
		}
		else if (/\[\d{1,2}\:\d{1,2}\]/.test(str.substr(index, 7))) // [mm:ss]
		{
			obj.time = str.substr(index + 1, 5) + ".00" + "|";
			obj.index = index + 6 + 1;
			recursion();
		}
		// 以下标签均属于合法标签，但很少被使用，请根据需要进行扩展
		// [mm:ss.f] [mm:s.ff] [mm:s.f] [m:ss.ff] [m:s.ff] [m:s.f]
		// [mm:s] [m:ss] [s:s]
		return obj;
	},
	findID: function (index: number) { // 查找预定义标识
		//[ar:艺人名]
		//[ti:曲名]
		//[al:专辑名]
		//[by:编者（指编辑LRC歌词的人）]
		//[offset:时间补偿值] 其单位是毫秒，正值表示整体提前，负值相反。这是用于总体调整显示快慢的。（很少被使用）
		// 注：本程序也不支持 offset 功能（但是能取值），如需要 请自行在 sort 方法添加此功能
		// 此处功能 使用 findTags方法 实现
		var obj: any;
		obj = this.findTags(index, [{ s: "[" }, { s: ":" }, { s: "]" }]);
		if (obj.booble) {
			if (obj.value[0].value == "ar") {
				this.ar = obj.value[1].value;
			}
			else if (obj.value[0].value == "ti") {
				this.ti = obj.value[1].value;
			}
			else if (obj.value[0].value == "al") {
				this.al = obj.value[1].value;
			}
			else if (obj.value[0].value == "by") {
				this.by = obj.value[1].value;
			}
			else if (obj.value[0].value == "offset") // 这里是 offset 的值
			{
				this.offset = obj.value[1].value;
			}
		}
	},
	render() {
		this.createPanel()
	},
	createPanel: function () { // 创建歌词面板
		let i = 0;
		// $(this.obj).html("");
		const panel = document.querySelector(this.selector)
		if (!panel) {
			return
		}
		panel.innerHTML = ""
		for (i = 0; i < this.lyricParseList.length; i++) {
			const node = document.createElement("div")
			node.innerHTML = this.lyricParseList[i].txt
			const className = this.lyricClass + '_' + i
			// node.style = this.lyricCSS
			node.classList.add(this.lyricClass)
			node.classList.add(className)
			panel.appendChild(node);
		}
	},
	highlight() {
		// const class = this.lyricClass
		const highlightEl = document.querySelector(`.${this.highlightClass}`) as HTMLDivElement
		if (highlightEl) {
			highlightEl.classList.remove(this.highlightClass)
		}
		const newHighlightEl = document.querySelector(`.${this.lyricClass}_${this.lyricLine}`) as HTMLDivElement
		if (newHighlightEl) {
			newHighlightEl.classList.add(this.highlightClass)
			newHighlightEl.scrollIntoView({ block: 'center' })
		}
	},
	getLyricLine(currentTime: number) {
		// const timeList = this.timeList
		const lyricLine = this.lyricLine
		const lyricParseList = this.lyricParseList 

		if (lyricLine >= lyricParseList.length) {
			return lyricLine
		}

		// 需要判断this.lyricList对应得内容不为空。包含空格
		if (currentTime >= lyricParseList[lyricLine].time) {
			// 快进
			for (let i = lyricParseList.length - 1; i >= lyricLine; i--) {
				if (currentTime >= lyricParseList[i]) {
					return i;
				}
			}
		} else {
			// 后退
			for (let i = 0; i <= lyricLine; i++) {
				if (currentTime <= lyricParseList[i].time) {
					return i - 1;
				}
			}
		}
		return lyricLine
	},
	update(lyric: string) {
		this.timeList = []
		this.lyricList = []
		this.lyricParseList = []
		this.lyric = lyric
		this.parse()
		const lyricParseList = this.parseLyric(lyric)
		this.lyricParseList = lyricParseList
		console.log('lyric.ts parseLyric data=', { lyricParseList, time: this.time, lyricList: this.lyricList, timeList: this.timeList })
		this.render()
	},
	reset() {
		// 
		this.lyricLine = 0
		this.play(0)
	},
	play(time: number) {
		if (this.lyricLine == this.timeList.length) return;
		this.lyricLine = this.getLyricLine(time)
		this.highlight()
		this.lyricLine++
	}
}

export default lyricUtil