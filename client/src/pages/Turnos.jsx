import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { createTurnoRequest } from '../api/turnos.api';
import * as Yup from 'yup';
import moment from 'moment';
import Swal from 'sweetalert2';



export const Turnos = () => {
  const usuario_id = parseInt(localStorage.getItem('usuario_id'));
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    dia: Yup.date()
      .min(moment().add(1, 'days').toDate(), 'El día del turno debe ser mayor al día actual')
      .test('day-of-week', 'No se permiten turnos los domingos', (value) => {
        return moment(value).day() !== 0;
      })
      .required('Requerido'),
    hora: Yup.string()
      .test('valid-time', 'Hora no válida', (value) => {
        const hour = parseInt(value.split(':')[0]);
        const minute = parseInt(value.split(':')[1]);
        return (hour >= 9 && hour < 13) || (hour >= 18 && hour < 22);
      })
      .required('Requerido'),
    mascota: Yup.string()
      .required('Requerido'),
    descripcion: Yup.string()
      .required('Requerido'),
  });

  return (
    <div className="container mx-auto">
    <Formik
     initialValues={{ dia: '', hora: '', mascota: '', descripcion: '', usuario_id: usuario_id }}
      validationSchema={validationSchema}
      onSubmit={ async (values, actions) => {
        const response = await createTurnoRequest(values)

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Turno creado',
            text: 'Turno creado correctamente',
          }).then(() => {
            
            navigate('/mis-turnos');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el turno',
          });
        }
        actions.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dia">
              Día del turno
            </label>
            <Field type="date" name="dia" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <ErrorMessage name="dia" component="div" />
          </div>
          <div className='mb-4'>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hora">
            Hora del turno
          </label>
          <Field as="select" name="hora" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <optgroup label="Mañana">
              <option value="9:00">9:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
            </optgroup>
            <optgroup label="Tarde">
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
            </optgroup>
          </Field>
          <ErrorMessage name="hora" component="div" />
        </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mascota">
              Nombre de la mascota
            </label>
            <Field type="text" name="mascota" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <ErrorMessage name="mascota" component="div" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
              Descripción
            </label>
            <Field type="text" name="descripcion" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <ErrorMessage name="descripcion" component="div" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Enviar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
  )
}

