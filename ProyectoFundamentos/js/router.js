function routingi(router){
    $('#main-containerEncargado').load('/ProyectoFundamentos/views/Admin/'+router+'.html');
}



$("#citas").on('click',function(){routingi("citas")});
$("#CitasDoctor").on('click',function(){routingi("CitasDoctor")}); 