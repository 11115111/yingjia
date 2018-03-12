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
    var queryDone=false;
    var querying=false;
    var endTime=new Date($('#object_description').find('span.name').filter(function() {
        return $(this).text().indexOf('筹款时间') == 0;
    }).first().siblings('span.content').first().text()).valueOf();
    var thisRef=window.location.href;
    var pattern='loanId=';
    var LoanId=thisRef.substr(pattern.length+thisRef.indexOf(pattern));

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

    function preInvestLocal(LoanId) {
        console.log('preInvestLocal');

        if(!querying && !queryDone) {
            querying=true;
            $('#fullInvest').click();
            OpAjax('./depository/preInvest',{amount:$('#investAmountInput').val(),loanId:LoanId},function (data) {
                if(data.code==0){
                    orderId=data.data.orderId;
                    if(userAccountDetail.isOpenCFCA==false){
                        console.log(data.msg);
                    }else {
                        queryDone=true;
                        transactionPwd_verification();
                    }
                }else {
                    console.log(data.msg);
                    if(!queryDone) {
                        setTimeout(function(){
                            preInvestLocal(LoanId);
                        }, 200);
                    }
                }
                querying=false;
            });
        }
    }

    function loopQuery(){
        var loop=setInterval(function(){
            var btn = $("#btn_container").find('#loanviewsbtn').first();
            if(btn.length > 0 && !querying && !queryDone) {
                $('#fullInvest').click();
                querying=true;
                btn.click();
                queryDone=true;
                console.log("done");
                clearInterval(loop);
            } else if(queryDone) {
                clearInterval(loop);
            }
        },0);
    }

    setTimeout(function(){
        OpAjax("./depository/getAccountInfo",{},function (data) {
            if(data.code==0){

                if($("#myHint").length <= 0) {
                    $('#fullInvest').click();
                    $("#your_interest").parent().html($("#your_interest").parent().html() + '<span id="myHint" style="color:red">   抢标中</span>');

                    if(endTime - new Date().valueOf() - 1000 > 0) {
                        setTimeout(function(){
                            preInvestLocal(LoanId);
                        }, endTime - new Date().valueOf() - 1000);
                    }
                    loopQuery();
                }
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
