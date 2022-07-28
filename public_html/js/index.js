/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';
var DB = 'EmpDB';
var Rel = 'EmpData';
var tok = '90938939|-31949289339902450|90941126';

$('#empId').focus();

function disablectrl(ctr)
{
    $('#new').prop('disabled',ctr);
    $('#save').prop('disabled',ctr);
    $('#edit').prop('disabled',ctr);
    $('#change').prop('disabled',ctr);
    $('#reset').prop('disabled',ctr);
}

function disablenav(ctr)
{
    $('#first').prop('disabled',ctr);
    $('#prev').prop('disabled',ctr);
    $('#next').prop('disabled',ctr);
    $('#last').prop('disabled',ctr);
}

function disableform(ctr)
{
    $('#empId').prop('disabled',ctr);
    $('#empName').prop('disabled',ctr);
    $('#sal').prop('disabled',ctr);
    $('#hra').prop('disabled',ctr);
    $('#da').prop('disabled',ctr);
    $('#ded').prop('disabled',ctr);
}

function initform()
{
    localStorage.removeItem("first_rec");
    localStorage.removeItem("last_rec");
    localStorage.removeItem("rec");
    localStorage.removeItem("recno");
    
    console.log("initform");
}

function setcurrLS(obj)
{
    var data=JSON.parse(obj.data);
    localStorage.setItem("rec",data.rec_no);
}

function getcurrLS()
{
    return localStorage.getItem("rec");
}

function setfirstLS(obj)
{
    var data=JSON.parse(obj.data);
    if(data.rec_no===undefined)
    {
        localStorage.setItem("first_rec",'0');
    }
    else{
        localStorage.setItem("first_rec",data.rec_no);
    }
}

function getfirstLS()
{
    return localStorage.getItem("first_rec");
}

function setlastLS(obj)
{
    var data=JSON.parse(obj.data);
    if(data.rec_no===undefined)
    {
        localStorage.setItem("last_rec",'0');
    }
    else{
        localStorage.setItem("last_rec",data.rec_no);
    }
}

function getlastLS()
{
    return localStorage.getItem("last_rec");
}


function resetform()
{
    disablectrl(true);
    disablenav(true);
    
    var req=createGET_BY_RECORDRequest(tok,DB,Rel,getcurrLS());
    jQuery.ajaxSetup({async:false});
    var res=executeCommand(req,jpdbIRL);
    showData(res);
    jQuery.ajaxSetup({async:true});
    
    if(isOnlyOneRecordPresent() || isNoRecordPresentLS())
    {
        disablenav(true);
    }
    
    $('#new').prop('disabled',false);
    if(isNoRecordPresentLS())
    {
        emptyform();
        $('#edit').prop('disabled',true);
    }
    else{
        $('#edit').prop('disabled',false);
    }
    disableform(true);
}


function showData(obj)
{
    if(obj.status===400)
    {
        return;
    }
    
    var rec=(JSON.parse(obj.data)).record;
    setcurrLS(obj);
    
    $('#empId').val(rec.id);
    $('#empName').val(rec.name);
    $('#sal').val(rec.BasicSalary);
    $('#hra').val(rec.HRA);
    $('#da').val(rec.DA);
    $('#ded').val(rec.Deduction);
    
    disablenav(false);
    disableform(true);
    
    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    
    $('#new').prop('disabled',false);
    $('#edit').prop('disabled',false);
    
    if(getcurrLS()===getlastLS())
    {
        $('#next').prop('disabled',true);
        $('#last').prop('disabled',true);
    }
    
    if(getcurrLS()===getfirstLS())
    {
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
    }
    return;
}

function getfirst()
{
    var req= createFIRST_RECORDRequest(tok,DB,Rel);
    jQuery.ajaxSetup({async: false});
    var res=executeCommand(req,jpdbIRL);
    showData(res);
    setfirstLS(res);
    jQuery.ajaxSetup({async: true});
    $('#empId').prop('disabled',true);
    $('#first').prop('disabled',true);
    $('#prev').prop('disabled',true);
    $('#next').prop('disabled',false);
    $('#save').prop('disabled',true);
}

function getprev()
{
    var r=getcurrLS();
    if(r===1)
    {
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
    }
    var req=createPREV_RECORDRequest(tok,DB,Rel,r);
    jQuery.ajaxSetup({async:false});
    var res=executeCommand(req,jpdbIRL);
    showData(res);
    jQuery.ajaxSetup({async:true});
    r=getcurrLS();
    if(r===1)
    {
        $('#first').prop('disabled',true);
        $('#prev').prop('disabled',true);
    }
    $('#save').prop('disabled',true);
}

function getnext()
{
    var r=getcurrLS();
    
    var req=createNEXT_RECORDRequest(tok,DB,Rel,r);
    jQuery.ajaxSetup({async:false});
    var res=executeCommand(req,jpdbIRL);
    showData(res);
    jQuery.ajaxSetup({async:true});
    
    $('#save').prop('disabled',true);
}

function getlast()
{
    var req=createLAST_RECORDRequest(tok,DB,Rel);
    jQuery.ajaxSetup({async: false});
    var res=executeCommand(req,jpdbIRL);
    setlastLS(res);
    showData(res);
    jQuery.ajaxSetup({async: true});
    $('#first').prop('disabled',false);
    $('#prev').prop('disabled',false);
    $('#last').prop('disabled',true);
    $('#next').prop('disabled',true);
    $('#save').prop('disabled',true);
    
}

function isNoRecordPresentLS()
{
    if(getfirstLS()==='0' && getlastLS()==='0')
    {
        return true;
    }
    return false;
}

function isOnlyOneRecordPresent()
{
    if(isNoRecordPresentLS())
    {
        return false;
    }
    if(getfirstLS()===getlastLS())
    {
        return true;
    }
    return false;
}

function checkNOor1rec()
{
    if(isNoRecordPresentLS())
    {
        disableform(true);
        disablenav(true);
        disablectrl(true);
        $('#new').prop('disabled',false);
        return;
    }
    if(isOnlyOneRecordPresent())
    {
        disableform(true);
        disablenav(true);
        disablectrl(true);
        $('#new').prop('disabled',false);
        $('#edit').prop('disabled',false);
        return;
    }
}

function newform()
{
    emptyform();
    disableform(false);
    $('#empId').focus();
    disablenav(true);
    disablectrl(true);
    
    $('#save').prop('disabled',false);
    $('#reset').prop('disabled',false);
    
}

function emptyform()
{
    $('#empId').val("");
    $('#empName').val("");
    $('#sal').val("");
    $('#hra').val("");
    $('#da').val("");
    $('#ded').val("");
}

function validate() {

    var empIdVar = $("#empId").val();  
    if (empIdVar === "") {
        alert("Employee ID Required");
        $("#empId").focus();
        return "";
    }
    
    var nameVar = $("#empName").val();  
    if (nameVar === "") {
        alert("Employee Name Required");
        $("#empName").focus();
        return "";
    }
    
    var salVar = $("#sal").val();  
    if (salVar === "") {
        alert("Employee Salary Required");
        $("#sal").focus();
        return "";
    }
    
    var hraVar = $("#hra").val();  
    if (hraVar === "") {
        alert("Employee HRA Required");
        $("#hra").focus();
        return "";
    }
    
    var daVar = $("#da").val();  
    if (daVar === "") {
        alert("Employee DA Required");
        $("da").focus();
        return "";
    }
    
    var dVar = $("#ded").val();  
    if (dVar === "") {
        alert("Employee DA Required");
        $("#ded").focus();
        return "";
    }
    
    var jsonStrObj = {
        id: empIdVar,
        name: nameVar,
        BasicSalary: salVar,
        HRA: hraVar,
        DA: daVar,
        Deduction: dVar
    };
    return JSON.stringify(jsonStrObj);
}

function savedata()
{
    var jsonObj = validate();
    if(jsonObj==='')
    {return "";}
    console.log("step 1");
    var putReq=createPUTRequest(tok, jsonObj,DB, Rel);
    jQuery.ajaxSetup({async: false});
    var resObj=executeCommand(putReq, jpdbIML);
    jQuery.ajax({async: true});
    if(isNoRecordPresentLS())
    {
        setfirstLS(resObj);
    }
    setlastLS(resObj);
    setcurrLS(resObj);
    resetform();
}

function editdata()
{
    disableform(false);
    $('#empId').prop('disabled',true);
    $('#empName').focus();
    
    disablenav(true);
    disablectrl(true);
    $('#change').prop('disabled',false);
    $('#reset').prop('disabled',false);
}

function changedata()
{
    jsonchg=validate();
    var req=createUPDATERecordRequest(tok,jsonchg,DB,Rel,getcurrLS());
    jQuery.ajaxSetup({async:false});
    var obj=executeCommand(req, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(obj);
    resetform();
    /*$('#empId').focus();
    $('#edit').focus();*/
}

initform();
getfirst();
getlast();
checkNOor1rec();