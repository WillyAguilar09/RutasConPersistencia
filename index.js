const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());


function leerUsuarios(){
    const data = fs.readFileSync('Usuarios.json','utf-8');
    return JSON.parse(data);
}

function guardarUsuarios(usuarios){
    fs.writeFileSync('Usuarios.json',JSON.stringify(usuarios, null, 2));
}


//verbos http

// Devolver todos los usuarios en la base
app.get('/usuarios', (req,res)=>{
    const usuarios = leerUsuarios();
    res.json(usuarios);
});

//get con filtro
app.get('/usuarios/:id', (req,res)=>{
  
    const id = parseInt(req.params.id);    
    const usuarios = leerUsuarios();  

    const filtrarUsuarios = usuarios.filter(u => u.id === id);

    if(filtrarUsuarios.length > 0){
        res.json({mensaje:'Ok',filtrarUsuarios});
    }else{
        res.status(400).json({mensaje:'Usuario no encontrado'});
    }   
});

app.post('/usuarios', (req,res)=>{
    let usuario = req.body;
    const usuarios = leerUsuarios();
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    res.status(201).json({mensaje:'Registro exitoso',usuario});
});

//actualizando
app.put('/usuarios/:id', (req,res)=>{
    
    const id = parseInt(req.params.id);

    //el body de la solicitud (postman)
    let actusuario = req.body;
    const usuarios = leerUsuarios();
    let existe = false;

    usuarios.forEach(user =>{
        if(user.id === id){
            existe= true;
            user.nombre = actusuario.nombre;
            user.email = actusuario.email;
            user.telefono = actusuario.telefono;
        }
          
    });

    if(existe){
        res.status(200).json({mensaje: 'Registro actualizado', actusuario});
        guardarUsuarios(usuarios);
    }else{
        res.status(400).json({mensaje: 'Registro no encontrado'});
    }
    
});

app.delete('/usuarios/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    const usuarios = leerUsuarios();

    const filtrarUsuarios = usuarios.filter(u => u.id !== id);

    if(filtrarUsuarios.length !== usuarios.length){
        guardarUsuarios(filtrarUsuarios);
        res.status(201).json({mensaje: 'Usuario eliminado'});
    }
    else{
        res.status(400).json({mensaje: 'Usuario no encontrado'});
    }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
