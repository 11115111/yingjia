// ==UserScript==
// @name         佳兆业投标
// @namespace    https://www.kaisafax.com
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.kaisafax.com/loan/loanDetail?loanId=*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	// Your code here...
	var userInput="";
	var passwordInput="";
	function OpAjaxLocal(Url,Data,callFun){
		var ectData=Data,ectUrl=Url;
		if(isRsa=='true'){
			if(rsaUrlArr.length>0){
				if (ectUrl.substr(0,1)=='.') ectUrl=ectUrl.substr(1);
				// var isExist=rsaUrlArr.indexOf(ectUrl)
				var isExist = $.inArray(ectUrl, rsaUrlArr);
				if(isExist!=-1){
					var ectStr=ect.encrypt(JSON.stringify(Data));
					var rsaStr = zip(ectStr);
					ectData={encodeString:rsaStr};
				}
			}
		}
		_Ajax(Url,ectData,function(data,status){
			if(callFun && typeof callFun == 'function') {
				callFun(data,status);
			}else if(data){
				if(data.code == '-1' && data.success == false){
					if(data.msg && data.msg != ""){
						console.log('ajaxshowtip 操作失败');
					}else{
						console.log('ajaxshowtip 操作失败');
					}
				}else if(data.code == '0' && data.success == true){
					console.log('ajaxshowtip 操作成功');
				}else{
					console.log('ajaxshowtip 操作失败');
				}
			}
		},"notEmpty");

	}
  
	setTimeout(function(){
		OpAjaxLocal("./depository/getAccountInfo",{},function (data) {
			if(data.code==0){
				var btn = $("#btn_container").children()[0];
				var loop=setInterval(function(){
					if(btn.id==="loanviewsbtn") {
						$('#fullInvest').click();
						$(btn).click();
						clearInterval(loop);
					}
				},0);
			} else {
				var loginData={
					username:userInput,
					password:passwordInput
				};
				OpAjax("./login/login",loginData, function(data){
					if(data.code =='0' && data.data && data.data.userId){
						console.log("登录成功");
						location.reload();
					} else {
						console.log("登录失败");
					}
				});
			}
		});
	},500);
})();