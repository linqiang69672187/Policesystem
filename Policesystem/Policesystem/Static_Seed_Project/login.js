import "./login.html"

Template.login.onRendered(function () {
    createCode();
});

//创建验证码
function createCode() {
    var code = "";
    var codeLength = 4; //验证码的长度
    var checkCode = document.getElementById("checkCode");
    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
    for (var i = 0; i < codeLength; i++)
    {
        var charNum = Math.floor(Math.random() * 52);
        code += codeChars[charNum];
    }
    if (checkCode)
    {
        checkCode.className = "code";
        checkCode.innerHTML = code;
    }
    return code;
}

//报警 ele:document txt:报警内容
function  createUserAlarm($ele,txt){
    var $doc=$ele;
    var _arlarmHtml='<label id="VerificationCode-error" class="error"  style="display: inline-block;">'+txt+'</label>';
    $doc.addClass("input_danger");
    $doc.after(_arlarmHtml);
}
//禁止输入空格
function  delespace($ele){
    var _value=$ele.val().trim();
    $ele.val(_value);
}
//密码最小长度验证
function input_minlenthtest($ele) {
    var _minlength=parseInt($ele.attr("minlength"));  //最少长度
    var _val=$ele.val();
    if(_val==''){

    }else {
        if(_val.length<_minlength){
            createUserAlarm($ele,"长度至少为"+_minlength);
        }
    }
}
//输入验证码小于验证长度
function cote_lenthtest($ele) {
    var _length=parseInt($ele.attr("checkCodelength"));
    var _val=$ele.val();
    if(_val==''){

    }else {
        if(_val.length<_length){
            createUserAlarm($ele,"长度为"+_length);
        }
    }
}
//登录错误提醒: parm1:错误ID，parm2：错误内容
function  loginErrorInfor(parm1,parm2) {
    switch(parm1){
        case '0x1000':  createUserAlarm($("#userpassword"),parm2);break;//密码错误
        case '0x2000':  createUserAlarm($("#userName"),parm2) ;break;//用户名输入错误
        case '0x2001':  createUserAlarm($("#userName"),parm2);break;//账户禁用
    }
}

Template.login.events({
    "click #checkCode":function (e,instance) {
        createCode();
    },
    "keyup form input":function (e,instance) {
        var $doc=$(e.target);
        delespace($doc);
    },
    "focus form input":function (e,instance) {
        var $doc=$(e.target);
        if($doc.is(".input_danger")){
            $doc.next().remove();
            $doc.removeClass("input_danger");
        }
    },
    "blur #userpassword":function (e,instance) {
        var $doc=$(e.target);
        input_minlenthtest($doc)
    },
    "blur #checkpassword":function (e,instance) {
        var $doc=$(e.target);
        cote_lenthtest($doc)
    },
   "click #loginBtn":function(){
       var _userName=$("#userName").val();
       var _password= $("#userpassword").val().toUpperCase();
       var _checkpassword=$("#checkpassword").val().toUpperCase();
       var _checkCode= $("#checkCode").text().toUpperCase();
       if($(".loginForm").find("#VerificationCode-error").length!=0){
           createCode();
           return;
       }else {
           if(_userName==""){
               createCode();
               createUserAlarm($("#userName"),"用户名不能为空");
               return ;
           }
           if(_password==""){
               createCode();
               createUserAlarm($("#userpassword"),"密码不能为空");
               return ;
           }
           if(_checkpassword==""){
               createUserAlarm($("#checkpassword"),"验证码不能为空");
               createCode();
               return ;
           }
           if(_checkpassword===_checkCode){
               var _passwordMD5=CryptoJS.MD5(_password).toString();
               Meteor.call("userLogin",_userName,_passwordMD5,function(error,result){
                   if(result.success){
                   	debugger;
                       sessionStorage.setItem("userId",result.result.userId);
                       sessionStorage.setItem("userName",result.result.userName);
                       sessionStorage.setItem("sjtjqx",result.result.sjtjqx);
                       sessionStorage.setItem("czspqx",result.result.czspqx);
                       sessionStorage.setItem("jwtqx",result.result.jwtqx);
                       sessionStorage.setItem("yhszqx",result.result.yhszqx);
                       sessionStorage.setItem("gjszqx",result.result.gjszqx);
                       sessionStorage.setItem("sbszqx",result.result.sbszqx);
                       FlowRouter.go("/orgstructure1");
                   }
                   else {
                       var _Errorinforcode=result.Errorinfor;
                       var _Errorinfortxt=result.msg;
                       loginErrorInfor(_Errorinforcode,_Errorinfortxt);
                   }
                   createCode();
               });
               console.log(_passwordMD5);
           }else {
               createCode();
               createUserAlarm($("#checkpassword"),"验证码输入错误");
           }

       }



       // FlowRouter.go("/index");
   }
});