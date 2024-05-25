import Joi from 'joi';

const crearProyectoSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .required()
    .min(3)
    .max(50)
    .error(new Error('El nombre debe tener entre 3 y 50 caracteres')),
  descripcion: Joi.string()
    .trim()
    .required()
    .min(5)
    .max(255)
    .error(new Error('La descripción debe tener entre 5 y 255 caracteres')),
  fechaEntrega: Joi.date().optional().allow(null),
  cliente: Joi.string()
    .trim()
    .required()
    .min(3)
    .max(50)
    .error(new Error('El nombre del cliente debe tener entre 3 y 50 caracteres')),
});

export default crearProyectoSchema