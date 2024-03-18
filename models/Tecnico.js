const {Schema,model} = require('mongoose');

const TecnicoSchema = Schema({
    
    nombre:{
        type:String,
        required:true
    },
    apellidos: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true,
    },
    unidad_medica: {
        type: String,
        required: true
    },
    is_delete:{
        type:Boolean,
        required:true
    },
    area:{
        type:String,
        required:true
    },
});

module.exports = model('Tecnico',TecnicoSchema);