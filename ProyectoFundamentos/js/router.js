function routingi(router){
    $('#main-containerEncargado').load('/ProyectoFundamentos/views/Admin/'+router+'.html');
}



$("#citas").on('click',function(){routingi("citas")});
$("#CitasDoctor").on('click',function(){routingi("CitasDoctor")}); 
$("#citaspaciente").on('click',function(){routingi("citaspaciente")});
$("#paciente").on('click',function(){routingi("paciente")});
$("#doctor").on('click',function(){routingi("doctor")});