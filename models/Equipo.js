const {Schema,model} = require('mongoose');

const EquipoMedicoSchema = Schema({
    _id: { type: String, required: true },
    marca:{
        type:String,
        required:true
    },
    modelo: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,

        required: true
    },
    fecha_fabricacion: {
        type: String,
        required: true,
    },
    fecha_instalacion: {
        type: String,
        required: true
    },
    fecha_agregado:{
        type:String,
        required:true
    },
    id_admin:{
        type:String,
        required:true
    },
    is_delete:{
        type:Boolean,
        required:true
    },
});

module.exports = model('EquipoMedico',EquipoMedicoSchema);