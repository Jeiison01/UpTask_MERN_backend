import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"
import winston from 'winston'

const obtenerProyectos = async (req, res) => {
  const userId = req.usuario._id; // Extract user ID

  try {
    const proyectos = await Proyecto.find({
      '$or': [
        { colaboradores: { $in: userId } },
        { creador: { $in: userId } },
      ],
    }).select('-tareas');
    res.json(proyectos);

    winston.info(`Usuario ${userId} obtuvo lista de proyectos.`); // Log project retrieval
  } catch (error) {
    winston.error(`Error al obtener proyectos para usuario ${userId}: ${error.message}`);
    console.error(error); // Still log to console for debugging
    res.status(500).json({ msg: 'Error al obtener proyectos' });
  }
};
const nuevoProyecto = async (req, res) => {
  const userId = req.usuario._id; // Extract user ID
  const proyecto = new Proyecto(req.body);
  proyecto.creador = userId;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);

    winston.info(`Usuario ${userId} creó un nuevo proyecto: ${proyectoAlmacenado._id}`); // Log project creation
  } catch (error) {
    winston.error(`Error al crear proyecto para usuario ${userId}: ${error.message}`);
    console.error(error);
    res.status(500).json({ msg: 'Error al crear proyecto' });
  }
};

const obtenerProyecto = async (req, res) => {
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)
        .populate({path: 'tareas', populate:{path: 'completado', select: 'nombre'}})
        .populate('colaboradores', "nombre email")

    if(!proyecto){
        const error = new Error('No Encontrado');
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString() && 
        !proyecto.colaboradores.some( colaborador => colaborador._id.toString() === req.usuario._id.toString())){
        const error = new Error('Acción No Válida');
        return res.status(401).json({msg: error.message})
    }

    res.json(proyecto)
}

const editarProyecto = async (req, res) => {
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error('No Encontrado');
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción No Válida');
        return res.status(401).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }

}

const eliminarProyecto = async (req, res) => {
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error('No Encontrado');
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción No Válida');
        return res.status(401).json({msg: error.message})
    }
    try {
        await proyecto.deleteOne()
        res.json({msg: "Proyecto Eliminado"})
    } catch (error) {
        console.log(error)
    }
}

const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v');
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    winston.error(`Error al buscar colaborador con email ${email}: ${error.message}`);
    console.error(error);
    res.status(500).json({ msg: 'Error al buscar colaborador' });
  }
};

const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);
    
    if(!proyecto){
        const error = new Error('Proyecto No encontrado')
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        
        const error = new Error('Accion No Válida')
        return res.status(404).json({msg: error.message})
    }
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg:error.message})
    }
    //El colaborador no es el admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error('El Creador del Proyecto no puede ser colaborador' )
        return res.status(404).json({msg:error.message})
    }
    //Revisar que no este ya agregado al proyecto
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El Usuario ya Pertenece al Proyecto')
        return res.status(404).json({msg:error.message})
    }
    //Esta bien, se puede agregar
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({msg: 'Colaborador Agregado Correctamente'})
}

const eliminarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);
    
    if(!proyecto){
        const error = new Error('Proyecto No encontrado')
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        
        const error = new Error('Accion No Válida')
        return res.status(404).json({msg: error.message})
    }
    //Esta bien, se puede eliminar
    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    res.json({msg: 'Colaborador Eliminado Correctamente'})
}


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
}